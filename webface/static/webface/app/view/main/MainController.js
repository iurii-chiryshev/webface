/**
 * Контроллер представления главного окна.
 *
 * @class Webface.view.main.MainController
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    requires: [
        'Webface.Locales',
        'Webface.Util'
    ],

    onLogout: function(button, e, options){

        var me = this;
        me.getView().mask(Webface.Locales.tr("please_wait"));
        Ext.Ajax.request({
            url: '/logout/',
            method: 'POST',
            scope: me,
            success: 'onLogoutSuccess',
            failure: 'onLogoutFailure'
        });
    },

    onLogoutSuccess: function(response, options, eOpts){
            this.getView().destroy();
            window.location.reload();
    },

    onLogoutFailure: function(response, options, eOpts){
        // по хорошему, тут ошибок вообще не должно быть
    }
});
