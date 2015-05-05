/**
 * “保存功能”插件的行为
 */

//注册一个名为“save”的插件
UM.plugins['table'] = function () {

    UM.commands[ 'table' ] = {

        execCommand: function (cmd, opt) {
            var me = this;
            this.setOpt({
                'maxColNum':20,
                'maxRowNum':100,
                'defaultCols':5,
                'defaultRows':5,
                'tdvalign':'top'
            });

            getDefaultValue = function (editor, table) {
                var borderMap = {
                        thin:'0px',
                        medium:'1px',
                        thick:'2px'
                    },
                    tableBorder, tdPadding, tdBorder, tmpValue;
                if (!table) {
                    table = editor.document.createElement('table');
                    table.insertRow(0).insertCell(0).innerHTML = 'xxx';
                    editor.body.appendChild(table);
                    var td = table.getElementsByTagName('td')[0];
                    tmpValue = domUtils.getComputedStyle(table, 'border-left-width');
                    tableBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
                    tmpValue = domUtils.getComputedStyle(td, 'padding-left');
                    tdPadding = parseInt(borderMap[tmpValue] || tmpValue, 10);
                    tmpValue = domUtils.getComputedStyle(td, 'border-left-width');
                    tdBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
                    domUtils.remove(table);
                    return {
                        tableBorder:tableBorder,
                        tdPadding:tdPadding,
                        tdBorder:tdBorder
                    };
                } else {
                    td = table.getElementsByTagName('td')[0];
                    tmpValue = domUtils.getComputedStyle(table, 'border-left-width');
                    tableBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
                    tmpValue = domUtils.getComputedStyle(td, 'padding-left');
                    tdPadding = parseInt(borderMap[tmpValue] || tmpValue, 10);
                    tmpValue = domUtils.getComputedStyle(td, 'border-left-width');
                    tdBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
                    return {
                        tableBorder:tableBorder,
                        tdPadding:tdPadding,
                        tdBorder:tdBorder
                    };
                }
            }

            function createTable(opt, tdWidth) {
                var html = [],
                    rowsNum = opt.numRows,
                    colsNum = opt.numCols;
                for (var r = 0; r < rowsNum; r++) {
                    html.push('<tr' + (r == 0 ? ' class="firstRow"':'') + '>');
                    for (var c = 0; c < colsNum; c++) {
                        html.push('<td width="' + tdWidth + '"  vAlign="' + opt.tdvalign + '" >' + (browser.ie && browser.version < 11 ? domUtils.fillChar : '<br/>') + '</td>')
                    }
                    html.push('</tr>')
                }
                //禁止指定table-width
                return '<table><tbody>' + html.join('') + '</tbody></table>'
            }

            if (!opt) {
                opt = utils.extend({}, {
                    numCols: this.options.defaultCols,
                    numRows: this.options.defaultRows,
                    tdvalign: this.options.tdvalign
                })
            }
            var range = this.selection.getRange(),
                start = range.startContainer,
                firstParentBlock = domUtils.findParent(start, function (node) {
                    return domUtils.isBlockElm(node);
                }, true) || me.body;

            var defaultValue = getDefaultValue(me),
                tableWidth = firstParentBlock.offsetWidth,
                tdWidth = Math.floor(tableWidth / opt.numCols - defaultValue.tdPadding * 2 - defaultValue.tdBorder);

            //todo其他属性
            !opt.tdvalign && (opt.tdvalign = me.options.tdvalign);
            me.execCommand("inserthtml", createTable(opt, tdWidth));
        },
        queryCommandState: function (cmdName) {

            //这里返回只能是 1, 0, -1
            //1代表当前命令已经执行过了
            //0代表当前命令未执行
            //-1代表当前命令不可用

            //在这里总是返回0， 这样做可以使保存按钮一直可点击
            return 0;
        },
        //声明该插件不支持“撤销／保存”功能， 这样就不会触发ctrl+z 和ctrl+y的记忆功能
        notNeedUndo: 1

    };

};
