/**
 * Created by lkl on 2014/9/2.
 */
UM.ui.define('tableselector', {
    tabs: function (opt) {
        var lineCount = 10;
        var columCount = 10;

        var html = '<div id="fz_tb_div_containner"><div class="tw_table_list"><div class="tw_tb_text_show_div"></div>';

        for(var i=1; i<=lineCount; i++)
        {
            html+= '<div class="tw_table_line">';

            for(var j=1; j<=columCount; j++)
            {
                html+= '<div class="tw_table_item" xp="'+(i)+'" yp="'+(j)+'"></div>';
            }
            html+= '<div class="tw_clear"></div>';
            html+= '</div>';
        }
        html += '</div></div>';
        return html;
    },

    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.supper.mergeTpl(me.tabs(options)),options)));

        me.root().on("click",function (e) {
            me.trigger('clicktable');
        });
    }
}, 'popup');