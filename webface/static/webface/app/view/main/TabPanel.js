/**
 * Центральная панель, контейнер для динамических tab панелей, видимость/невидимость которых обеспечивается правами
 * или привилегиями конкретных пользователей. Не, не так... Панель видима, если пользователь нажмет на
 * соответствующий лист деререва в меню. А вот увидит ли пользователь этот лист - это зависит от его прав.
 * По умолчанию содержит одну панель (Главная), которую нельзя закрыть.
 *
 * @class Webface.view.main.TabPanel
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.main.TabPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'main-tabpanel',

    requires:[
        'Webface.view.locale.Translation',
        'Webface.view.main.ResponsiveMenu',
        'Webface.view.Util',
        'Webface.Locales'
    ],

    activeTab: 0,

    border: false,

    tabBar: {
        items: [
            {   // заполнитель, прижимает содержимое tabBar вправо
                xtype: 'tbfill',
                margin: '0 7 7 0'
            },
            {
                // менюшка, только для маленьких экранов
                xtype: 'responsive-menu',
                margin: '0 7 7 0'
            },
            {
                // выбор локали приложения
                xtype: 'translation',
                margin: '0 7 7 0'
            },
            {
                // кнопка пользователя с расрывающейся менюшкой
                xtype: 'button',
                margin: '0 7 7 0',
                iconCls: 'fa fa-user fa-lg',
                bind: {
                    text: '{shortName}',
                    tooltip: '{fullName}'
                },
                text:'button',
                menu:  [
                    {
                        // Настройки профиля
                        text:'Profile Settinngs',
                        glyph: 'xf013@FontAwesome',
                        bind: {
                            // скрываем если пользователь не авторизован
                            hidden: '{!isAuthorized}'
                        },
                        listeners: {
                            // пока ничего не слушаем
                        }
                    },{
                        // Выход
                        text: Webface.Locales.tr("logout"),
                        glyph: 'xf08b@FontAwesome',
                        listeners: {
                            click: 'onLogout'
                        }
                    }
                ]
            }
        ]
    },

    items: Webface.view.Util.superuserTabItems()
});
