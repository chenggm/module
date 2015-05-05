/**
 * Created by lkl on 2014/10/10.
 */
define('module/question/newQuestion',function(require, exports, module) {
    var common = require("module/core/common");
    var UMUtils = require("lib/umeditor/umutils");
    var _lang = common._lang;
    var rootURL = common.getRootPath();
    (function () {
        var newQuestion = function (style) {
            this.type = 1, this.question = $("<div></div>"), this.qnum = 0, this.umutils = null, this.child = [];
            this.config = {
                style: {
                    //区域样式
                    regionClass: "questionDiv",
                    titleClass: "title",
                    inputAreaClass: "inputArea"
                },
                lang: 'zh-cn'
            };

            this.selectType = {
                1: {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O'},
                2: {0: '1', 1: '2', 2: '3', 3: '4', 4: '5', 5: '6', 6: '7', 7: '8', 8: '9', 9: '10', 10: '11', 11: '12', 12: '13', 13: '14', 14: '15'},
                3: {0: 'I', 1: 'II', 2: 'III', 3: 'IV', 4: 'V', 5: 'VI', 6: 'VII', 7: 'VIII', 8: 'IX', 9: 'X', 10: 'XI', 11: 'XII', 12: 'XIII', 13: 'XIV', 14: 'XV'}
            };

            this.blankTitle = {
                0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I',
                9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T',
                20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z', 26: 'AA', 27: 'AB', 28: 'AC', 29: 'AD'
            };

            this.questionType = {1: 'question.single.select', 2: 'question.multi.select', 3: 'question.judge',
                4: 'question.blank', 5: 'question.short.answer', 6: 'question.listen',
                7: 'question.zonghe', 8: 'question.line', 9: 'question.follow'};
            this.initScore = {1: "2", 2: "2", 3: "2", 4: "1", 5: "5", 6: "0", 7: "0", 8: "5", 9: "2"};
        };

        newQuestion.prototype = {
            //构造新题目
            generate: function (type, questionArea, values) {
                this.type = type;
                if (questionArea) {
                    this.question = questionArea;
                }

                //构造分值区
                this.generateScore(this.question, type);
                //构造题干
                this.generateTitle(this.question);
                //构造选项
                this.generateItems(this.question, type, values);
                //构造解析
                this.generateNote(this.question);
                this.qnum++;
                return  this.question;
            },
            //构造分值区
            generateScore: function (question, type) {
                var typeRegExp = /^6|7$/;
                var scoreDiv = '<div style="margin:5px">'
                    + '<span style="color:#F21C1C">' + this.getLang(this.questionType[type]) + '</span>('
                    + '<input type="text" id="score' + this.qnum + '" style="width:20px" value="'
                    + this.initScore[type] + '" qtype="' + type + '" ' + (!typeRegExp.test(type) ? "" : disabled = "disabled") + '>)' + this.getLang('question.score') + '</div>';
                question.append(scoreDiv);
                $("#score" + this.qnum).change(function () {
                    var regRate = /^(?:[1-9]?\d|100)$/;
                    if (!regRate.test($(this).val())) {
                        alert(nq.getLang('question.score.input.error'));
                        return;
                    }
                    var num = parseInt($(this).attr("id").substr(5));
                    num > 0 && nq.changeParentScore();
                });

            },
            //构造题干
            generateTitle: function (question) {
                var titleDiv = '<div class=' + this.config.style.regionClass + '><div class=' + this.config.style.titleClass
                    + '>' + this.getLang('question.title') + '</div><div contenteditable="true" class='
                    + this.config.style.inputAreaClass + ' id="questionTitle' + this.qnum + '" onfocus="nq.showEditor(this,2,' + this.qnum + ')">'
                    + this.getLang('question.input.please') + '</div><div class="filebox" id="tUpload' + this.qnum
                    + '"> <a href="javascript:void();" class="btn green">' + this.getLang('question.attachment') + '</a>'
                    + '<iframe frameborder="0" style="position:absolute; top:0; left:70px; filter:Chroma(Color=white)" allowtransparency="true" scrolling="no" width="90" height="30" src="'
                    + rootURL + '/js/question/js/html/fileUpload.html"></iframe>'
                    + '</div><div class="clear"></div><div style="margin-left: 70px" id="tUploadDiv' + this.qnum + '"></div>';
                question.append(titleDiv);
            },
            // 构造选项
            generateItems: function (question, type, values) {
                if (type < 9) {
                    itemDiv = $('<div class="' + this.config.style.regionClass + '"></div>');
                    this.itemsFunc[type].call(this, itemDiv, values);
                    question.append(itemDiv);
                }
            },
            //构造解析
            generateNote: function (question) {
                var noteDiv = '<div class=' + this.config.style.regionClass + '><div class=' + this.config.style.titleClass
                    + '>' + this.getLang('question.note') + '</div><div contenteditable="true" class='
                    + this.config.style.inputAreaClass + ' id="questionNote' + this.qnum + '" onfocus="nq.showEditor(this,2,' + this.qnum + ')">'
                    + this.getLang('question.input.please') + '</div><div class="filebox" id="nUpload' + this.qnum
                    + '"> <a href="javascript:void();" class="btn green">' + this.getLang('question.attachment') + '</a>'
                    + '<iframe frameborder="0" style="position:absolute; top:0; left:70px; filter:Chroma(Color=white)" allowtransparency="true" scrolling="no" width="90" height="30" src="'
                    + rootURL + '/js/question/js/html/fileUpload.html"></iframe>'
                    + '</div><div class="clear"></div><div style="margin-left: 70px" id="nUploadDiv' + this.qnum + '"></div>';
                question.append(noteDiv);
            },
            //各题型的选项
            itemsFunc: {
                //单选
                1: function (itemDiv, values) {
                    this.generateSelectItems(itemDiv, 1, values);
                },
                //多选
                2: function (itemDiv, values) {
                    this.generateSelectItems(itemDiv, 2, values);
                },
                //判断题
                3: function (itemDiv) {
                    var div = '<div class=' + this.config.style.titleClass + '>' + this.getLang('question.option') + '</div><div class="options" >'
                        + '<div><input type="radio" name="judge' + this.qnum + '" value="0" checked>&nbsp;&nbsp;'
                        + '<img src="' + rootURL + '/images/question/AnswerRight.jpg" title=' + this.getLang('question.right') + '></div>'
                        + '<div><input type="radio" name="judge' + this.qnum + '" value="1" >'
                        + '<img src="' + rootURL + '/images/question/AnswerWrong.jpg" title=' + this.getLang('question.wrong') + '></div></div>';
                    itemDiv.append(div);
                },
                //填空题
                4: function (itemDiv) {
                    var div = '<div class=' + this.config.style.titleClass + '>' + this.getLang('question.answer')
                        + '</div><div class="options" id="qItem' + this.qnum + '"></div>';
                    itemDiv.append(div);
                },
                //简答题
                5: function (itemDiv) {
                    var div = '<div class=' + this.config.style.titleClass + '>' + this.getLang('question.answer')
                        + '</div><div class="options"> <div class="shortanswer"  contenteditable="true" id="shortAnswer' + this.qnum
                        + '" onfocus="nq.showEditor(this,2,' + this.qnum + ')">' + this.getLang('question.input.please')
                        + '</div></div>';
                    itemDiv.append(div);
                },
                //听力题
                6: function (itemDiv) {
                    this.generateChildItems(itemDiv);
                },
                //综合题
                7: function (itemDiv) {
                    this.generateChildItems(itemDiv);
                },
                //连线题
                8: function (itemDiv) {
                    itemDiv.append('<div class=' + this.config.style.titleClass + '>' + this.getLang('question.option') + '</div>')
                    var div = $('<div class="options" ></div>');
                    var tb = $("<table width='100%' class='line_table' id='linetb" + this.qnum + "' border='0' cellspacing='0' cellpadding='0'></table>");
                    var tbody = $("<tbody></tbody>");
                    tb.append(tbody);
                    div.append(tb);
                    itemDiv.append(div);
                    for (var i = 0; i < 4; i++) {
                        var tr = $("<tr></tr>");
                        var colA = $("<td  location='A'></td>");
                        var colB = $("<td  location='B'></td>");

                        tr.append(colA).append(colB);
                        tbody.append(tr);

                        colA.append(this.createTdTable(1, i, this.qnum));
                        colB.append(this.createTdTable(2, i, this.qnum));
                    }

                    var OperationTb = $("<table width='100%' border='0' cellspacing='0' cellpadding='0'></table>");
                    var opTbodyQ = $("<tbody></tbody>");
                    OperationTb.append(opTbodyQ);
                    var opTr = $("<tr></tr>");
                    var opA = $("<td><input type='button' value='" + this.getLang('question.add.option') + "' onclick='nq.addTR(1," + this.qnum + ")'><input type='button' value='" + this.getLang('question.delete.option') + "' onclick='nq.deleteTR(1," + this.qnum + ")'></td>");
                    var opB = $("<td><input style='margin-left:120px' type='button' id='addRowBtn_B" + this.qnum + "'value='" + this.getLang('question.add.option') + "' onclick='nq.addTR(2," + this.qnum + ")'><input type='button' value='" + this.getLang('question.delete.option') + "' onclick='nq.deleteTR(2," + this.qnum + ")'></td>");
                    var opC = $("<td><input id='addRowBtn_C" + this.qnum + "' style='display:none' type='button' value='" + this.getLang('question.add.option') + "' onclick='nq.addTR(3," + this.qnum + ")'><input id='delRowBtn_C" + this.qnum + "' type='button' style='display:none' value='" + this.getLang('question.delete.option') + "' onclick='nq.deleteTR(3," + this.qnum + ")'></td>");
                    var opD = $("<td><input id='addColBtn" + this.qnum + "' style='' type='button' value='" + this.getLang('question.add.colume') + "' onclick='nq.addCol(" + this.qnum + ")'><input id='delColBtn" + this.qnum + "' style='display:none' type='button' value='" + this.getLang('question.delete.colume') + "' onclick='nq.delCol(" + this.qnum + ")'></td>");

                    opTr.append(opA).append(opB).append(opC).append(opD);
                    opTbodyQ.append(opTr);
                    div.append(OperationTb);
                }
            },
            /*
             * 生成连线题单个选项内容
             *colNum 1-A列 2-B列 3-C列
             *rowNum 从0开始
             */
            createTdTable: function (colNum, rowNum, qnum) {
                var colName = this.convertColName(colNum);

                var tb = $("<table width='100%' border='0' cellspacing='0' cellpadding='0' class='timuLine'></table>");
                var tbody = $("<tbody></tbody>");
                var tr = $("<tr></tr>");

                var cnt = $("<td align='left'><div contenteditable='true'  style='min-height:50px;position: relative;' id='div_" + colName + "_" + rowNum + "' onfocus='nq.showEditor(this,3," + qnum + ")' >" + this.getLang('question.input.please') + "</div></td>");
                var btn = $("<td width='10' location='" + colName + "'></td>");
                var span = $("<span class='line_button' onclick='nq.drawLine(this);' id='" + qnum + "line_" + colNum + "_" + rowNum + "' name='" + qnum + "line_" + colName + "_" + rowNum + "' value='" + colName + rowNum + "'>&nbsp;</span>");
                btn.append(span);

                if (colNum == 1) {
                    tr.append(cnt).append(btn);
                }
                else {
                    tr.append(btn).append(cnt);
                }
                tbody.append(tr);
                tb.append(tbody);
                return tb;
            },
            drawLine: function (obj) {
                question_link_option(obj);
                auto_print_line();
            },
            addTR: function (colNum, qnum) {

                var colName = this.convertColName(colNum);

                var newTR = $("<tr></tr>");
                var tbody = $("#linetb" + qnum).children("tbody");

                var tr = tbody.children("tr");
                var trLen = tr.length;
                //连线题存在几列
                var tdNum = tr.eq(0).children("td").length;
                //连线题列中存在的几个选项
                var colNameTds = tr.children("td[location=" + colName + "]");

                if (colNameTds.length > 15) {
                    alert(this.getLang('question.add.num.alert'));
                    return;
                }

                //列的选项和行数可能不一样，因为列中可能存在空的选项
                if (colNameTds.length != trLen) {
                    var lastTd = tr.eq(colNameTds.length).children("td").eq(colNum - 1);
                    lastTd.attr("location", colName);
                    lastTd.append(this.createTdTable(colNum, colNameTds.length, qnum));

                    //如果是B列，需要判断连线题目前存在几列，3列时要添加练习点
                    if (tdNum == 3 && colName == 'B') {
                        var tempTbody = lastTd.find("tbody");
                        var tdPoint = tempTbody.find("td").eq(0).clone();
                        tdPoint.find("span").attr("id", qnum + "line_4_" + colNameTds.length);
                        tempTbody.find("tr").append(tdPoint);
                    }

                }
                else {
                    tbody.append(newTR);
                    for (var i = 0; i < tdNum; i++) {
                        var td = $("<td class='td_link_class'></td>");
                        if ((colNum - 1) == i) {
                            td.attr("location", colName);
                            td.append(this.createTdTable(colNum, trLen, qnum));
                        }
                        newTR.append(td);
                    }

                    //如果是B列，需要判断连线题目前存在几列，3列时要添加练习点
                    if (tdNum == 3 && colName == 'B') {
                        var tempTbody = newTR.find("td").eq(colNum - 1).find("tbody");
                        var tdPoint = tempTbody.find("td").eq(0).clone();
                        tdPoint.find("span").attr("id", qnum + "line_4_" + colNameTds.length);
                        tempTbody.find("tr").append(tdPoint);
                    }
                }


            },

            deleteTR: function (colNum, qnum) {
                var colName = this.convertColName(colNum);

                var tbody = $("#linetb" + qnum).children("tbody");
                var tr = tbody.children("tr");
                var colNameTds = tr.children("td[location=" + colName + "]");
                if (colNameTds.length <= 1) {
                    alert(this.getLang('question.delete.num.alert'));
                    return;
                }
                var lastTd = tr.eq(colNameTds.length - 1).children("td").eq(colNum - 1);

                lastTd.find("table").remove();
                lastTd.removeAttr("location");
                //最后一行的td里面都不存在内容时把tr删除
                var lastTr = tr.last();
                var isHasCnt = false;
                lastTr.children("td").each(function () {
                    if ($(this).find("table").length > 0) {
                        isHasCnt = true;
                        return;
                    }
                });
                if (!isHasCnt)
                    lastTr.remove();

                //如果连了线需要把线删掉
                var answer = MY_STUDENTANSWERMAP.get(qnum + "line");
                if (typeof(answer) != "undefined") {
                    var newAnswer = [];
                    var answers = answer.answers[0].content[0].split(",");
                    var deleteName = colName + (colNameTds.length - 1);
                    $.each(answers, function (i, v) {
                        var one = v.split("-");
                        if (one[0] != deleteName && one[1] != deleteName) {
                            newAnswer.push(v);
                        }

                    });

                    MY_STUDENTANSWERMAP.remove(qnum + "line");
                    questionSelectMap.remove(qnum + "line");
                    autoLineMap.put(qnum + "line", newAnswer.join(","));
                    auto_print_line();
                }

            },

            //和B列保持一致
            addCol: function (qnum) {
                var tbody = $("#linetb" + qnum).children("tbody");
                var tr = tbody.children("tr");
                tr.each(function (idx, obj) {
                    var tdB = $(this).children("td").eq(1);

                    var td = tdB.clone();
                    if (typeof(td.attr("location")) != "undefined") {
                        td.attr("location", "C");
                    }
                    var tdTable = td.find("table");
                    if (tdTable.length > 0) {
                        //B列新增连线的点
                        var btnTd = tdB.find("td").eq(0).clone();
                        btnTd.find("span").attr("id", qnum + "line_4_" + idx);
                        tdB.find("tr").append(btnTd);

                        //C列连线点id，值，名称修改
                        var tbTableTds = tdTable.find("td");
                        tbTableTds.eq(0).attr("location", "C");
                        var btn = tbTableTds.eq(0).find("span");
                        btn.attr("id", qnum + "line_5_" + idx);
                        btn.attr("name", qnum +
                            "line_C_" + idx);
                        btn.attr("value", "C" + idx);
                        tbTableTds.eq(1).find("div").attr("id", qnum + "div_C_" + idx);
                    }
                    $(this).append(td);
                });
                $("#addColBtn" + qnum).hide();
                $("#delColBtn" + qnum).show();

                $("#addRowBtn_C" + qnum).show();
                $("#delRowBtn_C" + qnum).show();
                $("#addRowBtn_B" + qnum).css("margin-left", "80px");
                auto_print_line();

            },
            //删除C列
            delCol: function (qnum) {
                var tbody = $("#linetb" + qnum).children("tbody");
                var tr = tbody.children("tr");
                tr.each(function (idx, obj) {
                    var tdC = $(this).children("td").eq(2);
                    tdC.remove();

                    //删除B列右侧连线点
                    var tdB = $(this).children("td").eq(1);
                    tdB.find("td").eq(2).remove();
                });


                //如果连了线需要把线删掉
                var answer = MY_STUDENTANSWERMAP.get(qnum + "line");
                if (typeof(answer) != "undefined") {
                    var newAnswer = [];
                    var answers = answer.answers[0].content[0].split(",");

                    $.each(answers, function (i, v) {
                        var one = v.split("-");
                        if (one[0].substring(0, 1) != 'C' && one[1].substring(0, 1) != 'C') {
                            newAnswer.push(v);
                        }

                    });
                    MY_STUDENTANSWERMAP.remove(qnum + "line");
                    questionSelectMap.remove(qnum + "line");
                    autoLineMap.put(qnum + "line", newAnswer.join(","));

                    auto_print_line();
                }

                $("#addColBtn" + qnum).show();
                $("#delColBtn" + qnum).hide();

                $("#addRowBtn_C" + qnum).hide();
                $("#delRowBtn_C" + qnum).hide();
                $("#addRowBtn_B" + qnum).css("margin-left", "130px");
            },

            convertColName: function (colNum) {
                var colName = 'A'
                if (colNum == 1) {
                    colName = 'A';
                }
                else if (colNum == 2) {
                    colName = 'B';
                }
                if (colNum == 3) {
                    colName = 'C';
                }
                return colName;
            },

            //生成选择题选项
            generateSelectItems: function (itemDiv, type, values) {
                var check = values ? values.type : 1;
                var div = '<div class=' + this.config.style.titleClass + '>' + this.getLang('question.option') + '</div><div class="options" >'
                    + '<div><input type="radio" name="selectType' + this.qnum + '" onclick="nq.changeSelectTitle(this,' + this.qnum
                    + ')" value="1" ' + (check == 1 ? "checked" : "") + ' >' + this.getLang('question.letter')
                    + '&nbsp;&nbsp;&nbsp;&nbsp;'
                    + '<input type="radio" name="selectType' + this.qnum + '" onclick="nq.changeSelectTitle(this,' + this.qnum
                    + ')" value="2" ' + (check == 2 ? "checked" : "") + '>' + this.getLang('question.number')
                    + '&nbsp;&nbsp;&nbsp;&nbsp;'
                    + '<input type="radio" name="selectType' + this.qnum + '" onclick="nq.changeSelectTitle(this,' + this.qnum
                    + ')" value="3" ' + (check == 3 ? "checked" : "") + '>' + this.getLang('question.rome')
                    + '&nbsp;&nbsp;&nbsp;&nbsp;' + '</div><div id="options' + this.qnum + '"><ul>';

                if (!values || values.content.length == 0) {
                    var opNmae = {0: 'A', 1: 'B', 2: 'C', 3: 'D'};
                    for (var i = 0; i < 4; i++) {
                        var li = '<li><input type="' + (type == 1 ? "radio" : "checkbox") + '" name="option' + this.qnum + '" value="' + i + '"' + (i == 0 ? "checked" : "")
                            + '>&nbsp;&nbsp;<span id="' + this.qnum + 'opt' + (i + 1) + '">' + opNmae[i] + '</span>'
                            + '<div class="optioninput"  contenteditable="true" id="' + this.qnum + 'option' + (i + 1)
                            + '" onfocus="nq.showEditor(this,3,' + this.qnum + ')">' + this.getLang('question.input.please')
                            + '</div><div class="optoperation"><img src="' + rootURL + '/images/question/del.png" onclick="nq.delSelectItem(this,' + this.qnum + ')" title='
                            + this.getLang('question.delete') + '></div></li>';

                        div += li;
                    }
                }
                else {
                    var sType = values.type;
                    for (var i = 0; i < values.content.length; i++) {
                        var li = '<li><input type="' + (type == 1 ? "radio" : "checkbox") + '" name="option' + this.qnum + '" value="' + i + '"' + (i == 0 ? "checked" : "")
                            + '>&nbsp;&nbsp;<span id="' + this.qnum + 'opt' + (i + 1) + '">' + this.selectType[sType][i] + '</span>'
                            + '<div class="optioninput"  contenteditable="true" id="' + this.qnum + 'option' + (i + 1)
                            + '" onfocus="nq.showEditor(this,3,' + this.qnum + ')">' + values.content[i]
                            + '</div><div class="optoperation"><img src="' + rootURL + '/images/question/del.png" onclick="nq.delSelectItem(this,' + this.qnum + ')" title='
                            + this.getLang('question.delete') + '></div></li>';

                        div += li;
                    }
                }

                div += '</ul></div><div class="optionadd" id="optionadd" onClick="nq.addSelectItem(' + this.qnum + ')">'
                    + this.getLang('question.add') + '</div></div>';
                itemDiv.append(div);
            },
            changeSelectTitle: function (obj, qnum) {
                var val = parseInt($(obj).val());
                var num = $("#options" + qnum + " > ul > li").length;
                for (var i = 0; i < num; i++) {
                    $("#" + qnum + "opt" + (i + 1)).text(this.selectType[val][i]);
                }
            },
            //新增选择题选项
            addSelectItem: function (qnum) {
                var num = $("#options" + qnum + " > ul > li").length;
                if (num == 15) {
                    alert(this.getLang('question.select.num.alert'));
                    return;
                }
                num = num + 1;
                var type = parseInt($('input[name="selectType' + qnum + '"]:checked').val());
                var li = '<li><input type="' + (type == 1 ? "radio" : "checkbox") + '" name="option' + qnum + '" value="' + num
                    + '">&nbsp;&nbsp;<span id="' + qnum + 'opt' + num + '">' + this.selectType[type][num - 1] + '</span>'
                    + '<div class="optioninput"  contenteditable="true" id="' + qnum + 'option' + num
                    + '" onfocus="nq.showEditor(this,3,' + qnum + ')">' + this.getLang('question.input.please')
                    + '</div><div class="optoperation"><img src="' + rootURL + '/images/question/del.png" onclick="nq.delSelectItem(this,' + qnum + ')" title='
                    + this.getLang('question.delete') + '></div></li>';
                $("#options" + qnum + " > ul").append(li);
            },
            //删除选择题选项
            delSelectItem: function (obj, qnum) {
                var li = $(obj).parents("li");
                var type = parseInt($('input[name="selectType' + qnum + '"]:checked').val());
                li.remove();
                $("#options" + qnum + " > ul > li").each(function (i, n) {
                    $($(this).find("input")[0]).val(i);
                    $($(this).find("span")[0]).attr("id", qnum + "opt" + (i + 1));
                    $($(this).find("span")[0]).text(nq.selectType[type][i]);
                    $($(this).find("div")[0]).attr("id", qnum + "option" + (i + 1));
                });
            },
            generateChildItems: function (itemDiv) {
                var div = '<div class="childselect"><select id="childType"><option value="1">' + this.getLang(this.questionType[1]) + '</option>'
                    + '<option value="2">' + this.getLang(this.questionType[2]) + '</option>'
                    + '<option value="3">' + this.getLang(this.questionType[3]) + '</option>'
                    + '<option value="4">' + this.getLang(this.questionType[4]) + '</option>'
                    + '<option value="5">' + this.getLang(this.questionType[5]) + '</option>'
                    + '<option value="8">' + this.getLang(this.questionType[8]) + '</option>'
                    + '</select>&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" onclick="nq.generateChildQuestion()" value="'
                    + this.getLang('question.add.child') + '"></div>';
                itemDiv.css("position", "relative");
                itemDiv.append(div);
            },
            //生成子试题
            generateChildQuestion: function () {
                var type = parseInt($("#childType option:selected").val());
                var child = $("<div id='child" + this.qnum + "' style='margin-left: 20px'></div>");
                child.insertBefore($(".childselect"));

                //构造分值区
                this.generateScore(child, type);
                //构造题干
                this.generateTitle(child);
                //构造选项
                this.generateItems(child, type);
                //构造解析
                this.generateNote(child);

                $("#score" + this.qnum).parent().append('<img style="margin-left:20px" src="' + rootURL + '/images/question/del.png" onclick="nq.deleteChild('
                    + this.qnum + ')" title=' + this.getLang('question.delete.question') + '>');
                $(".childselect").css({position: "relative", 'margin-top': "20px"});
                this.child.push(this.qnum);
                this.qnum++;
                this.changeParentScore();
            },
            deleteChild: function (qnum) {
                $("#child" + qnum).remove();
                //如果连了线需要把线删掉
                var answer = MY_STUDENTANSWERMAP.get(qnum + "line");
                if (typeof(answer) != "undefined") {
                    MY_STUDENTANSWERMAP.remove(qnum + "line");
                    questionSelectMap.remove(qnum + "line");
                    autoLineMap.remove(qnum + "line");
                }
                var childTemp = this.child;
                this.child = [];
                for (var i = 0; i < childTemp.length; i++) {
                    if (childTemp[i] != qnum) {
                        this.child.push(childTemp[i]);
                    }
                }
                if (this.child.length == 0) {
                    $(".childselect").css({position: "absolute"});
                }
                this.changeParentScore();
            },
            changeParentScore: function () {
                var score = 0;
                for (var i = 0; i < this.child.length; i++) {
                    score += parseInt($("#score" + this.child[i]).val());
                }
                $("#score0").val(score);
            },
            //设置语言
            setLang: function (lang) {
                this.config.lang = lang;
            },
            getLang: function (code) {
                return _lang(code);
            },
            showEditor: function (editor, type, num) {
                if (this.umutils == null) {
                    this.umutils = new UMUtils({
                        3: {
                            id: "myAnswerEditor",
                            umoptions: {
                                toolbar: ['fontfamily fontsize bold italic underline | formula superscript subscript | image video| undo redo '], autoHeightEnabled: true
                            },
                            needBorder: true
                        },
                        4: {
                            id: "myBlankEditor",
                            umoptions: {
                                toolbar: ['fontfamily fontsize bold italic underline | blank table formula superscript subscript | image video| undo redo '],
                                autoHeightEnabled: true,
                                afterBlankDel: function (ids) {
                                    nq.afterBlankDel(ids);
                                },
                                afterBlankInsert: function (ids, id) {
                                    nq.afterBlankInsert(ids, id);
                                },
                                maxBlank: 30
                            },
                            needBorder: true
                        }
                    });
                }
                if (type == 2) {
                    var qtype = parseInt($("#score" + num).attr("qtype"));
                    if (qtype != 4) {
                        var regRxp = /questionNote/;
                        if (qtype != 9 || regRxp.test(editor.id)) {
                            this.umutils.showEditor(editor, type);
                        }
                    }
                    else {
                        this.umutils.showEditor(editor, 4);
                    }
                }
                else {
                    this.umutils.showEditor(editor, type);
                }
            },
            //插入填空回调
            afterBlankInsert: function (ids, id) {
                var index;
                for (var i = 0; i < ids.length; i++) {
                    if (id == ids[i]) {
                        index = i;
                        break;
                    }
                }
                var num = parseInt(this.umutils.inputId.substr(14));
                var div = $("#blankOptions" + num);
                if ($("#blankOptions" + num).length == 0) {
                    div = $('<div id="blankOptions' + num + '"></div>');
                }
                var answers = {};
                $("#blankOptions" + num + " > ul > li").each(function (i, n) {
                    var div = $(this).find("div")[0];
                    answers[i] = div;
                });
                div.html("");
                var ul = $("<ul></ul>"), li;
                for (var i = 0; i < index; i++) {
                    li = $("<li></li>");
                    li.append('<span>' + this.blankTitle[i] + '</span>');
                    li.append(answers[i]);
                    ul.append(li);
                }
                li = $("<li></li>");
                li.append('<span>' + this.blankTitle[index] + '</span>');
                li.append('<div class="optioninput" contenteditable="true" id="' + num + 'opt' + id + '" onfocus="nq.showEditor(this,3,' + num + ')">' + this.getLang('question.input.please') + '</div>');
                ul.append(li);
                for (var i = index + 1; i < ids.length; i++) {
                    li = $("<li></li>");
                    li.append('<span>' + this.blankTitle[i] + '</span>');
                    li.append(answers[i - 1]);
                    ul.append(li);
                }
                ul.append(li);
                $("#qItem" + num).html("");
                $("#qItem" + num).css("position", "relative");
                $("#qItem" + num).append(div.append(ul).append('<div class="uniqueAnswer"><input type="checkbox" name="uniqueAnswer" checked>' + this.getLang('question.unique.answer') + '</div>'));

                if (ids.length > 1) {
                    var score = parseInt($("#score" + num).val()) + 1;
                    $("#score" + num).val(score);
                    num > 0 && this.changeParentScore();
                }

            },
            //删除填空回调
            afterBlankDel: function (ids) {
                var obj = null;
                var num = parseInt(this.umutils.inputId.substr(14));
                $("#blankOptions" + num + " > ul > li").each(function (i, n) {
                    var id = $($(this).find("div")[0]).attr("id");
                    if ((id != num + "opt" + ids[i]) && obj == null) {
                        obj = $(this);
                    }
                });
                obj.remove();
                $("#blankOptions" + num + " > ul > li").each(function (i, n) {
                    $($(this).find("span")[0]).text(nq.blankTitle[i]);
                });

                var score = parseInt($("#score" + num).val()) - 1;
                $("#score" + num).val(score != 0 ? score : 1);
                num > 0 && this.changeParentScore();
            },
            reset: function () {
                this.qnum = 0;
                this.question.html("");
                $.each(lineMap.elements, function (i, v) {
                    v.value.remove();
                });
            }
        };
        window.nq = new newQuestion();

        module.exports = nq;
    })();
});