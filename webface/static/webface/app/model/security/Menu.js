/**
 * Created by Iurii on 17.12.2015.
 *
 * Класс модели Меню. Входит в простанство имен безопасности
 *
 * @class Webface.model.security.Menu
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.model.security.Menu', {
    /**
     * Родительский класс модели
     */
    extend: 'Webface.model.security.Base',

    requires: [
       'Webface.ux.data.writer.AssociatedWriter'
    ],

    /**
     * Поля модели меню.
     * UUID установлен в базовом классе:
     * @see Webface.model.Util
     */
    fields: Webface.model.Util.menuFields(),

    /**
     * Настройка ассоциации many-to-many
     */
    manyToMany: {
        /**
         * У элемента меню есть много групп пользователей, для которых он видим вот ее и настраиваем
         * Обратная ассоциация настроена:
         * @see Webface.model.security.Group
         */
        MenuGroups: {
            type: 'Group', // имя модели для ассоциации
            role: 'groups', // имя метода, которое будет сгенерировано, что б достать ассоц. данные для меню
            field: 'group_uuid', // fk
            right: {
                // раз уж связь многие ко многим связывает две таблицы
                // нужно прописать вторую часть т.е себя (Menu).
                role: 'menus',
                field: 'menu_uuid' // fk
            }
        }
    },

    proxy: {
        type: 'ajax',

        api :{
            read : '/security/menus/r/',
            create: '/security/menus/c/',
            update: '/security/menus/u/',
            destroy: '/security/menus/d/'
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
            type: 'associatedjson',
            writeAllFields: false,
            encode: true,
            rootProperty: 'data',
            allowSingle: false
        }
    }

});
