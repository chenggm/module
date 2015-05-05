/**
 * 创建按钮
 */

UM.registerUI('table', function( name ){
    var me = this,
    $tableWidget = null,
    $btn = null;
    var xCount = 0;
    var yCount = 0;
    //在这里处理保存按钮的状态反射
    me.addListener( "selectionchange", function () {

       $(".tw_table_item").each(function(i, em){

            $(this).css("background-color", "#F8F8F8");
       });
       $(".tw_tb_text_show_div").html("");
        $tableWidget.edui().hide();
        //检查当前的编辑器状态是否可以使用save命令
        var state = this.queryCommandState( name );

        //如果状态表示是不可用的( queryCommandState()的返回值为-1 )， 则要禁用该按钮
        $btn.edui().disabled( state == -1 ).active( state == 1 );
    } );


    $btn = $.eduibutton({
        //按钮icon的名字， 在这里会生成一个“edui-icon-save”的className的icon box，
        //用户可以重写该className的background样式来更改icon的图标
        //覆盖示例见btn.css
        'icon': 'table',
        'title': me.options.lang === "zh-cn" ? "插入表格" : "insert table",
        'click': function(em){
            //在这里处理按钮的点击事件
            //点击之后执行save命令
//            $tableWidget.edui().show();
        }
    });

    $tableWidget = $.eduitableselector({
        name: name
    }).on('clicktable', function( evt){
            window.setTimeout( function(){
                me.execCommand( name ,{numCols:xCount,numRows:yCount});
            	$(".tw_table_item").each(function(i, em){

                    $(this).css("background-color", "#F8F8F8");
	   	        });
	   	        $(".tw_tb_text_show_div").html("");
                $tableWidget.edui().hide();
            }, 0 );
        })
        .on('mousemove',function(e){
            var d = $(".tw_table_item").offset().left;
            var xPoint = e.originalEvent.pageX;
            var yPoint = e.originalEvent.pageY;
            var itemX = 0;
            var itemY = 0;
            xCount = 0;
            yCount = 0;

            $(".tw_table_item").each(function(i, em){
                itemX = $(this).offset().left;
                itemY = $(this).offset().top;
                if(xPoint >=  itemX && yPoint >= itemY){
                    if(parseInt($(this).attr("xp"), 10) > xCount){
                        xCount = $(this).attr("xp");
                        xCount = parseInt($(this).attr("xp"), 10);
                    }
                    if(parseInt($(this).attr("yp"), 10) > yCount){
                        yCount = parseInt($(this).attr("yp"), 10);
                    }
                    $(this).css("background-color", "#DDEAFB");
                }else{
                    $(this).css("background-color", "#F8F8F8");
                }

                $(".tw_tb_text_show_div").html(xCount + "行," + yCount + "列");
            });
        }).on('blur',function(){
        	$(".tw_table_item").each(function(i, em){

                 $(this).css("background-color", "#F8F8F8");
	        });
	        $(".tw_tb_text_show_div").html("");
            $tableWidget.edui().hide();
        }).css('zIndex',me.getOpt('zIndex') + 1);


    $btn.edui().on('click',function(){
        if(!$tableWidget.parent().length){
            me.$container.find('.edui-dialog-container').append($tableWidget);
        }
        $tableWidget.edui().show($btn);
        UM.setTopEditor(me);
    });
    //返回该按钮对象后， 该按钮将会被附加到工具栏上
    return $btn;

});






