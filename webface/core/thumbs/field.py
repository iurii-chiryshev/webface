import json
from io import BytesIO
from django.db.models import ImageField
from django.db.models.fields.files import ImageFieldFile
from django.core.files.base import ContentFile
from PIL import Image

__author__ = 'Iurii Chiryshev <iurii.chiryshev@mail.ru>'



def generate_thumb(img, thumb_size, format):
    """
    Сгенерировать уменьшенную копию исходного изображения
    :param img: исходное изображение
    :param thumb_size: размер
    :param format: формат
    :return:
    """
    img.seek(0) # see http://code.djangoproject.com/ticket/8222 for details
    image = Image.open(img)

    # Convert to RGB if necessary
    if image.mode not in ('L', 'RGB'):
        image = image.convert('RGB')

    # get size
    image2 = image
    image2.thumbnail(thumb_size, Image.ANTIALIAS)

    temp = BytesIO()
    # PNG and GIF are the same, JPG is JPEG
    if format.upper()=='JPG': format = 'JPEG'

    image2.save(temp, format=format)
    return ContentFile(temp.getvalue())

class ImageWithThumbsFieldFile(ImageFieldFile):
    """
    Перекрытый класс ImageFieldFile - "прокси" для работы с полем картинками
    see ImageWithThumbsField for
    """
    def __init__(self, *args, **kwargs):
        super(ImageWithThumbsFieldFile, self).__init__(*args, **kwargs)
        self.sizes = self.field.sizes

        if self.sizes:
            def get_size(self, size):
                if not self:
                    return ''
                else:
                    split = self.url.rsplit('.',1)
                    thumb_url = '%s.%sx%s.%s' % (split[0],w,h,split[1])
                    return thumb_url

            for size in self.sizes:
                (w,h) = size
                setattr(self, 'url_%sx%s' % (w,h), get_size(self, size))

    def _get_urls_dict(self):
        """
        Вернуть словариком urls всех картинок.
        Пусть клиент сам решает какой размер забирать
        :return:
        """
        if not self:
            return None
        # url до картинки исходного размера
        ret = {'_': self.url}
        if self.sizes:
            # собираем url-ы уменьшеных картинок
            for size in self.sizes:
                (w,h) = size
                key = 'url_%sx%s' % (w,h)
                ret['_%sx%s' % (w,h)] = getattr(self,key)
        return ret

    urls_dict = property(_get_urls_dict)

    def save(self, name, content, save=True):
        """
        Перекрытый метод сохранения картинок.
        """
        super(ImageWithThumbsFieldFile, self).save(name, content, save)

        if self.sizes:
            # создаем и сохраняем уменьшенные копии исходной картинки
            for size in self.sizes:
                (w,h) = size
                split = self.name.rsplit('.',1)
                thumb_name = '%s.%sx%s.%s' % (split[0],w,h,split[1])

                # you can use another thumbnailing function if you like
                thumb_content = generate_thumb(content, size, split[1])

                thumb_name_ = self.storage.save(thumb_name, thumb_content)

                if not thumb_name == thumb_name_:
                    raise ValueError('There is already a file named %s' % thumb_name)

    def delete(self, save=True):
        """
        Перекрытый метод удаления картинок
        """
        name=self.name
        super(ImageWithThumbsFieldFile, self).delete(save)
        if self.sizes:
            for size in self.sizes:
                (w,h) = size
                split = name.rsplit('.',1)
                thumb_name = '%s.%sx%s.%s' % (split[0],w,h,split[1])
                try:
                    self.storage.delete(thumb_name)
                except:
                    pass

class ImageWithThumbsField(ImageField):
    """
    Перекрытый класс стандартного поля для хранения картинок.
    Цель - хотоим кроме оригинальных картинок хранить их уменьшеные копии (preview или thumbs)
    В конструкторе есть поле sizes, в котором можно указать какие размеры, кроме
    исходного будем хранить. Соответственно, на клиента отдаваться будет тот
    размер, который он захочет.
    """
    attr_class = ImageWithThumbsFieldFile
    def __init__(self, verbose_name=None, name=None, width_field=None,
                 height_field=None, sizes=None, **kwargs):
        self.verbose_name = verbose_name
        self.name         = name
        self.width_field  = width_field
        self.height_field = height_field
        self.sizes        = sizes
        super(ImageField, self).__init__(**kwargs)

    def value_to_string(self, obj):
        """
        Переопределенный метод получения строкового представления поля.
        Единствекнное "но" - строка нам не нужна, поэтому
        отдать нужно url-ы всех картинок (их размеров) в виде словарика
        see ImageWithThumbsFieldFile._get_urls_dict()
        :param obj:
        :return:
        """
        # достаем ImageWithThumbsFieldFile
        value = self.value_from_object(obj)
        if value is None:
            return None
        # вытаскиваем словарик
        return value.urls_dict