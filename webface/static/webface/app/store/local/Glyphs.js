/**
 * Created by iurii.chiryshev on 28.08.2017.
 */
Ext.define('Webface.store.local.Glyphs', {
    extend: 'Ext.data.Store',

    fields: [
        ///////////////////////////////////////////////////////////////
        // поля для глифа
        ///////////////////////////////////////////////////////////////
        { name: 'name', type: 'string' },
        { name: 'glyph', type: 'string' },
        { name: 'glyphCls', type: 'string', defaultValue: 'x-tree-icon' },
        { name: 'glyphFontFamily', type: 'string', defaultValue: 'FontAwesome' }
    ],

    data: { data: [
        { glyph: "xf023" ,name: "lock"},
        { glyph: "xf017" ,name: "clock"},
        { glyph: "xf200" ,name: "pie-chart"},
        { glyph: "xf09e" ,name: "feed"},
        { glyph: "xf108" ,name: "desktop"},
        { glyph: "xf0e4" ,name: "dashboard"},
        { glyph: "xf03d" ,name: "video-camera"},
        { glyph: "xf21b" ,name: "user-secret"},
        { glyph: "xf007" ,name: "user"},
        { glyph: "xf26c" ,name: "tv"},
        { glyph: "xf2bc" ,name: "vcard-o"},
        { glyph: "xf2bb" ,name: "vcard"},
        { glyph: "xf013" ,name: "gear"},
        { glyph: "xf085" ,name: "gears"},
        { glyph: "xf298" ,name: "wpforms"},
        { glyph: "xf0c0" ,name: "group"},
        { glyph: "xf1c0" ,name: "database"},
        { glyph: "xf075" ,name: "comment"},
        { glyph: "xf086" ,name: "comments"},
        { glyph: "xf0e0" ,name: "envelope"},
        { glyph: "xf0e8" ,name: "sitemap"},
        { glyph: "xf04b" ,name: "play"},
        { glyph: "xf0ad" ,name: "wrench"},
        { glyph: "xf145" ,name: "ticket"},
        { glyph: "xf120" ,name: "terminal"},
        { glyph: "xf1d8" ,name: "send"},
        { glyph: "xf002" ,name: "search"},
        { glyph: "xf128" ,name: "question"},
        { glyph: "xf1e6" ,name: "plug"},
        { glyph: "xf2db" ,name: "microchip"},
        { glyph: "xf02c" ,name: "tags"},
        { glyph: "xf00a" ,name: "th"},
        { glyph: "xf233" ,name: "server"},
        { glyph: "xf07c" ,name: "folder-open"},
        { glyph: "xf0ce" ,name: "table"},
        { glyph: "xf080" ,name: "bar-chart"}

    ]},

    sorters: [
        {
            property: 'name',
            direction: 'ASC'
        }
    ],

    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});