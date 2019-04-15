/**
 * Точка входа в Extjs приложение Webface-а. Основной загрузочный скрипт для single page application.
 * Это идеальное место, чтобы настроить загрузчика и подключить все обязательные зависимости для приложения.
 * Все зависимости можно подключать через Ext.require() или в самих класса через requires и uses.
 *
 * @see <a href="http://docs.sencha.com/extjs/5.1/5.1.0-apidocs/#!/api/Ext-method-require"> Ext.require() </a>
 * @see <a href="http://docs.sencha.com/extjs/5.1/5.1.0-apidocs/#!/api/Ext.Class-cfg-requires"> Ext.Class.requires </a>
 * @see <a href="http://docs.sencha.com/extjs/5.1/5.1.0-apidocs/#!/api/Ext.Class-cfg-uses"> Ext.Class.requires </a>
 *
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */


/**
 * Установка настроек в Ext загрузчик
 */
Ext.Loader.setConfig({
    /**
     * Разрешить динамическую загрузку скриптов
     */
    enabled: true,

    disableCaching: false,


    paths :{
        /**
         * Данная конструкция жестко привязывает пространство имен приложения к его каталогу
         * Еще один нюанс: если приложение пишется в соответствии с шаблоном MVC или MVVM (Ext 5+), то
         * Ext.Loader будет искать и загружать модели, виды, контроллеры и хранилища из соответствующих каталогов
         * @example
         * Webface.view.main.Main должно лежать в ./app/view/main/Main.js
         */
        "Webface" : "./app"
    }
});

/**
 * extjs зависимости
 */
Ext.require('Ext.layout.container.Fit');
Ext.require('Ext.form.Panel');
Ext.require('Ext.grid.Panel');
Ext.require('Ext.plugin.Viewport');
Ext.require('Ext.layout.container.Border');
Ext.require('Ext.layout.container.Center');
Ext.require('Ext.layout.container.Accordion');
Ext.require('Ext.view.MultiSelector');

/**
 * ext-websocket
 */
Ext.require ('Webface.ux.WebSocket');


/**
 * зависимости webface app
 * тут не все зависимости, а только те, на которые почему-то ругается Loader
 * Все остальные зависимости прописаны в requires: [] классов
 */

Ext.require('Webface.locales.ru');
Ext.require('Webface.locales.en');
Ext.require('Webface.Locales');
Ext.require('Webface.Util');
Ext.require('Webface.model.Util');
Ext.require('Webface.view.Util');
Ext.require('Webface.view.main.MainModel');
Ext.require('Webface.view.main.TabPanel');
Ext.require('Webface.view.main.Main');
Ext.require('Webface.view.modules.Base');
Ext.require('Webface.view.modules.security.Security');
Ext.require('Webface.view.modules.configurator.Camera');
Ext.require('Webface.view.modules.experimental.video.Mjpeg');


/**
 * Функция загрузки, порождения и старта приложения
 */
Ext.application({
    /**
     * Имя приложения, оно же является пространством имен для приложения.
     * Пространство имен с его каталогом мы уже привязали ранее в настройках загрузчика.
     */
    name: 'Webface',

    appFolder: "./app",

    /**
     * Наследование от класса нашего приложения
     * @see <a href="./app/Application.js"> Application.js </a>
     */
    extend: 'Webface.Application',

    /**
     * Запрет автоматического создания viewport-а (контейнера для приложения).
     * Начиная с какой-то там версии ext эта опция выставлена в false и запрещена, но тем не менее она тут прописана.
     * Мне действительно нужно false т.к. перед основным приложением могут стартонуть формы логина или регистрации
     * @see Application.js (launch функцию)
     */
    autoCreateViewport: false
});