import logging
from http.cookies import SimpleCookie
from django.conf import settings
from importlib import import_module
from django.contrib.auth.models import User

__author__ = 'iurii.chiryshev'

logger = logging.getLogger(__name__)
session_engine = import_module(settings.SESSION_ENGINE)


def auth_django_user_required(method):
    """
    декоратор "Требовать авторизованного djando пользователя"
    :param method:
    :return:
    """
    def wrapper(self):
        try:
            # вытащить cookie
            raw_cookie = self.headers.get('Cookie')
            cookie = SimpleCookie(raw_cookie)
            # интересует sessionid
            session_key = cookie[settings.SESSION_COOKIE_NAME].value
            # получить сессию по ключу
            session = session_engine.SessionStore(session_key)
            # получить id пользователя
            user_id = session['_auth_user_id']
            # вытащить пользователя, притом себе
            self.user = User.objects.get(pk=user_id)
            if not self.user.is_authenticated():
                # пользователь есть, но он не авторизован
                logger.debug('connection from unauthorized user: %s',self.user)
                return self.send_error(403,"Access is denied")
        except Exception as e:
            # любая ошибка на этапе получения куки, сессии и пользователя
            logger.debug('can`t get user, error: %s',str(e))
            return self.send_error(403,"Access is denied")
        # дошли досюда - вызываем метод
        logger.debug('connection from authorized user: %s',self.user)
        return method(self)
    return wrapper