/**
 * Created by Iurii Chiryshev <iurii.chiryshev@mail.ru> on 21.12.2015.
 * Базовый класс для всех панелей в центральной tab panel
 */
Ext.define('Webface.view.modules.Base', {
    extend: 'Ext.panel.Panel',
    xtype: 'base-module',

    config: {
        /**
         * Идентификатор панели, тоже самое что uuid у элемента меню.
         */
        menuUuid: undefined
    },


    /**
     * Перекрытый метод инициализации коммпонента.
     * Если при создании компонента не был указан uuid,
     * будет сгенерировано случайное число
     */
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {menuUuid: Webface.Util.generateUuid()});
        this.callParent(arguments);
    }
});
