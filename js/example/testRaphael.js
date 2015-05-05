define('example/testRaphael',function(require) {

    var Raphael = require("lib/raphael/raphael");
    var paper = Raphael(10, 50, 320, 200);
    var c = paper.path("M10 10L90 90");
    c.attr("stroke", "#079DCF").attr("stroke-width", 2);

    var paper1 = Raphael(100, 100, 320, 200);
    var c1 = paper1.path("M0 0L90 1");
    c1.attr("stroke", "#079DCF").attr("stroke-width", 2);
});