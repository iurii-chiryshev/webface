/**
 * Created by iurii.chiryshev on 08.01.2018.
 */
Ext.define('Webface.Locales', {

    singleton: true,


    _LANGS:{
        ru: Webface.locales.ru,
        en: Webface.locales.en
    },

    /**
     * вернет язык локализации приложения
     * @returns {*|string}
     * @static
     */
    getUserLang: function() {
        return Webface.Util.getSettings("user_lang",Webface.Util.getSettings("default_lang",'en'));
    },

    /**
     * установить язык локализации
     * @param lang
     * @param options
     */
    sendUserLang: function(lang, options){
        Ext.Ajax.request(Ext.applyIf({
            url: 'locales/',
            method: 'POST',
            params: {
                language: lang
            }
        },options || {}));

    },


    tr: function(path){
        var arr = ( path && path.split && path.split('.') ) || [],
            lang = this.getUserLang(),
            locale = this._LANGS[lang] || {};
        for(var i = 0; i < arr.length; i++){
            var val = arr[i];
            if( locale && val in locale) {
                locale = locale[val];
            }
            else {
                break;
            }
        }
        return (locale && typeof locale === 'string' && locale) || path;
    }
});