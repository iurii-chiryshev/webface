/**
 * Created by Iurii Chiryshev <iurii.chiryshev@mail.ru> on 29.12.2015.
 */
Ext.define('Webface.view.modules.security.UserForm', {
    extend: 'Ext.window.Window',

    xtype: 'security-user-form',

    width: 300,
    layout: 'fit',

    modal: true,

    closable: false,

    // As a Window the default property we are binding is "title":
    bind: 'Edit User: {currentUser.name}',

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
                fieldLabel: 'Username',
                labelWidth: 70,
                bind: '{currentUser.username}'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'First name',
                labelWidth: 70,
                bind: '{currentUser.first_name}'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Last name',
                labelWidth: 70,
                bind: '{currentUser.last_name}'
            },
            {
                // The multiselector is basically a grid that displays the currently selected
                // items. To add items there is a Search tool configured below.
                xtype: 'multiselector',
                bind: '{currentUser.groups}',
                field: 'name',
                title: 'Groups',
                glyph: 'xf0c0@FontAwesome',
                flex: 1,
                margin: '10 0',

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
        handler: 'onSaveUserClick'
    }, {
        text: 'Cancel',
        handler: 'onCancelUserClick'
    }]
});
