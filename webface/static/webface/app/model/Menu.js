/**
 * Объявление класса модели меню (уровень модели шаблона MVC)
 *
 * @class Webface.model.Menu
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.model.Menu', {
    /**
     * Наследуемся от нашего базового класса
     */
    extend: 'Webface.model.Base',

    fields: Webface.model.Util.menuFields(),

    /**
     * Заместитель, т.е. тот, кто на самом деле лезет на сервер за данными.
     */
    proxy: {
        type: 'ajax',

        api :{
            read : '/menus/r/',
            create: '/menus/c/',
            update: '/menus/u/',
            destroy: '/menus/d/'
        },

        actionMethods: {
            read: 'POST',
            create: 'POST',
            update: 'POST',
            destroy: 'POST'
        },

        reader: {
            type: 'json',
            /**
             * где в json лежит линейная структура (массив) дерева.
             * Аналогичное свойство можно выставить в TreeStore
             * @see <a href="http://docs.sencha.com/extjs/5.1/5.1.0-apidocs/#!/api/Ext.data.TreeStore-cfg-defaultRootProperty"> defaultRootProperty </a>
             */
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
