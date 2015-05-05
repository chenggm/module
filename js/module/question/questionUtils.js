define('module/question/questionUtils',function(require, exports, module) {
    (function () {
        var nq = require("module/question/newQuestion");
        var questionUtils = function () {
            this.newQuestionUtil = null;
        }

        //public API
        questionUtils.prototype = {
            //新建试题
            newQuestion: function (type, questionArea) {
                if (this.newQuestionUtil == null) {
                    this.newQuestionUtil = nq;
                }
                var regExp = /1|2/;
                var values = null;
                if (regExp.test(type) && regExp.test(this.newQuestionUtil.type)
                    && type != this.newQuestionUtil.type) {
                    values = {};
                    values.type = parseInt($('input[name="selectType0"]:checked').val());
                    var content = [];
                    $("#options0 > ul > li").each(function (i, n) {
                        content.push($($(this).find("div")[0]).html());
                    });
                    values.content = content;
                }
                //this.newQuestionUtil.reset();
                this.newQuestionUtil.generate(type, questionArea, values);
            }
        }
        window.questionUtils = new questionUtils();

        module.exports = questionUtils;
    })();

});


