/**
 * Контроллер кнопки (меню) выбора языка
 */
Ext.define('Webface.view.locale.TranslationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.translation',

    /**
     * инициализация контроллера
     */
    init: function() {
        // установить на view
        // иконку с флагом и локализованную строку языка
        var lang = Webface.Locales.getUserLang();
        var button = this.getView();
        button.setIconCls(lang);
        button.setText(Webface.Locales.tr("lang." + lang));

    },

    /**
     * отработка события выбора языка и меню
     * @param item
     * @param e
     * @param options
     */
    onMenuItemClick: function(item, e, options){
        var button = this.getView();
        
        if (button.iconCls !== item.iconCls)
        {
            // установить язык
            button.setIconCls(item.iconCls);
            button.setText(item.text);
            // запрос серверу, что хотим другой язык
            Webface.Locales.sendUserLang(item.iconCls,{
                success: function(response, opts) {
                    // в случае успеха перезагрузи страницу
                    window.location.reload();
                }
            });
        }
    }
});
