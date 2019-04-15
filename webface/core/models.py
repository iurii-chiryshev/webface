from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from core.thumbs.field import ImageWithThumbsField
import os
import uuid
import json
from django.conf import settings
from django.core import serializers
from django.db import models
from django.contrib.auth.models import User as DjangoUser
from channels.channel import Group as ChannelsGroup
from core.utils import prepare_content

__author__ = 'iurii.chiryshev'

# все возможные размеры картинок для preview
# Дело вот в чем - пользователь может загрузить сколь угодно большую картинку
# Но если в клиентском приложении понадобится вывести чего-нить списком, то
# клиент устанет ждать пока 20-50 "больших" картинок подгрузятся.
preview_sizes = ((32, 32), (64, 64), (128, 128), (256, 256), (512, 512))


def img_path(instance, filename):
    """
    Вернет путь, куда сохраняются изображения.
    Вытащил в отдельную функию с тем, чтобы при запуске на разных ОС
    не делал каждый раз миграции
    :param instance: экземпляр модели
    :param filename: имя файла
    :return:
    """
    # должно получится что-нибудь типа: \media\images\<имя таблицы>\filename.jpg
    return os.path.join("images", instance._meta.db_table, filename)


def uuid4_str():
    """
    Генератор строковых uuid
    :return: str
    """
    return str(uuid.uuid4())

def model_to_dict(model, *, exclude=None, **option):
    """
    Преобразовать экземпляр в словарь.

    :param model:
    :param exclude: список, тех полей, которые нужно исключить, либо включить только
    :param option: see опции serialize()
    :return python словарь
    """
    # метод просит iterable, поэтому [ obj, ]
    # python сериализатор вернет список с OrderedDict
    list_ord_dict = serializers.serialize('python', [model, ], **option)

    """
    оное имеет примерно такую структуру:
    [{
        "pk": 1,
        "model": "store.book",
        "fields": {
            "name": "Mostly Harmless",
            "author": 42
        }
    }]
    1. достаем первый элемент списка
    2. далее поля модели лежат в fields - вытаскиваю их
    """
    assert len(list_ord_dict) == 1
    ord_dict = list_ord_dict[0]["fields"]
    # uuid нету, поэтому добаляем
    if hasattr(model,'uuid'):
        ord_dict["uuid"] = model.uuid
    # поля, которые нужно исключить по каким-то соображениям
    if exclude:
        return {key: ord_dict[key] for key in set(ord_dict.keys()) - set(exclude)}
    return ord_dict


class AUuidable(models.Model):
    """
    Абстрактый предок всех сущностей, где в качестве первичного ключа идет uuid

    Не стоит привязываться к этим полям create и last_update. Они сделаны просто чтобы мониторить.
    какая сущность и когда была создана/изменена была
    """

    # первичный ключ
    uuid = models.CharField(max_length=64, primary_key=True, null=False, default=uuid4_str)

    # время создания,
    # выставится само один раз при создании сущности
    create = models.DateTimeField(auto_now_add=True)

    # время последнего изменения
    # меняется каждый раз при редактировании сущности
    last_update = models.DateTimeField(auto_now=True)

    # метод превращения в словарик
    def to_dict(self, *, exclude=None, **option):
        return model_to_dict(self,exclude=exclude, **option)

    class Meta:
        abstract = True


class Group(AUuidable):
    """
    Группы пользователей
    """

    # имя групы
    name = models.CharField(max_length=256)




class WebfaceUser(AUuidable):
    """
    Наш "webface" пользователь. Поля типа имя, фамилия, email можно вытащить из django пользователя,
    поэтому здесь их нету
    """

    # Оригинальный джанговый пользователь. Одноврменно по related_name можно из оригинального джангового
    # получить нашего пользователя.
    django_user = models.OneToOneField(DjangoUser,
                                       to_field="id",
                                       db_column="django_user_id",
                                       related_name="webface_user",
                                       on_delete=models.CASCADE,
                                       null=False)

    # аватарка если есть
    image = ImageWithThumbsField(upload_to=img_path,
                                 sizes=preview_sizes)

    # группы к которым относится пользователь
    groups = models.ManyToManyField(to=Group,
                                      related_name="users")  # название обратной связи у Group


    def to_dict(self, *, exclude=None, **option):
        """
        Переопределяем метод базового класса
        """
        exc_field = ['groups'] # исключаемые поля
        if exclude and isinstance(exclude,list):
            exclude = exclude.extend(exc_field)
        else:
            exclude = exc_field
        # себя
        ret = super(WebfaceUser, self).to_dict(exclude=exclude, **option)
        # django user
        django_ret = model_to_dict(self.django_user,exclude=exclude)
        # соединяем
        for key, value in django_ret.items():
            ret[key] = value

        return ret

@receiver(post_save, sender=DjangoUser)
def _on_create_user(sender, instance, created, **kwargs):
    """
    Слушаем, когда создается джаного пользователь, создаем нашего и привязываем их друг к другу.
    Тем самым избаляем себя работать с обоими пользователями, т.е. всегда работаем только с джаного пользователем,
    из него получаем нашего и делаем с ним что хотим.
    Его даже записывать не надо
    \code
    django_user = User()
    webface_user = django_user.webface_user
    # чего-то делаем с webface_user и записываем
    ...
    django_user.save()
    \endcode
    """
    if created:
        WebfaceUser.objects.create(django_user=instance)
@receiver(post_save, sender=DjangoUser)
def _on_save_user(sender, instance, **kwargs):
    """
    Слушаем запись dj пользователя и записываем нашего
    """
    instance.webface_user.save()


class Menu(AUuidable):
    """
    Модель древовидного меню
    """

    # Имя группы, в которой транслируются сообщения channels при изменении меню
    GROUP_NAME = 'Menu'

    # родительский узел для этого узла
    parent = models.ForeignKey('self',
                                to_field="uuid",
                                db_column="parent_uuid",
                                related_name="childs", # как обратиться к детям
                                null=True,
                                default=None,
                                on_delete=models.CASCADE) # удаляется parent - удаляются все дочерние элементы

    # является ли этот узел листом (в противном случае - это узел, который может содержать дочерние элементы)
    leaf = models.BooleanField(default=False)

    # глиф элемента из FontAwesome v. 4.7.
    # по умолчанию знак вопроса
    glyph = models.CharField(max_length=256, default="xf128@FontAwesome")

    # имя класса панели (extjs xtype), которая будет показываться при нажатии на узел если он leaf
    module_xtype = models.CharField(max_length=256)

    # имя или заголовок панели
    text = models.CharField(max_length=256)

    # группы пользователй, которые видят этот узел
    groups = models.ManyToManyField(to=Group,
                                      related_name="menus")  # название обратной связи у Group



    @classmethod
    def add_listener(cls,channel):
        """
        Добавить слушателя на изменеия моделей
        :param channel:
        :return:
        """
        ChannelsGroup(cls.GROUP_NAME).add(channel)

    @classmethod
    def discard_listener(cls,channel):
        """
        Отцепить слушателя на изменеия моделей
        :param channel:
        :return:
        """
        ChannelsGroup(cls.GROUP_NAME).discard(channel)

    def to_dict(self, *, exclude=None, **option):
        """
        Переопределяем метод базового класса
        """
        exc_field = ['parent','groups'] # исключаемые поля
        if exclude and isinstance(exclude,list):
            exclude.extend(exc_field)
        else:
            exclude = exc_field
        ret = super(Menu, self).to_dict(exclude=exclude, **option)
        if self.parent and hasattr(self.parent,'uuid'):
            # подмешать parent_uuid
            ret['parent_uuid'] = self.parent.uuid
            # это просит extjs, иначе
            ret['parentId'] = self.parent.uuid
        return ret

    @staticmethod
    def get_lineal_data(menus_qs,empty_parent = True,target_groups = None):
        """
        Спуститься вниз по дереву начиная с menus и собрать все дерево в линейный список
        + проверка на принадлежность (видимость) по группам
        :param menus_qs: querySet с которого все начинается
        :param empty_parent: нужно ли добавлять узловые ноды, если в них нет детей
        :param target_groups: групы (set)
        :return: линейный список всего дерева меню
        """
        ret = []
        for menu in menus_qs:
            if menu.leaf:
                # это лист
                if target_groups is None:
                    # нет проверки на группы, например, для супера
                    # добавляем лист
                    ret.append(menu.to_dict())
                elif isinstance(target_groups, set):
                    # группы есть - проверяем на перечечение
                    menu_groups = menu.groups.values_list('uuid', flat=True)
                    if not target_groups.isdisjoint(menu_groups):
                        # есть пересечение по группам - этот лист в список
                        ret.append(menu.to_dict())
            else:
                # это узел - запускаем ф. для его поддерева
                subset = Menu.get_lineal_data(menu.childs.all(),empty_parent,target_groups)
                if len(subset) > 0:
                    # поддерево не пустрое - довавить этот "родительский" узел
                    ret.append(menu.to_dict())
                    # добаввить само поддерево
                    ret.extend(subset)
                elif empty_parent:
                    # поддерево пустое, но выставлен флаг - добавлять пустые узлы
                    # так и делаем
                    ret.append(menu.to_dict())
        return ret

@receiver(post_save, sender=Menu)
def _on_save_menu(sender, instance, **kwargs):
    """

    :param sender:
    :param instance:
    :param kwargs:
    :return:
    """
    data = {
        'event': Menu.GROUP_NAME,
        'data': instance.to_dict()
    }
    ChannelsGroup(Menu.GROUP_NAME).send(content=prepare_content(data))

@receiver(post_delete, sender=Menu)
def _on_delete_menu(sender, instance, **kwargs):
    """

    :param sender:
    :param instance:
    :param kwargs:
    :return:
    """
    data = {
        'event': Menu.GROUP_NAME,
        'data': instance.to_dict()
    }
    ChannelsGroup(Menu.GROUP_NAME).send(content=prepare_content(data))