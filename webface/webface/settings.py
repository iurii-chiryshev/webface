"""
Django settings for webface project.

Generated by 'django-admin startproject' using Django 1.10.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.10/ref/settings/
"""

import os, platform, logging
import pymysql

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'd^+v0qsdtavg#0w8!m352szqyvhn_#)i(@(s1%v0q#v72j)2f5'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

LOGIN_URL = 'index'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',
    'configurator',
    'mjpeg'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware', # должно быть после SessionMiddleware но перед CommonMiddleware !!!
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'webface.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, "templates"),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'webface.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases
pymysql.install_as_MySQLdb()
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'webface',
        'HOST': 'localhost',
        'PORT': 3306,
        'USER': 'root',
        'PASSWORD': 'bomba',
        'STORAGE_ENGINE': 'INNODB',
        'OPTIONS': {
            'sql_mode': 'STRICT_TRANS_TABLES'

        }
    }
}


# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

# язык по умолчанию
LANGUAGE_CODE = 'en'

# все языки
LANGUAGES = {
    ('en', u'English'),
    ('ru', u'Русский'),
}

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

# Локализация и интернационализация
LOCALE_PATHS = (
    os.path.join(BASE_DIR, "locales"),
)

USE_TZ = True

LOGGING_FILE = "c:\\tmp\\webface.log"
LOGGING_LEVEL = logging.INFO
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[%(asctime)s] %(levelname)s %(message)s [%(name)s.py:%(lineno)d func:%(funcName)s() process:%(process)d thread:%(thread)d]'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'core': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
        'mjpeg': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'
# Какие каталоги учитывать при поиске статических файлов.
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

MEDIA_ROOT = os.path.join(BASE_DIR,'media')
MEDIA_URL = '/media/'



#################################################################################
#                       Настройки django channels
#################################################################################

# добавляю само приложение
INSTALLED_APPS += (
    'channels',
)

# Настройки redis backend для channels
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
# Channel layer definitions
# http://channels.readthedocs.org/en/latest/deploying.html#setting-up-a-channel-backend
CHANNEL_LAYERS = {
    "default": {
        # This app uses the Redis channel layer implementation asgi_redis
        "BACKEND": "asgi_redis.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(REDIS_HOST, 6379)],
        },
        "ROUTING": "webface.routing.channel_routing",
    },
}



BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'redis://localhost:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Africa/Nairobi'


#################################################################################
#                       Как и откуда загружается ExtJS app
#################################################################################
EXTJS_APP_BUILDS = (
    "DEBUG", # вообще без сборки т.е. будет загружен каждый скрипт приложения
    "TESTING", # файлы, собранные sencha cmd в тестовом режиме
    "PRODUCTION", # файлы, собранные sencha cmd в production, + compression
)
EXTJS_BUILD = EXTJS_APP_BUILDS[0]


#################################################################################
#                           MJPEG
#################################################################################
MJPEG_HOST = 'localhost'
MJPEG_PORT = 5555
