/**
 * Created by Iurii Chiryshev <iurii.chiryshev@mail.ru> on 29.12.2015.
 */
Ext.define('Webface.view.modules.security.Users', {
    extend: 'Ext.grid.Panel',
    xtype: 'security-users',

    bind : '{users}',

    reference: 'usersGrid',

    /**
     * Класс иконки (glyph) в заголовке
     */
    glyph: 'xf007@FontAwesome',
    /**
     * Подсказка
     */
    title: Webface.Locales.tr("users"),


    columns: [
        {
            text: 'Username',
            flex: 1,
            dataIndex: 'username',
            resizable: false
        },
        {
            text: 'First name',
            flex: 1,
            dataIndex: 'first_name',
            resizable: false
        },
        {
            text: 'Last name',
            flex: 1,
            dataIndex: 'last_name',
            resizable: false
        },
        {
            text: 'Email',
            flex: 1,
            dataIndex: 'email',
            resizable: false,
            renderer: function(val) {
                return '<a href="mailto:' + val + '">' + val + '</a>';
            }
        },
        {
            xtype: 'widgetcolumn',
            width: 50,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            widget: {
                xtype: 'button',
                iconCls: 'fa fa-pencil fa-lg',
                tooltip: 'Edit',
                listeners: {
                    click: 'onEditUserClick'
                }
            }
        },
        {
            xtype: 'widgetcolumn',
            width: 50,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            widget: {
                xtype: 'button',
                iconCls: 'fa fa-trash fa-lg',
                tooltip: 'Delete',
                listeners: {
                    click: 'onDeleteUserClick'
                }
            }
        }
    ],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                text: 'Add',
                xtype: 'button',
                iconCls: 'fa fa-plus fa-lg ',
                listeners: {
                    click: 'onAddUserClick'
                }
            },
            {
                text: 'Edit',
                xtype: 'button',
                iconCls: 'fa fa-pencil fa-lg ',
                listeners: {
                    click: 'onEditUserClick'
                },
                bind: {
                    disabled: '{!usersGrid.selection}'
                }
            },
            {
                text: 'Delete',
                xtype: 'button',
                iconCls: 'fa fa-trash fa-lg ',
                listeners: {
                    click: 'onDeleteUserClick'
                },
                bind: {
                    disabled: '{!usersGrid.selection}'
                }
            }
        ]
    }]
});