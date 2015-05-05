define('example/testDatepicker',function(require) {
    $("#finishTime").datetimepicker({
        showSecond: true, //显示秒
        showButtonPanel:true,
        dateFormat: "yy-mm-dd",
        timeFormat: "HH:mm:ss",//格式化时间
        stepHour: 1,//设置步长
        stepMinute: 5,
        stepSecond: 5,
        closeText:'关闭',
        hourText: '时',
        minuteText: '分',
        secondText: '秒',
        onClose: function(dateText, inst) {



        }

    });
});