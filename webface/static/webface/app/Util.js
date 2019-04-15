/**
 * Служебный, вспомогательный класс с полезными функциями
 *
 * @class Webface.Util
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.Util', {
    singleton: true,

    _FIRST_DLG_KEY: "first-dialog",

    FIRST_DLG: {
        LOGIN: "login-dialog",
        REGISTER: "register-dialog"
    },

    /**
     * вернуть диалог, который будет показан первым авторизация или регистрация
     * Возвращается xtype вьюшки которую можно создать через ext.widget
     * @returns {*|string}
     * @static
     */
    getFirstDialog: function(){
         // самый первый диалог - это либо регистрация нового пользователя, либо через ввод логина и пароля
        if(localStorage){
            return localStorage.getItem(this._FIRST_DLG_KEY) || this.FIRST_DLG.LOGIN
        }else{
            return this.FIRST_DLG.LOGIN
        }
    },

    /**
     * установить первый диалог пользователя
     * @param {string} dlg
     * @static
     */
    setFirstDialog: function(dlg){
        localStorage.setItem(this._FIRST_DLG_KEY,dlg);
    },

    /**
     * random uuid генератор.
     * Ф. скопирована где-то из из исходников ext просто потому, что я таки не научился вывзывать ее от туда.
     * @returns {string}
     */
    generateUuid: function () {
        var pattern = 'xxxxxxxx-xxxx-4xxx-Rxxx-xMxxxxxxxxxx'.split(''),
            hex = '0123456789abcdef'.split(''),
            length = pattern.length,
            parts = [];

        for (var r, c, i = 0; i < length; ++i) {
            c = pattern[i];

            if (c !== '-' && c !== '4') {
                r = Math.random() * 16;
                r = (c === 'R') ? (r & 3 | 8) : (r | ((c === 'M') ? 1 : 0));
                c = hex[r]; // above floors r so always 0-15
            }

            parts[i] = c;
        }

        return parts.join('');
    },

    decodeJSON: function (text) {

        var result = Ext.JSON.decode(text, true);

        if (!result){
            result = {};
            result.success = false;
            result.msg = text;
        }

        return result;
    },

    /**
     * Оттобразить
     * @param text
     */
    showErrorMsg: function (text) {
        Ext.Msg.show({
            title: Webface.Locales.tr("error"),
            msg: text,
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        });
    },

    /**
     * Вывести отобразить в окне ответ с http ошибкой
     * @param response
     * @param cfg
     */
    showErrorResponse: function (response, cfg) {
        var msg = Ext.String.format('<h2>{0} {1}</h2><div>{2}</div>', response.status, response.statusText,response.responseText);
        Ext.Msg.show(Ext.apply(
            {
                title: Webface.Locales.tr("error"),
                msg: msg,
                modal: true,
                closable: false,
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            },
            cfg || {}
        ));
    },

    /**
     * отобразить ошибку формы
     * @param action
     */
    handleFormFailure: function(action){

        var me = this;

        switch (action.failureType) {
            case Ext.form.action.Action.CLIENT_INVALID:
                // если ошибка произошла здесь на клиенте, на этапе валидации формы
                me.showErrorMsg('Form fields may not be submitted with invalid values');
                break;
            case Ext.form.action.Action.CONNECT_FAILURE:
                // HTTP ошибка с сервера (HttpResponse), т.е. данные доступны в response
                me.showErrorMsg(action.response.responseText);
                break;
            case Ext.form.action.Action.SERVER_INVALID:
                // ошибка пришла в json (JsonResponse), т.е. success выставлен в false
                // в таком случае декодированный результат - это result
                // а сообщение об ощибке лежит в result.msg
                me.showErrorMsg(action.result.msg);
                break;
        }
    },

    /**
     * Получить какое-то значение из настроек, пришедших через шаблонизатор django
     * @param path - чего хотим получить, вложенные объекты разделяются '.'
     * @param defaultValue - если нет такого
     */
    getSettings: function(path,defaultValue){
        var arr = ( path && path.split && path.split('.') ) || [],
            // объект с конфигом
            wfSett = Ext.django_settings || {};
        if(arr.length == 0) return defaultValue;
        for(var i = 0; i < arr.length; i++){
            var val = arr[i];
            if( wfSett && typeof wfSett === 'object' && val in wfSett) {
                wfSett = wfSett[val];
            }
            else {
                wfSett = defaultValue;
                break;
            }
        }
        return wfSett;
    }

});
