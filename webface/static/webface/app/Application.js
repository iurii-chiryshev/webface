/**
 * Объявление класса основного приложения. Экземпляр этого класса создается в app.js
 * при вызове метода Ext.application().
 *
 * @class Webface.Application
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.Application', {
    extend: 'Ext.app.Application',

    name: 'Webface',

    enableQuickTips: true,

    /**
     * С каким семейством шрифтов работаем
     *
     */
    glyphFontFamily: 'FontAwesome',

    /**
     * массив необходимых зависисмостей, которые будут загружены асинхронно перед созданием экземпляра приложения
     */
    requires: [
        'Webface.Util',
        'Webface.view.login.Login',
        'Webface.view.register.Register',
        'Webface.controller.Root'
    ],

    /**
     * массив глобальных контроллеров, чьи экземпляры создадутся при запуске приложения (не viewport)
     */
    controllers: [
        'Root'
    ],

    /**
     * Массив глобальных хранилищ, которые создадутся для приложения
     */
    stores: [
        'local.Glyphs',
        'local.Modules'
    ],

    /**
     * Перекрытая функция загрузки приложения
     */
    launch: function () {

        if (!Ext.supports.LocalStorage) {
            Ext.Msg.alert('Not Supported', 'This browser does`t support localstorage. Please use a different browser.');
        }else if (Webface.Util.getSettings("is_authorized",false) === true ){
            // пользователь авторизован - сразу показываем viewport
            Ext.create('Webface.view.main.Main');
        }else{
            // пользователь неавторизован.
            // создать первое что увидет пользователь - диалог авторизации или регистрации нового
            // в таком случае порождение viewport т.е. Webface.view.main.Main произойдет только
            // при успешном входе пользователя где-то в logincontroller
            var firstDlg = Webface.Util.getFirstDialog();
            if(firstDlg === Webface.Util.FIRST_DLG.LOGIN){
                Ext.create('Webface.view.login.Login');
            }else if(firstDlg === Webface.Util.FIRST_DLG.REGISTER){
                Ext.create('Webface.view.register.Register');
            }
        }
    },

    /**
     * Перекрытая функция инициализации экземпляра приложения.
     * Вызывается при загрузке страницы
     */
    init: function () {

    }
});
