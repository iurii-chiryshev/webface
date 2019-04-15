Ext.define('Webface.view.modules.experimental.video.MjpegModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.exp-mjpeg',

    data: {
        src: "http://" + window.location.hostname +":5555/cam.mjpeg?_dc=" + Ext.now().toString(),
        width: 320,
        height: 240
    }
});