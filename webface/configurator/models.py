from django.db import models
from django.db.models import GenericIPAddressField, PositiveSmallIntegerField
from core.models import AUuidable


def def_ip():
    return '127.0.0.1'


class Camera(AUuidable):
    """
    Брольшая таблица с настройками камер и их вычислителей
    """

    # источник видео для вычислителя, строка
    # пока имеет смысл говорить только о видеофайлах, соответтсвенно, это путь до файлов
    src = models.CharField(max_length=512)

    # ip адрес устройства
    unit_ip = GenericIPAddressField(protocol='IPv4', unpack_ipv4=False, default=def_ip)

    # порт устройства
    unit_port = PositiveSmallIntegerField(default=5550)

    # порт на котором идет вещание видео
    mjpeg_port = PositiveSmallIntegerField(default=5570)

    # мнемоническое имя вычислителя cam1, cam2 и пр.
    alias = models.CharField(max_length=128, default='CAM', null=False)

    # описание камеры, например, где стоит, что снимает (вход, выход, касса, полка и пр.)
    description = models.TextField(max_length=1024)



