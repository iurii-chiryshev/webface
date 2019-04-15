/**
 * Created by Iurii on 17.12.2015.
 *
 * Базовый класс для всех моделей, живущих в этом проекте.
 * В этом классе определен только уникальный идентификатор для
 * всех моделей. Т.е. наследникам нет нужды объявлять его еще раз.
 *
 * @class Webface.model.Base
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.model.Base', {
    extend: 'Ext.data.Model',

    requires: [
       'Ext.data.identifier.Uuid'
    ],

    /**
     * uuid - идентификатор для всех моделей
     */
    idProperty: 'uuid',

    /**
     * ну и само поле
     */
    fields: [
        { name: 'uuid', type: 'string' }
    ],

    // авто генератор uuid
    identifier: 'uuid'
});