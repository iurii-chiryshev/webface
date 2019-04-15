/**
 * Created by Iurii Chiryshev <iurii.chiryshev@mail.ru> on 22.12.2015.
 * Панель для настройки дерева меню. Т.е. "супер" пользователь имеет право
 * выстроить дерево меню и раздать соответствующие видимости на группы
 */
Ext.define('Webface.view.modules.security.Security', {
    extend: 'Webface.view.modules.Base',
    xtype: 'security-module',

    requires: [
        'Webface.view.modules.security.Menus',
        'Webface.view.modules.security.Groups',
        'Webface.view.modules.security.Users',
        'Webface.view.modules.security.SecurityModel',
        'Webface.view.modules.security.SecurityController'
    ],

    /**
     * view контроллер
     */
    controller: 'security',

    /**
    * view модель
    */
    viewModel: {
        type: 'security'
    },

    //session: true,


    layout: {
        type: 'fit'
    },

    border: false,

    items: [{
        xtype: 'tabpanel',
        activeTab: 0,
        items:[
            {
                xtype: 'security-menus'
            },
            {
                xtype: 'security-groups'
            },
            {
                xtype: 'security-users'
            }
        ]
    }]

});
