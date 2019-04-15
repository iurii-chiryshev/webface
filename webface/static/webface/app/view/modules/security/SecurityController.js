/**
 * Created by Iurii Chiryshev <iurii.chiryshev@mail.ru> on 22.12.2015.
 */
Ext.define('Webface.view.modules.security.SecurityController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.security',

    requires: [
        'Webface.view.modules.security.UserForm',
        'Webface.view.modules.security.GroupForm',
        'Webface.view.modules.security.MenuForm'
    ],

    /**
     * Добавить листовой узел меню (панель) с кнопки тулбара т.е. с неизвестной selections
     * @param button
     */
    onAddLeafMenuClick: function(button){
        this.addMenu(true);
    },

    /**
     * Добавить родительский узел меню с кнопки тубара
     * @param button
     */
    onAddParentMenuClick: function(button){
        this.addMenu(false);
    },

    /**
     *
     * @param is_leaf - добавить лист или узел
     */
    addMenu: function(is_leaf){
        var parent = this.getSelectionByRef('menusTreeGrid'); // вытаскиваем selected строку
        if(!parent || parent.isLeaf()) return; // не нашел selected или этот узел листовой
        var record = this.createNewMenuItem(parent,is_leaf);
        this.createMenuDialog(record);
    },

    /**
     * Найти запись, связанную либо с кнопкой, либо выбранную
     * @param button кнопка
     * @param ref - ссылка на компонент(грид)
     */
    getSelectedOrWidgetRecord: function(button,ref){
        var record = null;
        if(button && typeof button.getWidgetRecord === "function"){
            record = button.getWidgetRecord();
        }else{
            record = this.getSelectionByRef(ref);
        }
        return record;
    },

    /**
     * Найти выделенную запись в grid
     * @param ref - строка reference (в каком компоннете искать)
     * @returns {*} - record
     */
    getSelectionByRef: function(ref){
        var record = null;
        try{
            var grid = this.lookupReference(ref); // найти grid по reference
            record = grid.getSelectionModel().getSelection()[0]; // вытащить выделенную запись
        }catch(e){
            alert('getSelectionByRef error');
        }
        return record;
    },

    /**
     * Создать новый menu item
     * @param parent - родительский узел (куда вставляем)
     * @param isLeaf - что добавляем узел или лист
     * @returns {*} - record
     */
    createNewMenuItem: function(parent,isLeaf){
        var node = {
            glyph: "xf128", // знак ?
            parent_uuid: parent.get("uuid")
        };
        // для листа ставим пустую панель и соответствующую надпись
        if(isLeaf){
            node.module_xtype = "base-module";
            node.text = "New leaf";
            node.leaf  = true;
        } else{
            node.text = "New parent";
        }
        // добавляем ноду в родителя
        var record = parent.appendChild(node);
        //раскрываем родителя
        if (!parent.isExpanded()) {
            parent.expand(false);
        }
        // делаем ее выбранной
        var grid = this.lookupReference('menusTreeGrid');
        grid.getSelectionModel().select(record,true,true);

        return record;
    },

    /**
     * Показать диалог редактированиея меню
     * @param record
     */
    createMenuDialog: function(record){
        var me = this;
        var view = me.getView();
        me.dialog = view.add({
            xtype: 'security-menu-form',
            viewModel: {
                data: {
                    currentMenu: record
                }
            }
        });
        // подписываемся на изменение groups в record
        record.groups().on({
            add: { fn: me.changeAssociatedGroups(record), scope: me, single: true},
            remove: { fn: me.changeAssociatedGroups(record), scope: me, single: true}
        });
        record.groups().reload();
        me.dialog.show();
    },

    /**
     *
     * @param button
     */
    onEditMenuClick: function(button){
        var me = this;
        var record = me.getSelectedOrWidgetRecord(button,'menusTreeGrid');
        if(!record) return;
        me.createMenuDialog(record);
    },

    /**
     * сохранить меню
     * @param button
     */
    onSaveMenuClick: function(button){
        var me = this;
        var store = me.getStore('menus');
        store.sync({
            failure: function(){
                // что-то пошло не так - откатываем
                store.rejectChanges();
            },
            scope: me
        });
        me.dialog = Ext.destroy(me.dialog);
    },

    /**
     * отменить редактирование меню
     * @param button
     */
    onCancelMenuClick: function(button){
        var me = this;
        var store = me.getStore('menus');
        store.rejectChanges();
        me.dialog = Ext.destroy(me.dialog);
    },



    /**
     * Кнопка удаления меню
     * @param button
     */
    onDeleteMenuClick: function(button){
        var me = this;
        var record = me.getSelectedOrWidgetRecord(button,'menusTreeGrid');
        if(!record || record.isRoot() === true) return; // корень удалять нельзя
        var store = me.getStore('menus');
        var grid = this.lookupReference('menusTreeGrid');
        Ext.Msg.show({
            title:'Delete?',
            msg: 'Are you sure you want to delete item and all it children?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (buttonId){
                if (buttonId == 'yes'){
                    // удалить
                    record.drop();
                    // синхронизация с сервером
                    store.sync({
                    failure: function(){
                            // что-то пошло не так - перезагрузить
                            store.reload();
                        },
                        scope: me
                    });
                // selected root
                grid.getSelectionModel().select(store.getRoot(),true,true);
                }
            }
        });
    },


    /**
     * удаление группы
     * @param button
     */
    onDeleteGroupClick: function(button){
        var me = this;
        var record = me.getSelectedOrWidgetRecord(button,'groupsGrid');
        if(!record) return;
        var store = me.getStore('groups');

        Ext.Msg.show({
            title:'Delete?',
            msg: 'Are you sure you want to delete group?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (buttonId){
                if (buttonId == 'yes'){
                    // удалить
                    record.drop();
                    // синхронизация с сервером
                    store.sync({
                        failure: function(){
                            // что-то пошло не так - перезагрузить
                            store.reload();
                        },
                        scope: me
                    });
                }
            }
        });
    },

    /**
     * редактирование группы
     * @param button
     */
    onEditGroupClick: function(button){
        var me = this;
        var record = me.getSelectedOrWidgetRecord(button,'groupsGrid');
        if(record){
            // породить диалог
            me.createGroupDialog(record);
        }
    },

    /**
     * добавить группу
     * @param button
     */
    onAddGroupClick: function(button){
        var me = this;
        var store = me.getStore('groups');
        me.createGroupDialog(store.add({
            name: 'New group'
        })[0]);
    },

    /**
     * создать диалог редактирования группы
     * @param record
     */
    createGroupDialog: function(record){
        console.log('createGroupDialog');
        console.log(record);
        var me = this;
        var view = me.getView();
        me.dialog = view.add({
            xtype: 'security-group-form',
            viewModel: {
                data: {
                    currentGroup: record
                }
            }
        });
        me.dialog.show();
    },

    /**
     * на диалоге редактирования группы нажали сохранить
     * @param button
     */
    onSaveGroupClick: function(button){
        var me = this;
        var store = me.getStore('groups');
        store.sync({
            failure: function(){
                // что-то пошло не так - откатываем
                store.rejectChanges();
            },
            scope: me
        });
        me.dialog = Ext.destroy(me.dialog);
    },

    /**
     * на форме редактирования группы нажали отмену
     * @param button
     */
    onCancelGroupClick: function(button){
        var me = this;
        var store = me.getStore('groups');
        store.rejectChanges();  // сбросить изменения
        me.dialog = Ext.destroy(me.dialog);
    },


    /**
     * удаление пользователя
     */
    onDeleteUserClick: function(){
        alert('delete not implemented');
    },

    /**
     * нажали кнопку редактирования пользователя с тулбара или строки
     * @param button
     * @param e
     * @param options
     */
    onEditUserClick: function(button, e, options){
        var me = this;
        var record = me.getSelectedOrWidgetRecord(button,'usersGrid');
        if(!record) return;
        var view = me.getView();
        // породить диалог
        me.dialog = view.add({
            xtype: 'security-user-form',
            viewModel: {
                data: {
                    currentUser: record
                }
            }
        });
        // подписываемся на изменение groups в record
        record.groups().on({
            add: { fn: me.changeAssociatedGroups(record), scope: me, single: true},
            remove: { fn: me.changeAssociatedGroups(record), scope: me, single: true}
        });
        // загрузить группы заново т.к.
        record.groups().reload();
        // форму редактирования на экран
        me.dialog.show();
    },

    /**
     * добавить нового пользователя
     * @param button
     */
    onAddUserClick: function(button){
        alert('add not implemented');
    },

    /**
     * на форме редактирования пользователя нажали сохранить
     * @param button
     */
    onSaveUserClick: function(button){
        var me = this;
        var store = me.getStore('users');
        store.sync({
            failure: function(){
                // что-то пошло не так - откатываем
                store.rejectChanges();
            },
            scope: me
        });
        me.dialog = Ext.destroy(me.dialog);
    },

    /**
     * на форме редактирования пользователя нажали отмену
     * @param button
     */
    onCancelUserClick: function(button){
        var me = this;
        var store = me.getStore('users');
        store.rejectChanges(); // сбросить изменения
        me.dialog = Ext.destroy(me.dialog); // прибить диалог
    },


    /**
     *
     * @param record
     * @returns {Function}
     */
    changeAssociatedGroups: function(record){
        return function(store){
            // добавили или удалили ассоциативные данные
            // меняем это поле, чтоб stor.sync() отправил данные
            record.set('change_associated_groups',Webface.Util.generateUuid());
        }
    }
});