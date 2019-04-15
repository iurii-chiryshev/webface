/**
 * Created by iurii.chiryshev on 22.10.2017.
 */
Ext.define('Webface.view.main.MenuController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.mainmenu',

    /**
     * Обработчик нажатия кнопки refresh.
     * @param sender
     */
    onMenuRefresh: function(sender) {
        console.log("onMenuRefresh");
        // можно конечно и тут обновить меню, но лучше
        // переслать его в root controller, он как раз подписан
        // на него, т.к. данное событие могут слать разные view,
        // работающие с меню или изменяющие его.
        this.fireViewEvent('menurefresh', this.getView());
    }


});