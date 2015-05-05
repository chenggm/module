/**
 * @file
 * @short eventBase
 * @import core/utils.js
 * @desc 事件基类，继承此类的对应类将获取addListener,removeListener,fireEvent方法。
 */
define('module/core/EventBase',function(require, exports, module) {
    var utils = require("utils");

    var EventBase =  function () {
    };
    EventBase.prototype = {
        /**
         * 注册事件监听器
         * @name addListener
         * @grammar addListener(types,fn)  //types为事件名称，多个可用空格分隔
         * @example
         * addListener('selectionchange',function(){
         *      console.log("选区已经变化！");
         * })
         * addListener('beforegetcontent aftergetcontent',function(type){
         *         if(type == 'beforegetcontent'){
         *             //do something
         *         }else{
         *             //do something
         *         }
         *         console.log(this.getContent) // this是注册的事件的编辑器实例
         * })
         */
        addListener: function (types, listener) {
            types = utils.trim(types).split(' ');
            for (var i = 0, ti; ti = types[i++];) {
                getListener(this, ti, true).push(listener);
            }
        },
        /**
         * 移除事件监听器
         * @name removeListener
         * @grammar removeListener(types,fn)  //types为事件名称，多个可用空格分隔
         * @example
         * //changeCallback为方法体
         * removeListener("selectionchange",changeCallback);
         */
        removeListener: function (types, listener) {
            types = utils.trim(types).split(' ');
            for (var i = 0, ti; ti = types[i++];) {
                utils.removeItem(getListener(this, ti) || [], listener);
            }
        },
        /**
         * 触发事件
         * @name fireEvent
         * @grammar fireEvent(types)  //types为事件名称，多个可用空格分隔
         * @example
         * fireEvent("selectionchange");
         */
        fireEvent: function () {
            var types = arguments[0];
            types = utils.trim(types).split(' ');
            for (var i = 0, ti; ti = types[i++];) {
                var listeners = getListener(this, ti),
                    r, t, k;
                if (listeners) {
                    k = listeners.length;
                    while (k--) {
                        if (!listeners[k])continue;
                        t = listeners[k].apply(this, arguments);
                        if (t === true) {
                            return t;
                        }
                        if (t !== undefined) {
                            r = t;
                        }
                    }
                }
                if (t = this['on' + ti.toLowerCase()]) {
                    r = t.apply(this, arguments);
                }
            }
            return r;
        }
    };
    /**
     * 获得对象所拥有监听类型的所有监听器
     * @public
     * @function
     * @param {Object} obj  查询监听器的对象
     * @param {String} type 事件类型
     * @param {Boolean} force  为true且当前所有type类型的侦听器不存在时，创建一个空监听器数组
     * @returns {Array} 监听器数组
     */
    function getListener(obj, type, force) {
        var allListeners;
        type = type.toLowerCase();
        return ( ( allListeners = ( obj.__allListeners || force && ( obj.__allListeners = {} ) ) )
            && ( allListeners[type] || force && ( allListeners[type] = [] ) ) );
    }

    module.exports = EventBase;
});

