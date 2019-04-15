/**
 *
 * Класс модели камер
 *
 * @class Webface.model.configurator.Camera
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.model.configurator.Camera', {
    /**
     * Родительский класс модели
     * @see Webface.model.Base
     */
    extend: 'Webface.model.Base',

    /**
     * Поля модели.
     * UUID установлен в базовом классе:
     * @see Webface.model.Base
     */
    fields: [
        { name: 'src', type: 'string' },
        { name: 'unit_ip', type: 'string' },
        { name: 'unit_port', type: 'int' },
        { name: 'mjpeg_port', type: 'string' },
        { name: 'alias', type: 'string' },
        { name: 'description', type: 'string' }
    ],

    proxy: {
        type: 'ajax',
        api :{
            read : '/configurator/cameras/r/',
            create: '/configurator/cameras/c/',
            update: '/configurator/cameras/u/',
            destroy: '/configurator/cameras/d/'
        },
        actionMethods: {
            read: 'POST',
            create: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            encode: true,
            rootProperty: 'data',
            allowSingle: false
        }
    }

});
