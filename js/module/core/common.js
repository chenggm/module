define('module/core/common', function (require, exports, module) {

    var BASE_USER_LANGUAGE = "zh_cn"

    var _language = {};

    var languageUtil = {

        /**
         * 获取LangKey
         *
         * @param Object key
         * @returns Object
         */
        _parseLangKey: function (key) {
            var match, ns = 'core';
            if ((match = /^(\w+)\.(\w+)$/.exec(key))) {
                ns = match[1];
                key = match[2];
            }
            return { ns: ns, key: key };
        },

        /**
         * 检查是否为数组
         * @param Object val
         * @returns Boolean
         */
        _isArray: function (val) {
            if (!val) {
                return false;
            }
            return Object.prototype.toString.call(val) === '[object Array]';
        },

        /**
         * 遍历方法 return true 继续 return false 结束
         * @param Object obj
         * @param Function content
         * @returns void
         */
        _each: function (obj, fn) {
            if (languageUtil._isArray(obj)) {
                for (var i = 0, len = obj.length; i < len; i++) {
                    if (fn.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (fn.call(obj[key], key, obj[key]) === false) {
                            break;
                        }
                    }
                }
            }
        },
        /**
         * 格式化字符串
         * @param text
         * @param param
         * @returns
         */
        _formatStr: function (text, param) {
            if (languageUtil._isArray(param)) {
                for (var i in param) {
                    text = text.replace("{" + i + "}", param[i]);
                }
            } else {
                text = text.replace("{0}", param);
            }
            return text;
        },
        /**
         * 获取浏览器中 语言类型
         * @param mixed
         * @param langType
         * @returns
         */
        _lang: function (mixed, param, langType) {

            var langType = langType === undefined ? BASE_USER_LANGUAGE : langType;
            if (typeof mixed === 'string') {
                if (!_language[langType]) {
                    return 'no language[' + mixed + '][' + langType + ']';
                }
                var text;
                var pos = mixed.length - 1;
                if (mixed.substr(pos) === '.') {
                    text = _language[langType][mixed.substr(0, pos)];
                } else {
                    var obj = languageUtil._parseLangKey(mixed);

                    text = _language[langType][obj.ns][obj.key];
                }
                if (text && param != null) {
                    return languageUtil._formatStr(text, param);
                } else {
                    return text;
                }
            }
            languageUtil._each(mixed, function (key, val) {
                var obj = languageUtil._parseLangKey(key);
                if (!_language[langType]) {
                    _language[langType] = {};
                }
                if (!_language[langType][obj.ns]) {
                    _language[langType][obj.ns] = {};
                }
                _language[langType][obj.ns][obj.key] = val;
            });
        },
        getRootPath : function () {
            //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
            var curWwwPath = window.document.location.href;
            //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            //获取主机地址，如： http://localhost:8083
            var localhostPaht = curWwwPath.substring(0, pos);
            //获取带"/"的项目名，如：/uimcardprj
            var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            return(localhostPaht + projectName);
        }

    };

    module.exports = languageUtil;
});