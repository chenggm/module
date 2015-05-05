define('example/testQuestion',function(require) {
    questionUtils.newQuestion(1,$("#ArticleBox"));
    $('input[name="questionType"]').click(function(){
        var val = parseInt($(this).val());
        questionUtils.newQuestion(val,$("#ArticleBox"));
    });
});