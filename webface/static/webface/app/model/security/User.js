/**
 * Created by Iurii on 17.12.2015.
 *
 * Класс модели пользователя, который входит в простанство имен безопасности
 *
 * @class Webface.model.security.User
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.model.security.User', {
    /**
     * Родительский класс модели
     * @see Webface.model.security.Base
     */
    extend: 'Webface.model.security.Base',

    requires: [
       'Webface.ux.data.writer.AssociatedWriter'
    ],

    /**
     * Поля модели пользователя.
     * UUID установлен в базовом классе:
     * @see Webface.model.Base
     */
    fields: [
        { name: 'first_name', type: 'string' }, // имя
        { name: 'last_name', type: 'string' }, // фамилия
        { name: 'username', type: 'string' }, // имя пользователя
        { name: 'password', type: 'string' }, // пароль
        { name: 'email', type: 'string' }, // почтовый адрес
        { name: 'change_associated_groups',type: 'string',defaultValue: ''}
    ],

    /**
     * Настройка ассоциации many-to-many
     */
    manyToMany: {
        /**
         * Настраиваем ассоциацию, чтобы пользователь входил в несколько групп (т.е. видел их все)
         * Обратная ассоциация настроена в:
         * @see Webface.model.security.Group
         */
        UserGroups: {
            type: 'Group', // имя модели для ассоциации
            role: 'groups', // имя метода, которое будет сгенерировано, что б достать ассоц. данные для меню
            field: 'group_uuid', // pk
            right: {
                // раз уж связь многие ко многим связывает две таблицы
                // нужно прописать вторую часть т.е себя (User).
                role: 'users',
                field: 'user_uuid' // pk
            }
        }
    },

    // todo временно
    proxy: {
        type: 'ajax',
        api :{
            read : '/security/users/r/',
            create: '/security/users/c/',
            update: '/security/users/u/',
            destroy: '/security/users/d/'
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
            type: 'associatedjson',
            writeAllFields: false,
            encode: true,
            rootProperty: 'data',
            allowSingle: false
        }
    }
});
