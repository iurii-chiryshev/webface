/**
 * Класс представления главного окна всего приложения он же viewport.
 * Это контейнер, который содержит другие контейнеры, расположенный с определенном порядке.
 * Центральный контейнер (center region) - для динамических tab панелей, которые добавляются по клику соотв. менюшки;
 * Верхний контейнер (north region) - для заголовка приложения, меню, выбора языка, logout и пр.
 * Нижний контейнер (south region) - нижний колонтитул
 * Правый колонтитул (west region) - под динамические модули и меню
 *
 * @class Webface.view.main.Main
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.main.Main', {
    extend: 'Ext.container.Container',

    plugins: 'viewport',

    xtype: 'main-container',

    requires: [
        'Webface.Locales',
        'Webface.Util',
        'Webface.view.main.Footer',
        'Webface.view.main.TabPanel',
        'Webface.view.main.MainController',
        'Webface.view.main.MainModel',
        'Webface.view.main.Menu'
    ],

    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'border'
    },

    items: [{
        region: 'center',
        xtype: 'main-tabpanel'
    },{
        xtype: 'main-footer',
        region: 'south'
    },{
        xtype: 'main-menu',
        region: 'west',
        split: true,
        collapsible: true,
        plugins: 'responsive',
        responsiveConfig: {
            'width < 768 && tall': {
                visible: false
            },
            'width >= 768': {
                visible: true
            }
        }
    }]
});
