define('lib/umeditor/dialogs/formula/init',function(require, exports, module) {
    $(function () {

        var UM = parent.UM,
            $iframe = $(getSelfIframe()),
            editorId = $iframe.parents('.edui-body-container').attr('id');
        var editor = editorId ? UM.getEditor(editorId) : null,
            timer,
        //标识编辑器是否获得焦点
            isumfoucus = false;

        /* 获得当前公式所在的iframe节点 */
        function getSelfIframe() {
            var iframes = parent.document.getElementsByTagName('iframe');
            for (var key in iframes) {
                if (iframes[key].contentWindow == window) {
                    return iframes[key];
                }
            }
            return null;
        }

        /* 获得当前url上的hash存储的参数值 */
        function getLatex() {
            return $iframe.attr('data-latex') || '';
        }

        /* 保存场景 */
        function saveScene() {
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                editor.fireEvent('savescene');
                editor.fireEvent('contentchange');
                editor.fireEvent('selectionchange');
                timer = null;
            }, 300);
        }

        /* 设置编辑器可编辑 */
        function enableEditor() {
            if (editor.body.contentEditable == 'false') {
                editor.setEnabled();
            }
        }

        /* 设置编辑器不可编辑 */
        function disableEditor() {
            if (editor.body.contentEditable == 'true') {
                editor.setDisabled(['undo', 'redo', 'preview', 'formula'], true);
            }
        }

        /* 公式 */
        var Formula = function () {
            var _this = this,
                latex = getLatex();

            this.isFocus = false;
            this.isDisabled = false;
            this.editor = editor;

            /* 加载公式内容 */
            this.$mathquill = $('.mathquill-editable').mathquill('latex', latex);

            /* 清除初始化的高亮状态 */
            this.$mathquill.removeClass('hasCursor');

            /* 设置活动状态的公式iframe */
            if (editor) {
                this.$mathquill.on('mousedown', function () {
                    /* 编辑器不可用时,公式也不可用 */
                    if (_this.disabled || editor.container == undefined)  return false;

                    isumfoucus = false;

                    /* 第一次点击当前公式,设置公式活动 */
                    if (!$iframe.hasClass('edui-formula-active')) {
                        //修改第一次点击编辑公式不生效 by lkl 2014-9-1
                        disableEditor();
                        //                    editor.blur();
                        editor.$body.find('iframe').not($iframe).each(function (k, v) {
                            v.contentWindow.formula.blur();
                        });
                        if (_this.$mathquill.find('.cursor').css('display') == 'none') {
                            _this.refresh();
                            _this.$mathquill.addClass('hasCursor');
                        }
                    }
                    _this.focus();
                });
                editor.addListener('click', function () {
                    _this.blur();
                    enableEditor();
                    isumfoucus = true;
                });

                /* 里面focus,编辑器也判断为focus */
                editor.addListener('isFocus', function () {
                    return _this.isFocus;
                });
                /* um不可用,公式也不可编辑 */
                editor.addListener('setDisabled', function (type, except) {
                    if (!(except && except.join(' ').indexOf('formula') != -1) && _this.isDisabled != true) {
                        _this.setDisabled();
                    }
                });
                editor.addListener('setEnabled', function () {
                    if (_this.isDisabled != false) {
                        _this.setEnabled();
                    }
                });

                /* 设置更新外层iframe的大小和属性 */
                $(document.body).on('keydown', function () {
                    _this.updateIframe();
                }).on('keyup', function () {
                    _this.updateIframe();
                });

                /*当公式编辑插件失去焦点并且编辑器未获得焦点时的处理 by lkl */
                $('.mathquill-editable').focusout(function () {
                    setTimeout(function () {
                        if (!isumfoucus) {
                            window.parent.umutils.showContent(editor);
                        }
                        else {
                            enableEditor();
                        }
                    }, 300);
                });

                /* 初始化后延迟刷新外层iframe大小 */
                setTimeout(function () {
                    _this.updateIframe();
                }, 300);
            }
            else {
                this.$mathquill.on('mousedown', function () {
                    $(this).find('.cursor').remove();
                    $(this).find('.hasCursor').removeClass('hasCursor');
                });
                $(".textarea").remove();
            }

        };

        Formula.prototype = {
            focus: function () {
                $iframe.addClass('edui-formula-active');
                this.isFocus = true;
            },
            blur: function () {
                $iframe.removeClass('edui-formula-active');
                this.removeCursor();
                this.isFocus = false;
            },
            removeCursor: function () {
                this.$mathquill.find('span.cursor').hide();
                this.$mathquill.parent().find('.hasCursor').removeClass('hasCursor');
            },
            updateIframe: function () {
                $iframe.width(this.$mathquill.width() + 8).height(this.$mathquill.height() + 8);
                var latex = $iframe.attr('data-latex'),
                    newLatex = this.getLatex();
                if (latex != newLatex) {
                    $iframe.attr('data-latex', this.getLatex());
                    saveScene();
                }
            },
            insertLatex: function (latex) {
                this.$mathquill.mathquill('write', latex);
                this.updateIframe();
                this.removeCursor();
            },
            setLatex: function (latex) {
                this.$mathquill.mathquill('latex', latex);
                this.updateIframe();
            },
            getLatex: function () {
                return this.$mathquill.mathquill('latex');
            },
            redraw: function () {
                this.$mathquill.mathquill('redraw');
            },
            setDisabled: function () {
                this.blur();
                var latex = this.getLatex();
                this.$mathquill.mathquill('revert').text(latex).mathquill();
                this.updateIframe();
                this.isDisabled = true;
            },
            setEnabled: function () {
                this.$mathquill.removeClass('mathquill-rendered-math');
                this.refresh();
                this.isDisabled = false;
            },
            refresh: function () {
                var latex = this.getLatex();
                this.$mathquill.mathquill('revert').text(latex).mathquill('editable');
                this.updateIframe();
            }
        };

        /* 绑定到window上，给上级window调用 */
        //将对象绑定到父页面的全局变量。 by lkl
        window.parent.plugin = window.formula = new Formula();
    });
});