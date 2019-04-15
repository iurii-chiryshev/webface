/**
 * Контроллер представления для стартового диалога авторизации пользователя (не MVC контроллер)
 * отличия смотри:
 * @see <a href="http://docs.sencha.com/ext/5.1/application_architecture/application_architecture.html"> ExtJS architecture() </a>
 *
 * @class Webface.view.login.LoginController
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    requires: [
        'Webface.Locales',
        'Webface.Util'
    ],


    onTextFieldSpecialKey: function(field, e, options){
        if (e.getKey() === e.ENTER) {
            this.onButtonClickSubmit();
        }
    },

    onTextFieldKeyPress: function(field, e, options){

    },

    onButtonClickCancel: function(button, e, options){
        this.lookupReference('form').reset();
    },

    onButtonClickSubmit: function(button, e, options){
        var me = this,
            form = me.lookupReference('form');
        if (form.isValid()){
           me.doLogin(form);
        }
    },

    onButtonClickRegister: function(button, e, options){
        // установить первый диалог пользователя - диалог регистрации
        Webface.Util.setFirstDialog(Webface.Util.FIRST_DLG.REGISTER);
        // перезагрузить страницу
        window.location.reload();
    },

    doLogin: function(form) {

        var me = this;
        me.getView().mask(Webface.Locales.tr("please_wait"));

        form.submit({
            clientValidation: true,
            url: '/login/',
            scope: me,
            success: 'onLoginSuccess',
            failure: 'onLoginFailure'
        });
    },

    onLoginFailure: function(form, action) {
        var view = this.getView();
        view.unmask();
    },

    onLoginSuccess: function(form, action) {
        var view = this.getView();
        view.unmask();
        // закрываем этот диалог
        view.close();
        // запускаем viewport - основное приложение
        //Ext.create('Webface.view.main.Main');
        // Нет, нужно именно перезапустить страницу
        // тогда авторизованный пользователь должен увидеть приложение
        // см. Application.js
        window.location.reload();
    }
});
