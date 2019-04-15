/**
 * Created by Iurii on 17.12.2015.
 *
 * Класс модели группы. Входит в простанство имен безопасности
 *
 * @class Webface.model.security.Group
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.model.security.Group', {
    /**
     * Родительский класс модели
     * @see Webface.model.security.Base
     */
    extend: 'Webface.model.security.Base',

    /**
     * Поля модели.
     * UUID установлен в базовом классе:
     * @see Webface.model.Base
     */
    fields: [
        { name: 'name', type: 'string' } // имя
    ],

    /**
     * Настройка ассоциации many-to-many
     */
    manyToMany: {
        /**
         * У группы пользователей есть много элементов меню, которые видят пользователи этой группы,
         * и обратное тоже верно т.е. каждый элемент меню может видеть несколько групп пользователей.
         * Обычно в реляционных БД такая связь делается через промежуточную таблицу, которая содержит
         * pk/fk связываемых таблиц. В нашем случае она называется GroupMenus т.е.
         * у группы есть много элементов меню, вот ее и настраиваем ниже.
         * Обратная ассоциация настроена:
         * @see Webface.model.security.Menu
         */
        GroupMenus: {
            type: 'Menu', // имя модели для ассоциации
            role: 'menus', // имя метода, которое будет сгенерировано, что б достать ассоц. данные для группы
            field: 'menu_uuid', // pk
            right: {
                // раз уж связь многие ко многим связывает две таблицы
                // нужно прописать вторую часть т.е себя (Group).
                role: 'groups',
                field: 'group_uuid' // fk
            }
        },
        /**
         * У группы есть много пользователей, и обратное тоже верно т.е. каждый пользователь может состоять в нескольких группах.
         * Обычно в реляционных БД такая связь делается через промежуточную таблицу, которая содержит
         * pk/fk связываемых таблиц. В нашем случае она называется GroupUsers т.е.
         * у группы есть много пользователей, вот ее и настраиваем ниже. вот ее и настраиваем ниже.
         * Обратная ассоциация настроена:
         * @see Webface.model.security.User
         */
        GroupUsers: {
            type: 'User', // имя модели для ассоциации
            role: 'users', // имя метода, которое будет сгенерировано, что б достать ассоц. данные для группы
            field: 'user_uuid', // fk
            right: {
                // раз уж связь многие ко многим связывает две таблицы
                // нужно прописать вторую часть т.е себя (Group).
                role: 'groups',
                field: 'group_uuid' // fk
            }
        }
    },

    // todo временно
    proxy: {
        type: 'ajax',
        api :{
            read : '/security/groups/r/',
            create: '/security/groups/c/',
            update: '/security/groups/u/',
            destroy: '/security/groups/d/'
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
