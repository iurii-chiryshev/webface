/**
 * Created by iurii.chiryshev on 16.01.2018.
 */
Ext.define('Webface.IO', {

    /**
     * Этот класс должен уметь оповещать о своих изменениях, поэтому
     * включает в себя миксин Наблюдателя.
     */
    mixins: ['Ext.mixin.Observable'],

    singleton: true,

    /**
     * секция config
     * для всего, что внутри создается get и set методы
     */
    config:{
        webSocket: undefined
    },


    /**
     * Конструктор
     * @param config
     */
    constructor: function (config) {
        //применяем конфиг и себе и миксину
        this.initConfig(config);
        this.mixins.observable.constructor.call(this, config);
    }
});