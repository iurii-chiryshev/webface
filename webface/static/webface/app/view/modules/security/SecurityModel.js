/**
 * Created by Iurii Chiryshev <iurii.chiryshev@mail.ru> on 22.12.2015.
 */
Ext.define('Webface.view.modules.security.SecurityModel', {
    extend: 'Ext.app.ViewModel',

    requires: [
        'Webface.model.security.Menu',
        'Webface.model.security.Group',
        'Webface.model.security.User',
        'Ext.data.TreeStore'
    ],

    alias: 'viewmodel.security',

    stores: {
        menus: {
            type: 'tree',
            root: {
                expanded: true
            },
            rootVisible: true,
            parentIdProperty: 'parent_uuid',
            defaultRootText: 'root',
            model: 'Webface.model.security.Menu',
            sorters: [
                {
                    property: 'leaf',
                    direction: 'ASC'
                },
                {
                    property: 'text',
                    direction: 'ASC'
                }
            ],
            autoLoad: true
        },
        groups: {
            model: 'Webface.model.security.Group',
            autoLoad: true
        },
        users: {
            model: 'Webface.model.security.User',
            autoLoad: true
        }
    }

});