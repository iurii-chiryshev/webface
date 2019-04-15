/**
 * Класс представления нижнего колонтитула для главного окна
 *
 * @class Webface.view.main.Footer
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.main.Footer', {
    extend: 'Ext.container.Container',
    xtype: 'main-footer',

    height: 30,

    layout: 'center',

    items: [
        {
            xtype: 'component',
            bind: {
                html: '{footer}'
            }
        }
    ]
});
