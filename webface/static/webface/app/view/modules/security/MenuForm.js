/**
 * Created by iurii.chiryshev on 28.08.2017.
 */
Ext.define('Webface.view.modules.security.MenuForm', {
    extend: 'Ext.window.Window',

    xtype: 'security-menu-form',

    width: 300,
    layout: 'fit',

    bind: 'Edit menu item: {currentMenu.text}',

    modal: true,

    closable: false,

    items: {
        xtype: 'form',
        reference: 'form',
        bodyPadding: 10,
        border: false,
        // use the Model's validations for displaying form errors
        //modelValidation: true,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },

        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Text',
                bind: '{currentMenu.text}'
            },
            {
                xtype: 'combobox',
                fieldLabel: 'Glyph',
                displayField: 'name',
                valueField: 'glyph',
                queryMode: 'local',
                store: 'local.Glyphs',
                bind: '{currentMenu.glyph}',
                forceSelection: true, // выбираем только из списка
                listConfig: {
                    getInnerTpl: function (displayField) {
                        return '<span style="font-family:{glyphFontFamily};" class="{glyphCls}" role="presentation" >&#{glyph}</span> - {name} ';
                    }
                }
            },
            {
                xtype: 'combobox',
                fieldLabel: 'Class name',
                displayField: 'name',
                valueField: 'module_xtype',
                queryMode: 'local',
                store: 'local.Modules',
                forceSelection: true, // выбираем только из списка
                bind: {
                    value: '{currentMenu.module_xtype}',
                    hidden: '{!currentMenu.leaf}'
                }
            },
            {
                // The multiselector is basically a grid that displays the currently selected
                // items. To add items there is a Search tool configured below.
                xtype: 'multiselector',
                bind: {
                    store: '{currentMenu.groups}',
                    hidden: '{!currentMenu.leaf}'
                },

                field: 'name',
                title: 'Groups',
                glyph: 'xf0c0@FontAwesome',
                flex: 1,
                margin: '10 0',
                height: 200,
                viewConfig: {
                    deferEmptyText: false,
                    emptyText: 'No groups selected'
                },


                // This configures the Search popup. In this case we want to browse all groups.
                search: {
                    field: 'name',
                    store: {
                        model: 'Webface.model.security.Group'
                    }
                }
            }
        ]
    },

    buttons: [{
        text: 'Save',
        handler: 'onSaveMenuClick'
    }, {
        text: 'Cancel',
        handler: 'onCancelMenuClick'
    }]

});