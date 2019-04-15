/**
 * Created by Iurii Chiryshev <iurii.chiryshev@mail.ru> on 23.12.2015.
 */
Ext.define('Webface.view.modules.security.Groups', {
    extend: 'Ext.grid.Panel',
    xtype: 'security-groups',

    bind : '{groups}',

    reference: 'groupsGrid',

    /**
     * Класс иконки (glyph) в заголовке
     */
    glyph: 'xf0c0@FontAwesome',
    /**
     * Надпись в заголовке. Достается из словаря.
     */
    title: Webface.Locales.tr("groups"),

    columns: [
        {
            text: 'Group Name',
            flex: 1,
            dataIndex: 'name',
            resizable: false
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
                    click: 'onEditGroupClick'
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
                    click: 'onDeleteGroupClick'
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
                    click: 'onAddGroupClick'
                }
            },
            {
                text: 'Edit',
                xtype: 'button',
                iconCls: 'fa fa-pencil fa-lg ',
                listeners: {
                    click: 'onEditGroupClick'
                },
                bind: {
                    disabled: '{!groupsGrid.selection}'
                }
            },
            {
                text: 'Delete',
                xtype: 'button',
                iconCls: 'fa fa-trash fa-lg ',
                listeners: {
                    click: 'onDeleteGroupClick'
                },
                bind: {
                    disabled: '{!groupsGrid.selection}'
                }
            }
        ]
    }]

});