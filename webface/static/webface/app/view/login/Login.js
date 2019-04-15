/**
 * Окно-диалог входа пользователя в систему (только внешний вид).
 * Все пользовательские телодвижения передаются его контроллеру LoginController
 * и там же отрабатываются.
 *
 * @class Webface.view.login.Login
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.login.Login', {
    extend: 'Ext.window.Window',

    requires: [
        'Webface.view.login.LoginController',
        'Webface.view.locale.Translation',
        'Webface.Locales',
        'Webface.Util'
    ],

    xtype: Webface.Util.FIRST_DLG.LOGIN,



    controller: 'login',

    autoShow: true,
    layout: {
        type: 'fit'
    },
    iconCls: 'fa fa-key fa-lg',
    title: Webface.Locales.tr("log_in"),
    closeAction: 'hide',
    closable: false,
    draggable: false,
    resizable: false,
    width: 400,
    items: [
        {
            xtype: 'form',
            reference: 'form',
            bodyPadding: 10,
            defaults: {
                padding: 5,
                xtype: 'textfield',
                anchor: '100%',
                labelWidth: 120,
                allowBlank: false,
                vtype: 'alphanum', // допустимы только буквы и цифры
                minLength: 1,
                maxLength: 15,
                //msgTarget: 'title',
                enableKeyEvents: true,
                listeners: {
                    specialKey: 'onTextFieldSpecialKey'
                }
            },
            items: [
                {
                    name: 'username', // логин
                    emptyText: Webface.Locales.tr("user_login"),
                    fieldLabel: Webface.Locales.tr("login")
                },
                {
                    inputType: 'password',
                    name: 'password', // пароль
                    emptyText: Webface.Locales.tr("user_password"),
                    fieldLabel: Webface.Locales.tr("password"),
                    listeners: {
                        keypress: 'onTextFieldKeyPress'
                    }
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            xtype: 'translation'
                        },
                        {
                            xtype: 'button',
                            iconCls: 'fa fa-user-plus fa-lg ',
                            //text: Webface.Locales.tr("create"),
                            tooltip: Webface.Locales.tr("create_an_account"),
                            listeners: {
                                click: 'onButtonClickRegister'
                            }
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
                            itemId: 'submit',
                            formBind: true,
                            iconCls: 'fa fa-sign-in fa-lg ',
                            text: Webface.Locales.tr("submit"),
                            listeners: {
                                click: 'onButtonClickSubmit'
                            }
                        }


                    ]
                }
            ]
        }
    ]
});
