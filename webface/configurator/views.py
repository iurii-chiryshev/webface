from django.http import HttpResponseBadRequest, HttpResponse
from django.shortcuts import render
import logging
from django.views.decorators.http import require_POST
from core.decorators import authorization_admin_required

logger = logging.getLogger(__name__)

@require_POST
@authorization_admin_required
def camera(request,crud):
    if crud == 'c':
        return camera_create(request)
    elif crud == 'r':
        return camera_read(request)
    elif crud == 'u':
        return camera_update(request)
    elif crud == 'd':
        return camera_delete(request)
    else:
        return HttpResponseBadRequest('Bad operation: %s' % str(crud))

def camera_read(request):
    """

    :param request:
    :return:
    """
    return HttpResponse("Not implemented",status=501)

def camera_create(request):
    """

    :param request:
    :return:
    """
    return HttpResponse("Not implemented",status=501)

def camera_update(request):
    """

    :param request:
    :return:
    """
    return HttpResponse("Not implemented",status=501)

def camera_delete(request):
    """

    :param request:
    :return:
    """
    return HttpResponse("Not implemented",status=501)
