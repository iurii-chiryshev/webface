"""webface URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from configurator.views import camera
from core.views import index, to_static, login_user, logout_user, register_user, menu, group, user, locales

urlpatterns = [
    # индексная страница
    url(r'^$', index, name='index'),

    # авввторизация, регистрация
    url(r'^login/$',login_user),
    url(r'^logout/$',logout_user),
    url(r'^register/$',register_user),

    url(r'^menus/([crud])/$',menu),
    url(r'^security/menus/([crud])/$',menu),
    url(r'^security/groups/([crud])/$',group),
    url(r'^security/users/([crud])/$',user),

    # пользователь хочет другой язык
    url(r'^locales/$',locales),

    # вычислители
    url(r'^configurator/cameras/([crud])/$',camera),

    # перенаправление на статику, т.к. в ext app все пути относительные
    # и он не добавляет правильный префикс пути до статики, поэтому перенаправляю тут
    # нужен только на DEBUG
    url(r'^app/',to_static),
    url(r'^resources/',to_static),

    # django страничка админки
    url(r'^admin/', include(admin.site.urls))
    # как отдается статика
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
