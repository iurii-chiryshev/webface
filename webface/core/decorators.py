from django.http import HttpResponse, HttpResponseBadRequest
from functools import wraps
from django.views.decorators.http import require_POST

__author__ = 'iurii.chiryshev'
def authorization_required(f):
    """
    Декоратор на авторизованного пользователя
    :param f:
    :return:
    """
    def decorator(request, *args):
        user = request.user
        is_authorized = user is not None and user.is_authenticated()
        if not is_authorized:
            # возвращаем именно 401 - не авторизован
            return HttpResponse('You are not authorized!', status=401)
        return f(request, *args)
    return wraps(f)(decorator)


def authorization_admin_required(f):
    """
    Декоратор на авторизованного супер пользователя
    :param f:
    :return:
    """
    @authorization_required
    def decorator(request, *args):
        user = request.user
        is_superuser = user is not None and user.is_superuser
        if not is_superuser:
            # возвращаем именно 403 - запрещено
            return HttpResponse('You are not admin!', status=403)
        return f(request, *args)
    return wraps(f)(decorator)


def post_params_required( required_params ):
    """
    Проверка, что в post запросе идут нужные параметры, значение параметров не интересует
    :param required_params:
    :return:
    """
    def decorator(f):
        @require_POST # Это POST
        def wrapper(request):
            for param in required_params:
                if not param in request.POST:
                    return HttpResponseBadRequest("Param %s is missing" % param)
            return f(request)
        return wraps(f)(wrapper)

    return decorator