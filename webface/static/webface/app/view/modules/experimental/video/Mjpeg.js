Ext.define('Webface.view.modules.experimental.video.Mjpeg', {
    extend: 'Webface.view.modules.Base',
    xtype: 'exp-mjpeg-module',
    requires: [
        'Webface.view.modules.experimental.video.MjpegModel',
        'Webface.view.modules.experimental.video.MjpegController',
        'Ext.layout.container.Fit',
        'Ext.Img'
    ],

    viewModel: {
        type: 'exp-mjpeg'
    },

    controller: 'exp-mjpeg',

    layout: {
        type: 'center'
    },



    items:{
        xtype: 'imagecomponent',
        reference: 'mjpegImage',
        bind: {
            src: '{src}',
            width: '{width}',
            height: '{height}'
        }
        //loader: {
        //    url: "http://127.0.0.1:8080/cam.mjpg",
        //    autoLoad: true,
        //    ajaxOptions: {
        //        method: 'GET',
        //        useDefaultXhrHeader: false,
        //        cors: true,
        //        timeout: false,
        //        withCredentials: true
        //    },
        //    params:{
        //        format: "mjpg"
        //    },
        //    listeners:{
        //        beforeload: function(loader, options, eOpts ){
        //            console.log(options);
        //            console.log(loader);
        //            console.log(eOpts);
        //
        //            return true;
        //        },
        //        load: function( loader, response, options, eOpts ){
        //            console.log('load');
        //            console.log(response);
        //        }
        //    }
        //}
    },

    listeners: {
        beforedestroy: function(loader, opts) {
            //var img = loader.lookupReference('mjpegImage');
            //console.log('beforedestroy');
            //console.log(img.getLoader());
            //img.getLoader().abort();
        }

    }

});
