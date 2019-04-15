/**
 * Created by iurii.chiryshev on 28.08.2017.
 */
Ext.define('Webface.view.modules.security.GroupForm', {
    extend: 'Ext.window.Window',

    xtype: 'security-group-form',

    width: 300,
    layout: 'fit',

    bind: 'Edit group: {currentGroup.name}',

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
                fieldLabel: 'Name',
                bind: '{currentGroup.name}'
            }
        ]
    },

    buttons: [{
        text: 'Save',
        handler: 'onSaveGroupClick'
    }, {
        text: 'Cancel',
        handler: 'onCancelGroupClick'
    }]

});