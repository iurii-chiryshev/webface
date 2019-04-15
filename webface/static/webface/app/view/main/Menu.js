/**
 * Класс представления Меню (часть MVC шаблона)
 *
 * @class Webface.view.main.Menu
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.main.Menu', {
    /**
     * Класс наследник
     */
    extend: 'Ext.tree.Panel',
    /**
     * Альтернативное имя для полного имени класса
     */
    xtype: 'main-menu',
    /**
     * Зависимости
     */
    requires: [
       'Webface.overrides.tree.ColumnOverride',
       'Webface.view.main.MenuController'
    ],

    controller: 'mainmenu',
    /**
     * Хранилише из простанства имен Webface.store
     */
    store: 'Menus',
    /**
     * Размеры преставления
     */
    width: 250,
    maxWidth: 300,
    minWidth: 150,

    /**
     * стиль Vista (стрелачка в узлах)
     */
    useArrows: true,
    /**
     * Не показывать корневой узел
     */
    rootVisible: false,

    autoScroll: true,

    /**
     * Класс иконки (glyph) в заголовке
     */
    iconCls: 'fa fa-bars fa-lg',
    /**
     * Надпись в заголовке. Достается из словаря.
     */
    tools: [{
        type: 'refresh',
        listeners:{
            click: 'onMenuRefresh'
        }
    }]
});
