Ext.define('Webface.view.modules.configurator.Camera', {
    extend: 'Webface.view.modules.Base',
    xtype: 'conf-camera-module',
    requires: [
        'Webface.view.modules.configurator.CameraModel',
        'Webface.view.modules.configurator.CameraController',
        'Ext.layout.container.Fit',
        'Ext.layout.container.Border'
    ],

    viewModel: {
        type: 'conf-camera'
    },

    controller: 'conf-camera',

    layout: {
        type: 'fit'
    },

    items:{
        xtype: 'container',
        layout: {
            type: 'border'
        },
        defaults: {
            split: false,
        },


        items: [{
            region: 'center',
            flex: 2,
            xtype: 'panel',
            //title: 'grid'
        },{
            xtype: 'panel',
            flex: 1,
            region: 'east',
            //title: 'form'
        }]

    },

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                text: 'Add',
                xtype: 'button',
                iconCls: 'fa fa-plus fa-lg ',
                //listeners: {
                //    click: 'onAddGroupClick'
                //}
            },
            {
                text: 'Edit',
                xtype: 'button',
                iconCls: 'fa fa-pencil fa-lg ',
                //listeners: {
                //    click: 'onEditGroupClick'
                //},
                //bind: {
                //    disabled: '{!groupsGrid.selection}'
                //}
            },
            {
                text: 'Delete',
                xtype: 'button',
                iconCls: 'fa fa-trash fa-lg ',
                //listeners: {
                //    click: 'onDeleteGroupClick'
                //},
                //bind: {
                //    disabled: '{!groupsGrid.selection}'
                //}
            }
        ]
    }]

});
