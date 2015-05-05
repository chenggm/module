define('example/testMap',function(require) {
   var map = require("module/core/MapUtil");
   var abc = new map.Map();
    abc.put("1","2");
    alert(abc.get("1"));
});