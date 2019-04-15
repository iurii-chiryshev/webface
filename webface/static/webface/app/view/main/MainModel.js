/**
 * Модель представления главного окна. Является частью шаблона MVVM.
 * За подробностями:
 * @see <a href="http://docs.sencha.com/ext/5.1/application_architecture/application_architecture.html"> ExtJS architecture() </a>
 *
 * @class Webface.view.main.MainModel
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    requires: [
        'Webface.Locales',
        'Webface.Util'
    ],

    data: {
        footer: Webface.Locales.tr("urfu"),
        fullName: Webface.Util.getSettings("full_name","unknown"),
        shortName: Webface.Util.getSettings("short_name","unknown"),
        isAuthorized: Webface.Util.getSettings("is_authorized",false)
    }
});
