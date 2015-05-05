/******************{questionId, childId, useTime, typeLevel, answers[{sequenceNo,content}]}*******************************/
//key question  studentAnswer
var MY_STUDENTANSWERMAP = new Map();

/*****************連線題***************************/
var startPoint = {id: null, parentQuestionId: '0', parentTypeLevel: '0', typeLevel: '8', value: null, x: 0, y: 0};
var endPoint = {id: null, parentQuestionId: '0', parentTypeLevel: '0', typeLevel: '8', value: null, x: 0, y: 0};
var hasPoint = 0;
var currentId = '0';
var isLineOption = false;
//建立了連線的點;
var questionSelectMap = new Map();
var lineMap = new Map();
//自动连线
var autoLineMap = new Map();

//子节点数组
var childPiontArray = null;

//数组添加中间删对象的方法
Array.prototype.baoremove = function (dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
　  this.splice(dx, 1);
}

//数组添加包含对象的方法
Array.prototype.contains = function (elem) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == elem) {
            return true;
        }
    }
    return false;
}

//手动连线，
function question_link_option(point, autoFlag, correct) {
    $(point).css({background: '../images/hight_ico.png"'});
    //檢查是否已連線
    var hasUsePoint = questionSelectMap.get(point.id);
    //hasUsePoint = false;
    if (hasUsePoint) {
        //多对多时，判断删除连线
        if (hasUsePoint.length > 0 && hasPoint > 0) {
            for (var i = 0; i < hasUsePoint.length; i++) {
                //判断点击过的两个点是否已经连线，如果连接过，就删附掉
                if (hasUsePoint[i] == endPoint.id) {
                    //删除线
                    removeLine(point.id + hasUsePoint[i]);
                    removeLine(hasUsePoint[i] + point.id);
                    questionSelectMap.removeKey(hasUsePoint[i]);
                    questionSelectMap.removeKey(point.id);
                    hasPoint = 0;
                    if (!autoFlag) {
                        //删除已连线的答案
                        remove_line_result(point.id, hasUsePoint[i], autoFlag);

                        $("#" + point.id).css({background: '../images/lineradio.png'});
                        $("#" + endPoint.id).css({background: '../images/lineradio.png'});
                        $("#" + startPoint.id).css({background:'../images/lineradio.png'});
                        $("#" + hasUsePoint[i]).attr("checked", false);
                        //	$(point).css({background: "none"});
                        return;
                    }
                }

                //后往前删
                if (hasUsePoint[i] == startPoint.id) {
                    if (!autoFlag) {
                        //删除线
                        removeLine(point.id + hasUsePoint[i]);
                        removeLine(hasUsePoint[i] + point.id);

                        //删除保存的连线集合
                        if (questionSelectMap.get(hasUsePoint[i]) &&
                            questionSelectMap.get(hasUsePoint[i]).length > 0) {
                            if (questionSelectMap.get(hasUsePoint[i]).length == 1) {
                                questionSelectMap.removeKey(hasUsePoint[i]);
                            }
                            else {
                                for (var z = 0; z < questionSelectMap.get(hasUsePoint[i]).length; z++) {
                                    if (questionSelectMap.get(hasUsePoint[i])[z] == point.id) {
                                        questionSelectMap.get(hasUsePoint[i]).baoremove(z);
                                    }
                                }
                            }
                        }

                        if (questionSelectMap.get(point.id) &&
                            questionSelectMap.get(point.id).length > 0) {
                            if (questionSelectMap.get(point.id).length == 1) {
                                questionSelectMap.removeKey(point.id);
                            }
                            else {
                                for (var z = 0; z < questionSelectMap.get(point.id).length; z++) {
                                    if (questionSelectMap.get(point.id)[z] == startPoint.id) {
                                        questionSelectMap.get(point.id).baoremove(z);
                                    }
                                }
                            }
                        }

                        //questionSelectMap.removeKey(point.id);
                        hasPoint = 0;
                        //删除已连线的答案
                        remove_line_result(point.id, startPoint.id, autoFlag);
                        $("#" + point.id).css({background: '../images/lineradio.png'});
                        $("#" + startPoint.id).css({background: '../images/lineradio.png'});
                        $("#" + endPoint.id).css({background: '../images/lineradio.png'});
                        $("#" + hasUsePoint[i]).attr("checked", false);
                        //	$(point).css({background: "none"});
                        return;
                    }

                }

            }
        }
    }
    //如果重復點同一點，如果該點已連線，就取該點的連線
    if (currentId == point.id && point.checked == false) {
        hasPoint = 1;
        return;
    }
    var X = $("#" + point.id).offset().left;
    var Y = $("#" + point.id).offset().top;

    if (X == 0 && Y == 0) {
        return;
    }
    if (hasPoint == 0) {
        startPoint.id = point.id;
        startPoint.parentQuestionId = $(point).attr("name");
        startPoint.value = $(point).attr("value");
        startPoint.x = X;
        startPoint.y = Y;
        hasPoint = 1;
        currentId = point.id;
    }
    else if (hasPoint == 1) {
        endPoint.id = point.id;
        endPoint.parentQuestionId = $(point).attr("name");
        endPoint.value = $(point).attr("value");
        endPoint.x = X;
        endPoint.y = Y;
        hasPoint = 2;
    }
    var start_question_col_row = null;
    var end_question_col_row = null;
    //是否点的第二点
    if (hasPoint == 2) {
        //判断是否是同一个试题
        //选项 试题编号 - 列号 - 行号
        end_question_col_row = startPoint.id.split("_");
        start_question_col_row = endPoint.id.split("_");

        if (end_question_col_row[0] != start_question_col_row[0]) {
            $("#" + startPoint.id).css({background: '../images/lineradio.png'});
            //hasPoint=1;
            point.checked = false;

            startPoint.id = point.id;
            startPoint.parentQuestionId = $(point).attr("name");
            startPoint.value = $(point).attr("value");
            startPoint.x = X;
            startPoint.y = Y;
            hasPoint = 1;
            currentId = point.id;
            return;
        }
        //是否是同一列
        if (end_question_col_row[1] == start_question_col_row[1]) {
            $("#" + startPoint.id).css({background: '../images/lineradio.png'});
            point.checked = false;
            //$(point).css({background: "none"});
            //hasPoint=1;
            startPoint.id = point.id;
            startPoint.parentQuestionId = $(point).attr("name");
            startPoint.value = $(point).attr("value");
            startPoint.x = X;
            startPoint.y = Y;
            hasPoint = 1;
            currentId = point.id;
            return;
        }
        //alert(end_question_col_row[2]-start_question_col_row[2]);
        //是否是列不相近的，不充許連
        if (end_question_col_row[1] - start_question_col_row[1] != 1 && end_question_col_row[1] - start_question_col_row[1] != -1) {
            $("#" + startPoint.id).css({background: '../images/lineradio.png'});
            point.checked = false;
            //$(point).css({background: "none"});
            //hasPoint=1;
            startPoint.id = point.id;
            startPoint.parentQuestionId = $(point).attr("name");
            startPoint.value = $(point).attr("value");
            startPoint.x = X;
            startPoint.y = Y;
            hasPoint = 1;
            currentId = point.id;
            return;
        }
        //保存對應的連線的點
        if (null == questionSelectMap.get(startPoint.id) ||
            undefined == questionSelectMap.get(startPoint.id)) {
            questionSelectMap.set(startPoint.id, new Array());
        }

        if (null == questionSelectMap.get(endPoint.id) ||
            undefined == questionSelectMap.get(startPoint.id)) {
            questionSelectMap.set(endPoint.id, new Array());
        }

        //过滤相同的pointId
        if (questionSelectMap.get(startPoint.id).length >= 0) {
            var fag = false;
            for (var i = 0; i < questionSelectMap.get(startPoint.id).length; i++) {
                if (questionSelectMap.get(startPoint.id)[i] == endPoint.id) {
                    fag = true;
                    break;
                }
            }
            if (!fag) {
                questionSelectMap.get(startPoint.id)[questionSelectMap.get(startPoint.id).length] = endPoint.id;
            }
        }

        if (questionSelectMap.get(endPoint.id).length >= 0) {
            var fag = false;
            for (var i = 0; i < questionSelectMap.get(endPoint.id).length; i++) {
                if (questionSelectMap.get(endPoint.id)[i] == startPoint.id) {
                    fag = true;
                    break;
                }
            }
            if (!fag) {
                questionSelectMap.get(endPoint.id)[questionSelectMap.get(endPoint.id).length] = startPoint.id;
            }
        }

        //questionSelectMap.set(endPoint.id, startPoint.id);
        isLineOption = true;
        //清掉记录当前已选中的点
        currentId = '0';
    }

    if (isLineOption) {
        //画之前先删除
        removeLine(startPoint.id + endPoint.id);
        removeLine(endPoint.id + startPoint.id);

        //保存连线题答案
        var questionId = start_question_col_row[0];

        var link_value;
        if (end_question_col_row[1] < start_question_col_row[1]) {
            link_value = startPoint.value + "-" + endPoint.value;
        } else {
            link_value = endPoint.value + "-" + startPoint.value;
        }
        if (MY_STUDENTANSWERMAP.get(questionId)) {
            moveOradd_result_value(questionId, link_value, 1);
        } else {
            var MY_STUDENTANSWER = {};
            if (startPoint.parentQuestionId != '0') {
                //添加父题型
                var MY_PARENT_STUDENTANSWER = {};
                var pQuesitonIdAndType = startPoint.parentQuestionId.split("_");
                if (pQuesitonIdAndType.length == 2) {
                    if (!MY_STUDENTANSWERMAP.get(pQuesitonIdAndType[0])) {
                        MY_PARENT_STUDENTANSWER.questionId = pQuesitonIdAndType[0];
                        MY_PARENT_STUDENTANSWER.typeLevel = pQuesitonIdAndType[1];
                        MY_PARENT_STUDENTANSWER.publishId = PAPER_PUBLISHID;
                        MY_PARENT_STUDENTANSWER.answers = [];
                        MY_STUDENTANSWERMAP.set(pQuesitonIdAndType[0], MY_PARENT_STUDENTANSWER);
                    }
                }

                MY_STUDENTANSWER.questionId = questionId;
                MY_STUDENTANSWER.childId = pQuesitonIdAndType[0];
            } else {
                MY_STUDENTANSWER.questionId = questionId;
            }
            MY_STUDENTANSWER.typeLevel = startPoint.typeLevel;
            MY_STUDENTANSWER.answers = [
                {sequenceNo: '0', content: [link_value]}
            ];
//				 MY_STUDENTANSWER.publishId = PAPER_PUBLISHID;
            MY_STUDENTANSWERMAP.set(questionId, MY_STUDENTANSWER);
        }
        if (startPoint.x < endPoint.x) {
            startPoint.x = startPoint.x + 12;
        } else {
            endPoint.x = endPoint.x + 12;
        }

        startPoint.y = startPoint.y + 6;
        endPoint.y = endPoint.y + 6;
        line(startPoint.x, startPoint.y, endPoint.x, endPoint.y, startPoint.id + endPoint.id, correct);
        isLineOption = false;
        hasPoint = 0;

        //重绘时使用
        if (!autoFlag) {
            autoLineMap.put(questionId, MY_STUDENTANSWERMAP.get(questionId).answers[0].content[0]);
        }

        $("#" + startPoint.id).css({background: '../images/lineradio.png'});
        $("#" + endPoint.id).css({background: '../images/lineradio.png'});
        endPoint.id = 0;
    }
}

//删除已连线的答案
function remove_line_result(startPointId, endPointId, autoFlag) {
    var link_value;
    var startValue = $("#" + startPointId).attr("value");
    var endValue = $("#" + endPointId).attr("value");
    var start_question_col_row = startPointId.split("_");
    var end_question_col_row = endPointId.split("_");

    if (end_question_col_row[1] < start_question_col_row[1]) {
        link_value = endValue + "-" + startValue;
    } else {
        link_value = startValue + "-" + endValue;
    }
    //remove result
    moveOradd_result_value(start_question_col_row[0], link_value, 2);

    autoLineMap.put(start_question_col_row[0], MY_STUDENTANSWERMAP.get(start_question_col_row[0]).answers[0].content[0]);

    if (MY_STUDENTANSWERMAP.get(start_question_col_row[0]).answers[0].content[0] == "") {
        //MY_STUDENTANSWERMAP.remove(start_question_col_row[0]);
    }
}


//1: add , 2: remove
function moveOradd_result_value(questionId, value, type) {
    var studentAnnswer = MY_STUDENTANSWERMAP.get(questionId);
    if (studentAnnswer) {
        var contentAnswer = studentAnnswer.answers;
        if (contentAnswer) {
            //字符串在最前面的情况
            contentAnswer[0].content[0] = contentAnswer[0].content[0].replace(value + ",", "");
            //字符串在中间或最后面的情况
            contentAnswer[0].content[0] = contentAnswer[0].content[0].replace("," + value, "");
            //单独一个字符串的情况
            contentAnswer[0].content[0] = contentAnswer[0].content[0].replace(value, "");
            if (type == 1) {
                if (contentAnswer[0].content[0] == null || contentAnswer[0].content[0] == "") {
                    contentAnswer[0].content[0] = value;
                } else {
                    contentAnswer[0].content[0] += "," + value;
                }
            }
        }
    }
}

//auto link option
function auto_link_option(answerList, questionId) {
    //A0-B1,B1-C0,A1-B0,B0-C1,A2-B2,A3-B3,B3-C2,B2-C3,
    var backupHasPoint = hasPoint;
    var backupStartPoint = cloneObj(startPoint);
    hasPoint = 0;
    if (answerList instanceof Array) {
        studentAnswerLine(answerList, questionId);
    }
    else {
        answerLine(answerList, questionId)
    }
    hasPoint = backupHasPoint;
    startPoint = backupStartPoint;
}


/**
 * 该需求是修改EBAG-21369问题单
 *  遍历标准的连线题答案(不带有correct字段标识)，并开始画线
 *
 * @param answerList
 * @returns
 */
function studentAnswerLine(studentAnswers, questionId) {
    for (var j = 0; j < studentAnswers.length; j++) {
        if (studentAnswers[j].answer.length >= 5) {
            var indexOfSeparator = studentAnswers[j].answer.indexOf("-");
            var col = studentAnswers[j].answer.substring(0, 1);
            var row = studentAnswers[j].answer.substring(1, indexOfSeparator);
            var tocol = studentAnswers[j].answer.substring(indexOfSeparator + 1, indexOfSeparator + 2);
            var torow = studentAnswers[j].answer.substring(indexOfSeparator + 2);

            var colNum = get_line_col(col, tocol);
            var tocolNum = get_line_col(tocol, col);
            var pointA = document.getElementById(questionId + "_" + colNum + "_" + row);
            if (pointA != null) {
                pointA.checked = true;
                question_link_option(pointA, true);
            }
            var pointB = document.getElementById(questionId + "_" + tocolNum + "_" + torow);
            if (pointB != null) {
                pointB.checked = true;
                question_link_option(pointB, true, studentAnswers[j].correct);
            }
        }
    }
}


/**
 * 该需求是修改EBAG-21369问题单
 *  遍历学生的连线题答案(带有correct字段标识)，并开始画线
 * @param studentAnswers
 * @returns
 */
function answerLine(answerList, questionId) {
    var studentAnswers = answerList.split(",");
    hasPoint = 0;
    for (var j = 0; studentAnswers.length > j; j++) {
        if (studentAnswers[j].length >= 5) {
            var indexOfSeparator = studentAnswers[j].indexOf("-");
            var col = studentAnswers[j].substring(0, 1);
            var row = studentAnswers[j].substring(1, indexOfSeparator);
            var tocol = studentAnswers[j].substring(indexOfSeparator + 1, indexOfSeparator + 2);
            var torow = studentAnswers[j].substring(indexOfSeparator + 2);

            var colNum = get_line_col(col, tocol);
            var tocolNum = get_line_col(tocol, col);
            var pointA = document.getElementById(questionId + "_" + colNum + "_" + row);
            if (pointA != null) {
                pointA.checked = true;
                question_link_option(pointA, true);
            }

            var pointB = document.getElementById(questionId + "_" + tocolNum + "_" + torow);
            if (pointB != null) {
                pointB.checked = true;
                question_link_option(pointB, true);
            }
        }
    }
}


function cloneObj(obj) {
    var newObj = new Object();
    for (elements in obj) {
        newObj[elements] = obj[elements];
    }
    return newObj;
};

//列号转化
function get_line_col(col, tocol) {
    if (col == 'C' || tocol == 'C') {
        if (col == 'C') {
            return '5';
        } else if (col == 'B') {
            return '4';
        }
    } else {
        if (col == 'A') {
            return '1';
        } else if (col == 'B') {
            return '2';
        }
    }
}


function line(startX, startY, endX, endY, lineName, correct) {
    if (lineMap.get(lineName) != null) {
        removeLine(lineName);
    }

    if (startX > endX) {
        var tempX = startX;
        startX = endX;
        endX = tempX;

        var tempY = startY;
        startY = endY;
        endY = tempY;
    }


    var width = endX - startX;
    var height;

    if (startY > endY) {
        height = startY - endY;
        startY = startY - height;
    }
    else {
        height = endY - startY;
    }

    //修改EBAG-27726，两个点的y轴相差10以为认为是一条横线，设置stroke-width为4
    if (height < 10 && height > 0) {
        height = 0;
    }

    var canvas = Raphael(startX, startY, width, height == 0 ? 5 : height);

    var path;
    var strokeWidth = 2;
    //如果startY < endY
    if (startY < endY) {
        path = "M0 " + 0 + " L" + width + " " + height;
    }
    //如果startY == endY 或 startY > endY
    else {
        path = "M0 " + height + " L" + width + " " + 0;
    }
    // Creates canvas
    if (null != correct) {
        if (correct) {
            canvas.path(path).attr("stroke", "green").attr("stroke-width", height == 0 ? 4 : strokeWidth);
        }
        else {
            canvas.path(path).attr("stroke", "red").attr("stroke-width", height == 0 ? 4 : strokeWidth);
        }
    }
    else {
        canvas.path(path).attr("stroke", "#079DCF").attr("stroke-width", height == 0 ? 4 : strokeWidth);
    }
    lineMap.put(lineName, canvas);
}

//移除连线
function removeLine(elementName) {
    var canvas = lineMap.get(elementName);
    if (canvas != null) {
        lineMap.remove(elementName);
        canvas.remove();
    }
}


/**
 * 重绘连线题
 */
function rePaintLine() {

    oldScrollHeight = $(document).height();

    $.each(lineMap.elements, function (i, v) {
        v.value.remove();
    });
    lineMap = new Map();

    if (autoLineMap.elements.length > 0) {
        //重新初始化
        startPoint = {id: null, parentQuestionId: '0', parentTypeLevel: '0', typeLevel: '8', value: null, x: 0, y: 0};
        endPoint = {id: null, parentQuestionId: '0', parentTypeLevel: '0', typeLevel: '8', value: null, x: 0, y: 0};
        hasPoint = 0;
        currentId = '0';
        isLineOption = false;

        $.each(autoLineMap.elements, function (s, t) {
            auto_link_option(t.value, t.key);
        });
    }
}

/**
 * 检查窗口是否变化。如果变化，就重新连线
 */
function auto_print_line() {
    setTimeout(function () {
        //兼容多浏览器
        oldScrollHeight = $(document).height();

        $.each(autoLineMap.elements, function (s, t) {
            auto_link_option(t.value, t.key);
        });
        if ($("#orange_ErrDiv")) {
            $("#orange_ErrDiv").css("visibility", "visible");
        }

        //窗口调整大小需要重新绘制线条
        $(window).resize(function () {
            rePaintLine();
        });

        //定时器,如果网页高度变了需要重绘连线题
        setInterval(function () {
            //var scrollHeight = document.body.scrollHeight;
            var scrollHeight = $(document).height();
            if (oldScrollHeight != scrollHeight && Math.abs(scrollHeight - oldScrollHeight) > 5) {
                oldScrollHeight = scrollHeight;
                rePaintLine();
            }
        }, 100);

    }, 100);
}
