/**
 * Служебный, вспомогательный класс с полезными функциями для view
 *
 * @class Webface.view.Util
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.view.Util', {
    singleton: true,

    /**
     * Сформировать и вернуть массив menuitem c допустимыми языками приложения
     * @returns {*[]}
     */
    localeMenuItems: function(){
        var items = [],
            arr = Webface.Util.getSettings("langs",[]);
        for(var i = 0; i < arr.length; i++){
            var lang = arr[i];
            items.push({
                xtype: 'menuitem',
                iconCls: lang, // картинка с флагом, лежит где-то в webface.css
                text: Webface.Locales.tr("lang." + lang)
            });
        }
        return items;
    },
    /**
     * Вернуть моули, которые видидит суперпользователь
     */
    superuserTabItems: function(){
        var is_superuser = Webface.Util.getSettings("is_superuser",false),
            items = [];
        if(is_superuser === true){
            items.push({
                xtype: 'security-module',
                closable: false,
                iconCls: 'fa fa-user-secret fa-lg ',
                title: Webface.Locales.tr("permission")
            });
        }
        return items;
    }
});
