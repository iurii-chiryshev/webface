import os
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.shortcuts import render_to_response, redirect
from django.utils import translation
from django.utils.translation import get_language
from django.utils.translation import ugettext as _
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST, require_GET
from django.conf import settings
from django.http import HttpResponse, \
    JsonResponse, \
    HttpResponseNotFound, \
    HttpResponseBadRequest, \
    HttpResponseServerError, HttpResponseForbidden
from core.decorators import authorization_required, authorization_admin_required, post_params_required
from core.models import Menu, Group, WebfaceUser
from django.core.exceptions import ObjectDoesNotExist
import json
import logging



logger = logging.getLogger(__name__)



def make_settings(request):
    """
    Сформировать json строку с настройками, из которой будет сформирован javascript object
    """
    # settings.LANGUAGES это массив кортежей, в таком виде он не нужен,
    # поэтому преобразуем в ['en','ru']
    langs = [lang[0] for lang in settings.LANGUAGES]
    # user
    user = request.user
    is_authorized = user is not None and user.is_authenticated()
    is_superuser = user is not None and user.is_superuser
    username = None if not is_authorized else user.get_username()
    short_name = None if not is_authorized else user.get_short_name()
    full_name = None if not is_authorized else user.get_full_name()
    s = {
        "langs": langs,  # какие языки поддерживаем
        "default_lang": settings.LANGUAGE_CODE,  # язык по умолчанию
        "user_lang": get_language() or settings.LANGUAGE_CODE, # язык пользователя
        "is_authorized": is_authorized,  # авторизован ли этот пользователь?
        "is_superuser": is_superuser,  # является ли он супером
        "short_name": short_name, # имя
        "full_name": full_name, # полное имя
    }
    # не нашел лучший способ чем сделать json ответ и вытащить контент
    response = JsonResponse(s)
    return response.content

@ensure_csrf_cookie  # заставить view послать csrf куку
def index(request):
    """
    отдаю индексную страницу с контекстом внутри
    :param request:
    :return:
    """
    context = {
        "DJANGO_SETTINGS": make_settings(request),
        "EXTJS_BUILD": settings.EXTJS_BUILD
    }
    return render_to_response('webface/index.html', context=context)

@require_GET
def to_static(request):
    """
    На debug все запросы типа /app/... или /res/.. скорее сего просят статику
    перенаправляю на /static..
    :param request:
    :return:
    """
    return redirect("/static/webface" + request.path)

@post_params_required(['language'])
def locales(request):
    """
    Пользователь хочет получать сообщения на другом языке
    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))
    lang = request.POST['language']
    if lang not in [value[0] for value in settings.LANGUAGES]:
        return HttpResponseBadRequest("Unsupported language: %s" % str(lang))
    try:
        # устанавливаем локаль для текущего потока
        translation.activate(lang)
        # сохраняем выбор в сессию для последующих запросов
        request.session[translation.LANGUAGE_SESSION_KEY] = lang
    except Exception as e:
        return HttpResponseServerError(str(e))

    return JsonResponse({'success': True, 'msg': 'Language was changed!'})


@require_POST
def register_user(request):
    """
    Регистрация нового пользователя
    :param request:
    :return:
    """
    required_params = (
        ("username", "User name is emtpy"),  # логин
        ("last_name", "Last name is emtpy"),  # имя
        ("first_name", "First name is emtpy"),  # фамилия
        ("email", "E-mail is empty"),  # email
        ("password", "Password is emtpy"),  # сырой пароль
        ("confirm_password", "Confirm password is empty"),  # подтверждение пароля (сырой)
    )
    username = None if 'username' not in request.POST else request.POST['username']
    # вытаскиваем количество пользователей с таким именем, если имя есть
    count = 0 if username is None else User.objects.filter(username=username).count()
    if count > 0:
        # такой пользователь уже зарегистрирован
        return HttpResponseBadRequest('User name already registered')
    # создаем пользователя
    new_user = User()
    for param, param_error in required_params:
        if param not in request.POST or not request.POST[param]:
            return HttpResponseBadRequest(param_error)
        else:
            setattr(new_user, param, request.POST[param])
    # проверка на совпадение паролей
    if new_user.password != new_user.confirm_password:
        return HttpResponseBadRequest('Password confirmation error')
    try:
        # ошибок нет, создаем хэшированный пароль
        new_user.set_password(new_user.password)
        # записываем
        new_user.save()
    except Exception as e:
        return HttpResponseServerError(str(e))
    return JsonResponse({'success': True, 'msg': 'User registered!'})

@require_POST
def login_user(request):
    """
    Вход зарегистрированного пользователя
    :param request:
    :return:
    """
    username = None if 'username' not in request.POST else request.POST['username']
    password = None if 'password' not in request.POST else request.POST['password']
    # вытаскиваем пользователя по имени и паролю
    user = None if username is None or password is None else authenticate(username=username, password=password)
    if user is not None:
        # нашли пользователя
        if user.is_active:
            # он активен, привязываем сессию к авторизованному пользователю
            login(request, user)
        else:
            # он не активен,
            return HttpResponseForbidden('Account disabled')
    else:
        # нет такого пользователя
        return HttpResponseForbidden(_('Incorrect user or password'))

    return JsonResponse({'success': True, 'msg': 'User authenticated!'})

@require_POST
def logout_user(request):
    """
    Выход пользователя из системы
    :param request:
    :return:
    """
    logout(request)
    return JsonResponse({'success': True, 'msg': 'User unauthenticated!'})

@require_POST
@authorization_admin_required
def user(request, crud):
    if crud == 'c':
        return user_create(request)
    elif crud == 'r':
        return user_read(request)
    elif crud == 'u':
        return user_update(request)
    elif crud == 'd':
        return user_delete(request)
    else:
        return HttpResponseBadRequest('Bad operation: %s' % str(crud))

def user_read(request):
    """

    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))
    user = request.user # смотрим, что за пользователь
    is_superuser = user is not None and user.is_superuser # супер не супер
    if is_superuser:
        data = []
        wf_users = WebfaceUser.objects.all()
        for user in wf_users:
            data.append(user.to_dict())
        return JsonResponse({'success': True, 'data': data})
    else:
        # не достаточно прав
        return HttpResponseBadRequest("Not allowed")

def user_create(request):
    """

    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))
    HttpResponse("Not implemented",status=501)

def user_update(request):
    """

    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))
    return HttpResponse("Not implemented",status=501)

def user_delete(request):
    """

    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))
    return HttpResponse("Not implemented",status=501)

@require_POST
@authorization_required
def menu(request, crud):
    if crud == 'c':
        return menu_create(request)
    elif crud == 'r':
        return menu_read(request)
    elif crud == 'u':
        return menu_update(request)
    elif crud == 'd':
        return menu_delete(request)
    else:
        return HttpResponseBadRequest('Bad operation: %s' % str(crud))

def menu_read(request):
    """
    Чтение меню
    :param request:
    :return:
    """
    user = request.user # смотрим, что за пользователь
    is_superuser = user is not None and user.is_superuser # супер не супер

    group_set = None
    if not is_superuser:
        # обычный пользователь видит только в соответствии с группами
        try:
            # вытаскиваю его группы
            group_set = set(user.webface_user.groups.values_list('uuid', flat=True)) # группы
        except Exception as e:
           return HttpResponseServerError("User groups read error: %s" % str(e))

    node = None if 'node' not in request.POST else request.POST['node'] # какую ноду просят раскрыть
    node = None if node == 'root' else node # замена фантомной root на None
    try:
        menu_qs = Menu.objects.filter(parent = node)
    except Exception as e:
        return HttpResponseServerError( "Read parent node (%s) error: %s" % ( str(node), str(e) ) )

    try:
        # получить деревянные данные в линейном виде - списком
        data = Menu.get_lineal_data(menu_qs,is_superuser,group_set)
    except Exception as e:
        return HttpResponseServerError( "Read menu items error: %s" % str(e) )
    # результат есть - возвращаем
    return JsonResponse({'success': True, 'data': data})

@authorization_admin_required
def menu_create(request):
    """

    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))
    data = None if 'data' not in request.POST else request.POST['data'] # что создавать
    try:
        # пытаемся получить словарик из json строки, притом один единственный,
        # т.к. в пакетном режиме не работаем.
        object = json.loads(data)[0]
    except Exception as e:
        return HttpResponseServerError( "Deserialize json string (%s) error: %s" % (str(data),str(e)) )
    new_menu = Menu()
    for key, value in object.items():
        if key == 'parent_uuid' and hasattr(new_menu,'parent'):
            try:
                # смотрим и подправляем родительскую ноду
                parent = None if value == 'root' else Menu.objects.get(uuid = value)
                setattr(new_menu,'parent',parent)
            except Exception as e:
                return HttpResponseServerError( "Parent node (uuid: %s) read error: %s" % (str(key),str(e)) )
        elif hasattr(new_menu,key):
            setattr(new_menu,key,value)
    try:
        new_menu.save()
    except Exception as e:
        return HttpResponseServerError( "Save menu item error: %s" % str(e) )

    return JsonResponse({'success': True, 'msg': 'Menu create!'})

@authorization_admin_required
def menu_update(request):
    """

    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))

    data = None if 'data' not in request.POST else request.POST['data'] # что создавать
    try:
        # пытаемся получить словарик из json строки, притом один единственный,
        # т.к. в пакетном режиме не работаем.
        objects = json.loads(data)
        length = len(objects)
        if length != 1:
            return HttpResponseBadRequest( "Too many objects for update: %s" % str(length) )
        obj = objects[0]
    except Exception as e:
        return HttpResponseServerError( "Deserialize json string (%s) error: %s" % (str(data),str(e)) )
    uuid = None if 'uuid' not in obj else obj['uuid'] # что создавать
    try:
        update_menu = Menu.objects.get(uuid = uuid)
    except Exception as e:
        # нету
        return HttpResponseServerError('Read menu (uuid: %s) error: %s' % (str(uuid),str(e)))
    for key, value in obj.items():
        if key in ['uuid']:
            # эти поля ставить нет необходимости
            continue
        elif key == 'groups':
            # смотрим, какие группы пришли из запроса
            target_groups = set([item['uuid'] for item in value if 'uuid' in item])
            # какие группы есть на самом деле
            real_groups = set(update_menu.groups.values_list('uuid', flat=True))
            # какие нужно добавить
            add_groups = target_groups - real_groups
            # какие нужно удалить
            remove_groups = real_groups - target_groups

            for group_uuid in add_groups:
                group = Group.objects.get(uuid = group_uuid)
                update_menu.groups.add(group)
            for group_uuid in remove_groups:
                group = Group.objects.get(uuid = group_uuid)
                update_menu.groups.remove(group)


        elif key == 'parent_uuid' and hasattr(update_menu,'parent'):
            try:
                # смотрим и подправляем родительскую ноду
                parent = None if value is None or value == '' or value == 'root' else Menu.objects.get(uuid = value)
                setattr(update_menu,'parent',parent)
            except Exception as e:
                return HttpResponseServerError( "Parent node (uuid: %s) read error: %s" % (str(value),str(e)) )
        elif hasattr(update_menu,key):
            setattr(update_menu,key,value)
    try:
        update_menu.save()
    except Exception as e:
        return HttpResponseServerError( "Update menu item error: %s" % str(e) )

    return JsonResponse({'success': True, 'msg': 'Menu updated!'})

@authorization_admin_required
def menu_delete(request):
    """

    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))
    data = None if 'data' not in request.POST else request.POST['data'] # что создавать
    try:
        # пытаемся получить словарик из json строки, притом один единственный,
        # тут первым идет родительский узел, а за ним дети
        # у нас стоит delete cascade, поэтому нужен [0]
        obj = json.loads(data)[0]
    except Exception as e:
        return HttpResponseServerError( "Deserialize json string (%s) error: %s" % (str(data),str(e)) )
    # нужен uuid
    uuid = None if 'uuid' not in obj else obj['uuid'] # что создавать
    try:
        menu = Menu.objects.get(uuid = uuid)
        menu.delete()
    except Exception as e:
        # нету или не смог удалить
        return HttpResponseServerError('Delete menu with error: %s' % str(e))
    return JsonResponse({'success': True, 'msg': 'Menu delete!'})

@require_POST
@authorization_admin_required
def group(request,crud):
    if crud == 'c':
        return group_create(request)
    elif crud == 'r':
        return group_read(request)
    elif crud == 'u':
        return group_update(request)
    elif crud == 'd':
        return group_delete(request)
    else:
        return HttpResponseBadRequest('Bad operation: %s' % str(crud))

def group_read(request):
    """

    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))
    user = request.user # смотрим, что за пользователь
    filter = None if 'filter' not in request.POST else request.POST['filter']
    data = []
    if filter:
        # есть фильтр - пытаемся понять как фильтровать
        try:
            filter_obj = json.loads(filter)[0]
        except Exception as e:
            return HttpResponseServerError( "Deserialize json string (%s) error: %s" % (str(filter),str(e)) )
        prop = filter_obj.get('property',None)
        val = filter_obj.get('value',None)
        if prop is None or val is None:
            return HttpResponseBadRequest('Unknown filter params (property/value)')

        if prop == 'menu_uuid':
            # хотят группы - принадлежащие меню
            group_qs = Group.objects.filter(menus__in = [val, ])
        elif prop == 'user_uuid':
            # хотят группы - принадлежащие пользователю
            group_qs = Group.objects.filter(users__in = [val, ])
        else:
            # не понял, что хотели
            return HttpResponseBadRequest('Unknown filter params property: %s, value: %s' % (prop,val))
        # собираем объекты
        for group in group_qs:
            data.append(group.to_dict())
    else:
        #фильтра нет, просят вообще все группы
        # todo отработать если пришли параметры типа start, page, limit
        for group in Group.objects.all():
            data.append(group.to_dict())
    # отдаем
    return JsonResponse({'success': True, 'data': data})

def group_create(request):
    """

    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))

    data = None if 'data' not in request.POST else request.POST['data'] # что создавать
    try:
        # пытаемся получить словарик из json строки, притом один единственный,
        # т.к. в пакетном режиме не работаем.
        obj = json.loads(data)[0]
    except Exception as e:
        return HttpResponseServerError( "Deserialize json string (%s) error: %s" % (str(data),str(e)) )
    new_group = Group()
    for key, value in obj.items():
        if hasattr(new_group,key):
            setattr(new_group,key,value)
    try:
        new_group.save()
    except Exception as e:
        return HttpResponseServerError( "Save group error: %s" % str(e) )
    return JsonResponse({'success': True, 'msg': 'Group create!'})

def group_update(request):
    """

    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))
    user = request.user # смотрим, что за пользователь
    data = None if 'data' not in request.POST else request.POST['data'] # что создавать
    try:
        # пытаемся получить словарик из json строки, притом один единственный,
        # т.к. в пакетном режиме не работаем.
        obj = json.loads(data)[0]
    except Exception as e:
        return HttpResponseServerError( "Deserialize json string (%s) error: %s" % (str(data),str(e)) )
    uuid = None if 'uuid' not in obj else obj['uuid'] # что создавать
    try:
        update_group = Group.objects.get(uuid = uuid)
    except Exception as e:
        # нету
        return HttpResponseServerError('Read group (uuid: %s) error: %s' % (str(uuid),str(e)))
    for key, value in obj.items():
        if key in ['uuid','create','last_update']:
            # эти поля ставить нет необходимости
            continue
        elif hasattr(update_group,key):
            setattr(update_group,key,value)
    try:
        update_group.save()
    except Exception as e:
        return HttpResponseServerError( "Update group item error: %s" % str(e) )

    return JsonResponse({'success': True, 'msg': 'Group updated!'})

def group_delete(request):
    """

    :param request:
    :return:
    """
    logger.debug('POST %s',str(request.POST))
    user = request.user # смотрим, что за пользователь
    data = None if 'data' not in request.POST else request.POST['data'] # что создавать
    try:
        # пытаемся получить словарик из json строки, притом один единственный,
        # тут первым идет родительский узел (не факт конечно), а за ним дети
        # у нас стоит delete cascade (дети удаляются автоматом), поэтому нужен только [0]
        obj = json.loads(data)[0]
        # todo по хорошему нужно вытащить весь список, определить родительский и удалить только его
    except Exception as e:
        return HttpResponseServerError( "Deserialize json string (%s) error: %s" % (str(data),str(e)) )
    # нужен uuid
    uuid = None if 'uuid' not in obj else obj['uuid'] # что создавать
    try:
        Group.objects.get(uuid = uuid).delete()
    except Exception as e:
        # нету или не смог удалить
        return HttpResponseServerError('Delete group with error: %s' % str(e))
    else:
        # исключения не было, значит ОК
        return JsonResponse({'success': True, 'msg': 'Group delete!'})


