/**
 * Класс контроллера всего приложения. Экземпляр создается при старте приложения и является глобальным как и само приложенние.
 * ExtJS 5+ поддрерживает две парадигмы создания приложений, даже три: MVC, MVVM и смешанный.
 * Все что касается меню реализуется MVC шаблоном. Это значит, что у меню есть model(store), view и данный controller.
 *
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.controller.Root', {
    extend: 'Ext.app.Controller',

    /**
     * Хранилища (массивом) из простанства имен Webface.store для данного контроллера.
     * Данному контроллеру нужно только хранилище меню. Такая запись автоматом создаст getter на store.
     * @example
     * this.getMenusStore()
     */
    stores: [
        'Menus'
    ],

    /**
     * Представления, связанные с данным контроллером из простанства имен Webface.view. Почему массив пустой:
     * Приложение то стартует с отложенным созданием viewport-a, а данный контроллер создастся сразу.
     * Вот чтобы представления не создавались раньше viewport-a, мы их здесь не прописываем,
     * но подписываемся на нужные их события в init (см. ниже)
     */
    views:[],

    /**
     * Ссылки на другие компоненты приложения.
     */
    refs: [
        {
            /**
             * Ссылка на главную tab панель приложения. Почему сделано так:
             * Данный контроллер создан только для меню, но когда пользователь будет кликать по нему должны
             * открываться соответствующие окна на главной (центральной) панели приложения.
             * Такая запись позволит получить доступ к центральной панели через автоматом созданный getter.
             * @example
             * this.getMainTabPanel()
             */
            ref: 'mainTabPanel',
            selector: 'main-tabpanel'
        }
    ],



    /**
     * Обработкчик события нажатия на элемент меню.
     * @param view
     * @param record
     * @param item
     * @param index
     * @param event
     * @param options
     */
    onMenuItemClick: function(view, record, item, index, event, options){

        // узел должен быть листовым и содержать имя класса (xtype) для отображения
        if( ( !record.get('leaf') ) || ( !record.get('module_xtype') ) ) return;
        // получить центральную tab панель
        var mainTabPanel = this.getMainTabPanel();
        // ищем панель среди уже раскрытых по uuid
        var newTab = mainTabPanel.items.findBy(
            function (tab){
                return tab.getMenuUuid() === record.get('uuid');
            });

        if (!newTab){
            // не нашли, порождаем и добовляем
            newTab = mainTabPanel.add({
                session: this.session, // сессия
                xtype: record.get('module_xtype'), // xtype
                menuUuid: record.get('uuid'), // идентификатор
                glyph: record.get('glyph'), // иконка
                title: record.get('text'), // заголовок
                closable: true // ее можно закрыть

            });

            //todo подписаться на событие menurefresh
        }

        // делаем ее кактивной
        mainTabPanel.setActiveTab(newTab);
    },

    /**
     * Обработчик события меню. Сработает один раз, когда представление меню ляжет на страницу.
     * Это лучшее место, что-бы перевый раз загрузить дерево меню с сервера.
     * @param view
     * @param width
     * @param height
     * @param eOpts
     */
    onMenuBoxReady: function(view, width, height, eOpts) {
        console.log("onMenuBoxReady");
        this.onMenuRefresh(this);

    },

    /**
     * Обработчик события хранилища перед загрузкой данных.
     * Это лучшее место, чтобы передать дополнительные параметры в запросе к серверу.
     * @param store
     * @param operation
     * @param eOpts
     */
    onMenuStoreBeforeLoad: function(store, operation, eOpts){
         console.log("onMenuStoreBeforeload");
    },

    /**
     * Обработчик события хранилища после загрузки данных.
     * @param store
     * @param operation
     * @param eOpts
     */
    onMenuStoreLoad: function(store, operation, eOpts){
         console.log("onMenuStoreLoad");
         console.log(store.getRoot());
    },

    /**
     * Обработчик события "кто-то хочет обновить меню"
     * @param sender -
     */
    onMenuRefresh: function(sender){
        //Получить хранилище меню
        var store  = this.getMenusStore();
        if(store.isLoading()) return; // уже чего-то загружаем прям щас
        //Представлений меню может быть несколько, а store- глобален,
        //поэтому проверяем: а не загрузилось ли хранилище ранее
        if(store.isLoaded()) {
            store.reload(); // уже загружалось ранее, перезагрузить
        }else{
            //Загружаем первый раз, но не через store.load(). Почему так:
            //Установка root.expanded = true для "деревянного" хранилища заставит его загрузиться с сервера "автоматом".
            //Именно поэтому в store.Menus и view.Menu оно установлено в false, а здесь можно и нужно это исправить.
            //К тому же "здесь" мы уже подписаны на события хранилища и можем подсунуть любые параметры в запрос.
            store.setRoot({expanded: true});
        }

    },

    onMenuChanged: function(sender,data){
        console.log ('onMenuChanged');
        console.log (data);
        this.onMenuRefresh(this);
    },

    /**
     * Вернуть сессию
     * @returns {Ext.data.Session|*}
     */
    getSession: function() {
        return this.session;
    },

    /**
     * Перекрытая функция инициализации контроллера "меню".
     * Самое удачное место, чтобы подписатся на интересующие события представлений и моделей
     * @param application
     */
    init: function(application) {
        // глобальные обработчики ajax
        this._initAjax();
        // инициализация ws
        this._initWS();
        // чего слушаем (контролируем) у хранилища меню
        var store = this.getMenusStore();
        store.addListener('beforeload',this.onMenuStoreBeforeLoad);
        store.addListener('load',this.onMenuStoreLoad);

        // чего контролируем у представления меню
        this.control({
            "main-menu": {
                itemclick: this.onMenuItemClick, // клик по узлам деревянного меню
                boxready: this.onMenuBoxReady, // меню сформировано и легло на страницу
                menurefresh: this.onMenuRefresh // надо бы обновить меню (это мое событие!!!)
            }
        });

        // создаем для себя и порождаем одну сессию на все приложение
        this.session = new Ext.data.Session({
            autoDestroy: false
        });
    },

    _initAjax: function(){
        // переопределяем глобально события Ajax
        // перед запросом
        Ext.Ajax.on('beforerequest', function (conn, options) {
            // подмешать в каждый запрос csrftoken
            if (!(/^http:.*/.test(options.url) || /^https:.*/.test(options.url))) {
                if (typeof(options.headers) == "undefined") {
                    options.headers = {'X-CSRFToken': Ext.util.Cookies.get('csrftoken')};
                } else {
                    options.headers.extend({'X-CSRFToken': Ext.util.Cookies.get('csrftoken')});
                }
            }
        }, this);
        // получили HTTP ошибку, т.е. не 200
        Ext.Ajax.on('requestexception', function(conn, response, options) {
            console.log('requestexception');
            console.log(response);
            var apply_cfg = null;
            if(response.status === 401){
                // пользователь не авторизован - дальнейшие телодвижения на сайте бесполезны
                // нужно перезагрузить приложение
                apply_cfg = {
                    fn: function(){
                        // выставить первый диалог
                        Webface.Util.setFirstDialog(Webface.Util.FIRST_DLG.LOGIN);
                        // перезагрузить
                        window.location.reload();
                    }
                };
            }
            //показ
            Webface.Util.showErrorResponse(response,apply_cfg);
        });
        // получили HTTP 200
        Ext.Ajax.on('requestcomplete', function(conn, response, options) {
            console.log('requestcomplete');
            console.log(response);
            console.log(options)
        });
    },


    _initWS: function(){
        var protocol = location.protocol == 'https:'? 'wss':'ws';
        var path = '/core/';
        // Создадим веб-сокет
        this.ws = Ext.create('Webface.ux.WebSocket', {
            url: protocol + "://" + location.host,
            communicationType: 'event',
            listeners: {
                open: function (ws) {
                    console.log ('ws open');
                },
                close: function (ws) {
                    console.log ('ws close');
                },
                error: function (ws, error) {
                    console.log ('ws error');
                    console.log (error);
                },
                message: function (ws, message) {
                    console.log ('ws message');
                    console.log (message);
                }
	        }
        });

        this.ws.on('Menu',this.onMenuChanged, this);
    }


});
