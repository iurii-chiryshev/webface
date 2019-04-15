/**
 * Кнопка со списком (меню), в котором пользователь может выбрать язык локализации приложения.
 * Всю основную работу с коммпонентом выполняет его контролер TranslationController.
 */
Ext.define('Webface.view.locale.Translation', {
    extend: 'Ext.button.Split',
    xtype: 'translation',

    requires: [
        'Webface.view.locale.TranslationController',
        'Webface.view.Util'
    ],

    // контроллер этого вида
    controller: 'translation',

    menu: {
        xtype: 'menu',
        defaults:{
            listeners: {
                // у контроллера есть этот метод
                click: 'onMenuItemClick'
            }
        },
        items: Webface.view.Util.localeMenuItems()
    }
});
