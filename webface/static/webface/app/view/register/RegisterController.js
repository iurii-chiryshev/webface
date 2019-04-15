/**
 * Контроллер представления стартового диалога создания пользователя (регистрации).
 * Это новый для ExtJS 5+ контроллер. Отличие от контроллеров из MVC следующее:
 * 1. Они не глобальные;
 * 2. Для каждого экземпляра представления создаются свои контроллеры;
 * 3. Они создаются создаются, когда создаются предмтавления, за которыми они следят
 * 4. Если контроллеры из MVC должны лежать в /store, то эти правильнее складывать рядом с представлениями
 * В остальном они схожи, т.е. точно так же следят за своими представлениями.
 * @see <a href="http://docs.sencha.com/ext/5.1/application_architecture/application_architecture.html"> ExtJS architecture() </a>
 *
 * @class Webface.view.register.RegisterController
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.register.RegisterController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.register',

    requires: [

    ],

    onTextFieldSpecialKey: function(field, e, options){
        if (e.getKey() === e.ENTER) {
            this.onButtonClickRegister();
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
           me.doRegister(form);
        }
    },

    onButtonClickLogin: function(button, e, options){
        Webface.Util.setFirstDialog(Webface.Util.FIRST_DLG.LOGIN);
        window.location.reload();
    },

    doRegister: function(form) {
        var me = this;
        me.getView().mask(Webface.Locales.tr("please_wait"));
        form.submit({
            clientValidation: true,
            url: '/register/',
            scope: me,
            success: 'onRegisterSuccess',
            failure: 'onRegisterFailure'
        });
    },

    onRegisterFailure: function(form, action) {
        var view = this.getView();
        view.unmask();
    },

    onRegisterSuccess: function(form, action) {
        var view = this.getView();
        view.unmask();
        // переходим на форму авторизации
        this.onButtonClickLogin();
    }
});
