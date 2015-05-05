/**
 * Created by lkl on 2014/9/16.
 */
/*
 * UMeidtor使用辅助类
 * 
 */
define('lib/umeditor/umutils', function (require, exports, module) {
    var plugin = null;

    function UMUtils(options) {
        var me = this;
        me.ums = {};
        me.um;
        me.inputId = null;

        me.options = $.extend({
            1: {
                id: "myTKEditor",
                umoptions: {
                    toolbar: ['fontfamily fontsize bold italic underline | formula superscript subscript | image | undo redo '], autoHeightEnabled: true
                },
                needBorder: false
            },
            2: {
                id: "myJDEditor",
                umoptions: {
                    toolbar: ['fontfamily fontsize bold italic underline | table formula superscript subscript | image | undo redo '], autoHeightEnabled: true
                },
                needBorder: true
            }
        }, options);

        me.umoptions = {
            //focus时自动清空初始化时的内容
            autoClearinitialContent: true,
            //关闭字数统计
            wordCount: false,
            //关闭elementPath
            elementPathEnabled: false,
            withoutToolbar: true
            //更多其他参数，请参考umeditor.config.js中的配置项
        };
    };
    UMUtils.prototype = {
        showEditor: function (editor, type) {
            var me = this;
            if (plugin) {
                if (me.um == plugin.editor) {
                    me.showContent(me.um);
                }
            }

            if ($("#" + me.options[type].id).length == 0) {
                //在body附加编辑器DIV
                $("body").append("<div id='" + me.options[type].id + "'></div>");
                me.ums[type] = me.um = UM.getEditor(me.options[type].id, $.extend(me.umoptions, me.options[type].umoptions));
                me.um.addListener("blur", function () {
                    if ((plugin == null || plugin == "undefined" || !plugin.isFocus) && !this.getOpt("dialogshow") && !this.getOpt("imageScale")) {
                        me.showContent(this);
                    }
                });
                !me.options[type].needBorder && $("#" + me.options[type].id).css("border-left", "none").css("border-right", "none").css("border-top", "none").css("max-height", 100 + "px");
            }
            var um = me.um = me.ums[type];
            var inputId = me.inputId = "#" + editor.id;
            um.setOpt("inputId", inputId, true);
            if (um.container.style.display == "none") {
                um.container.style.display = "block";
                um.$container.show();
            }
            var content = $.trim($(inputId).html());
            um.setContent(content);
            um.setWidth(editor.offsetWidth);
            //根据输入区域重置编辑器的绝对位置
            um.container.style.position = "absolute";
            var offset = $(editor).offset();
            um.container.style.left = offset.left + "px";
            if (type == 1) {
                um.container.style.bottom = $(window).height() - offset.top - editor.offsetHeight + "px";
            }
            else {
                um.container.style.top = offset.top - um.container.offsetHeight + um.body.offsetHeight + "px";
            }
            um.setHeight(editor.offsetHeight);
            um.focus(1);
        },

        //显示页面输入框内容
        showContent: function (editor) {
            var me = this;
            if (me.um == editor) {
                var content = editor.getContent()
                var root = UM.htmlparser(content);
                editor.filterInputRule(root);
                content = root.toHtml();
                var content = content.replace(/^<p>/g, "").replace(/<\/p>$/g, "").replace(/<p><\/p>/g, "");
                $(me.inputId).html(content);
            }
            editor.$container.hide();
            plugin = null;
        }

    };
    module.exports = UMUtils;
});
