/**
 * Created by iurii.chiryshev on 28.08.2017.
 */
Ext.define('Webface.store.local.Modules', {
    extend: 'Ext.data.Store',

    fields: [
        ///////////////////////////////////////////////////////////////
        // поля
        ///////////////////////////////////////////////////////////////
        { name: 'module_xtype', type: 'string' }, // xtype
        { name: 'name', type: 'string' }
    ],

    data: { data: [
        { module_xtype: "base-module" ,name: "Empty"},
        { module_xtype: "security-module" ,name: "Security"},
        { module_xtype: "exp-mjpeg-module" ,name: "MJPEG"},
        { module_xtype: "conf-camera-module" ,name: "Camera"}
    ]},

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});