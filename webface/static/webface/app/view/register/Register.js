/**
 * Окно-диалог добавления нового пользователя (только внешний вид).
 * Все пользовательские телодвижения передаются его контроллеру RegisterController
 * и там же отрабатываются.
 *
 * @class Webface.view.register.Register
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.register.Register', {
    extend: 'Ext.window.Window',

    requires: [
        'Webface.view.register.RegisterController',
        'Webface.view.locale.Translation',
        'Webface.Locales',
        'Webface.Util'
    ],

    xtype: Webface.Util.FIRST_DLG.REGISTER,



    /**
     * Контроллер представления
     * @see Webface.view.register.RegisterController
     */
    controller: 'register',

    autoShow: true,
    layout: {
        type: 'fit'
    },
    iconCls: 'fa fa-user fa-lg',
    title: Webface.Locales.tr("account"),
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
                vtype: 'alphanum',
                minLength: 1,
                maxLength: 25,
                enableKeyEvents: true,
                listeners: {
                    specialKey: 'onTextFieldSpecialKey'
                }
            },
            items: [
                {
                    name: 'first_name',
                    emptyText: Webface.Locales.tr("first_name"),
                    fieldLabel: Webface.Locales.tr("name")
                },
                {
                    name: 'last_name',
                    emptyText: Webface.Locales.tr("last_name"),
                    fieldLabel: Webface.Locales.tr("surname")
                },
                {
                    inputType: 'email',
                    name: 'email',
                    emptyText: Webface.Locales.tr("email_example"),
                    fieldLabel: Webface.Locales.tr("email"),
                    vtype: 'email'
                },
                {
                    name: 'username',
                    fieldLabel: Webface.Locales.tr("login"),
                    emptyText: Webface.Locales.tr("user_login")
                },
                {
                    inputType: 'password',
                    name: 'password',
                    fieldLabel: Webface.Locales.tr("password"),
                    emptyText: Webface.Locales.tr("user_password"),
                    listeners: {
                        keypress: 'onTextFieldKeyPress'
                    }
                },
                {
                    inputType: 'password',
                    name: 'confirm_password',
                    fieldLabel: Webface.Locales.tr("confirm"),
                    emptyText: Webface.Locales.tr("confirm_password"),
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
                            iconCls: 'fa fa-sign-in fa-lg ',
                            tooltip: Webface.Locales.tr("submit"),
                            listeners: {
                                click: 'onButtonClickLogin'
                            }
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'button',
                            itemId: 'register',
                            formBind: true,
                            iconCls: 'fa fa-user-plus fa-lg ',
                            text: Webface.Locales.tr("create"),
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
