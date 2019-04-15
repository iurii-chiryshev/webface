/**
 * Created by iurii.chiryshev on 26.12.2017.
 * Переопределенный writer для данных моделей со связями many-to-many, hasMany
 */
Ext.define('Webface.ux.data.writer.AssociatedWriter', {
    extend: 'Ext.data.writer.Json',
    alias: 'writer.associatedjson',

    /**
     * ctor
     * @param config
     */
    constructor: function(config) {
        this.callParent(arguments);
    },

    /**
     * Перекрытый метод получения данных из модели
     * @param record
     * @param operation
     * @returns {*}
     */
    getRecordData: function (record, operation) {

        var data = this.callParent(arguments);
        //добавить ассоциативные данные
        Ext.apply(data, record.getAssociatedData());
        return data;
    }
});