/**
 * Служебный, вспомогательный класс с полезными функциями для моделей
 *
 * @class Webface.model.Util
 * @author Iurii Chiryshev <iurii.chiryshev@mail.ru>
 */
Ext.define('Webface.model.Util', {
    singleton: true,

    /**
     * поля модели/ей меню
     * @returns {*[]}
     */
    menuFields: function(){
        var fields = [
            ///////////////////////////////////////////////////////////////
            // поля меню
            ///////////////////////////////////////////////////////////////
            { name: 'text', type: 'string' }, // текст элемента дерева меню
            { name: 'glyph', type: 'string' }, // glyph
            { name: 'glyphCls', type: 'string', defaultValue: 'x-tree-icon' }, // css class для glyph не предается с клиента
            { name: 'glyphFontFamily', type: 'string', defaultValue: 'FontAwesome' }, // семейство шрифтов
            { name: 'module_xtype', type: 'string' }, // xtype панели, которая будет отображена по клику
            { name: 'parent_uuid', type: 'string'}, // идентификатор родительского узла
            // Поле для проверки изменения ассоциативных данных, в данном случае групп у меню
            // stor не умеет определять такие изменения и если изменить только группы вызов sync()
            // не приведет к запросу, поэтому меняем это поле когда меняются группы
            { name: 'change_associated_groups',type: 'string',defaultValue: ''}

        ];
        return fields;
    }
});
