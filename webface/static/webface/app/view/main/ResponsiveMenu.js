/**
 * Класс представления split кнопки, в раскрывающемся списке которой появляется menu (главное меню)
 * @see Webface.view.main.Menu
 * Сама кнопка находится в верхней панели центрального окна
 * @see Webface.view.main.TabBar
 *
 *
 * @class Webface.view.main.ResponsiveMenu
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.main.ResponsiveMenu', {
    extend: 'Ext.button.Split',
    xtype: 'responsive-menu',

    requires: [
        'Webface.view.main.MainModel'
    ],

    tooltip: Webface.Locales.tr("menu"),

    iconCls: 'fa fa-bars fa-lg',

    plugins: 'responsive',
    responsiveConfig: {
        'width < 768 && tall': {
            visible: true
        },
        'width >= 768': {
            visible: false
        }
    },

    menu: {
        xtype: 'menu',
        plain: true,
        items: [{
            /**
             * При раскрытиии меню, будет открываться наше "деревянное" меню
             * @see Webface.view.main.Menu
             */
            xtype: 'main-menu',
            /**
             * Заголовок с иконкой вообще не нужны, у кнопки все есть
             */
            header: false,
            /**
             * Красиво конечно, когда контейнер сам увеличивает размеры
             * при раскрытии дерева, но в Ext на эту тему есть какой-то глюк,
             * поэтому размер "деревянного" меню фиксируем, но даем пользователю его менять
             */
            height: 384,
            minHeight: 192,
            maxHeight: 768,
            resizable: true
        }]
    }
});
