define('example/testJwplayer',function(require) {
    var browser = require('module/core/browser');
    $("#version").text("浏览器版本为" + browser.version);

    jwplayer("container").setup({
        flashplayer: "../../js/lib/jwplayer/Player.swf",

        file: "/module/html/example/VIDEO0037.mp4",
        height: 270,
        width: 480
    });
});