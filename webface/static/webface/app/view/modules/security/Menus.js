/**
 * Created by Iurii Chiryshev <iurii.chiryshev@mail.ru> on 22.12.2015.
 */
Ext.define('Webface.view.modules.security.Menus', {
    extend: 'Ext.tree.Panel',
    xtype: 'security-menus',

    requires:[
      'Ext.grid.column.Widget'
    ],

    bind : '{menus}',

    reference: 'menusTreeGrid',

    viewConfig: {
        stripeRows: true
    },

    /**
     * Класс иконки (glyph) в заголовке
     */
    glyph: 'xf0c9@FontAwesome',
    /**
     * Надпись в заголовке. Достается из словаря.
     */
    title: Webface.Locales.tr("menu"),

    useArrows: true,


    columns: [
        {
            xtype: 'treecolumn',
            text: 'Node',
            width: 250,
            dataIndex: 'text',
            locked: true, // обязательно true, иначе будет глюк
            resizable: false
        },
        {
            text: 'Class name',
            flex: 1,
            dataIndex: 'module_xtype',
            resizable: true
        },
        {
            text: 'Glyph',
            flex: 1,
            dataIndex: 'glyph',
            resizable: true
        },
        {
            xtype: 'widgetcolumn',
            width: 50,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            onWidgetAttach: function(column,widget,record){
                //нельзя редактировать корневой узел
                widget.setDisabled(record.data.root);
            },
            widget: {
                xtype: 'button',
                iconCls: 'fa fa-pencil fa-lg',
                tooltip: 'Edit',
                listeners: {
                    click: 'onEditMenuClick'
                }
            }
        },
        {
            xtype: 'widgetcolumn',
            width: 50,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            onWidgetAttach: function(column,widget,record){
                //нельзя удалять корневой узел
                widget.setDisabled(record.data.root);
            },
            widget: {
                xtype: 'button',
                iconCls: 'fa fa-trash fa-lg',
                tooltip: 'Delete',
                listeners: {
                    click: 'onDeleteMenuClick'
                }
            }
        }

    ],
    // кнопки сверху
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                // добавить
                text: 'Add',
                xtype: 'button',
                iconCls: 'fa fa-plus fa-lg ',
                disabled: true,
                bind: {
                    disabled: '{menusTreeGrid.selection.leaf}' // добавлять в лист нельзя
                },
                menu:  [
                    {
                        // добаввить листовой узел (не имеет потомков)
                        text:Webface.Locales.tr("leaf"),
                        glyph: 'xf06c@FontAwesome',
                        listeners: {
                            // пока ничего не слушаем
                            click: 'onAddLeafMenuClick'
                        }
                    },{
                        // добавить родительский узел (имеет потомков)
                        text: Webface.Locales.tr("parent"),
                        glyph: 'xf07c@FontAwesome',
                        listeners: {
                            click: 'onAddParentMenuClick'
                        }
                    }
                ]
            },
            {
                // редактировать
                text: 'Edit',
                xtype: 'button',
                iconCls: 'fa fa-pencil fa-lg ',
                disabled: true,
                listeners: {
                    click: 'onEditMenuClick'
                },
                bind: {
                    disabled: '{menusTreeGrid.selection.root}' // корень нельзя редактировать
                }
            },
            {
                // удалить
                text: 'Delete',
                xtype: 'button',
                iconCls: 'fa fa-trash fa-lg ',
                disabled: true,
                listeners: {
                    click: 'onDeleteMenuClick'
                },
                bind: {
                    disabled: '{menusTreeGrid.selection.root}' // конень нельзя удалять
                }
            }
        ]
    }]
});