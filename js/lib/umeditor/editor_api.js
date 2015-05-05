/**
 * 开发版本的文件导入
 */
(function (){
   function getRootPath(){
	        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	        var curWwwPath=window.document.location.href;
	        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	        var pathName=window.document.location.pathname;
	        var pos=curWwwPath.indexOf(pathName);
	        //获取主机地址，如： http://localhost:8083
	        var localhostPaht=curWwwPath.substring(0,pos);
	        //获取带"/"的项目名，如：/uimcardprj
	        var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	        return(localhostPaht+projectName);
	};
    /*var paths  = [
            'editor.js',
            'core/browser.js',
            'core/utils.js',
            'core/EventBase.js',
            'core/dtd.js',
            'core/domUtils.js',
            'core/Range.js',
            'core/Selection.js',
            'core/Editor.js',
            'core/filterword.js',
            'core/node.js',
            'core/htmlparser.js',
            'core/filternode.js',
            'plugins/inserthtml.js',
            'plugins/image.js',
            'plugins/justify.js',
            'plugins/font.js',
            'plugins/link.js',
            'plugins/print.js',
            'plugins/paragraph.js',
            'plugins/horizontal.js',
            'plugins/cleardoc.js',
            'plugins/undo.js',
            'plugins/paste.js',
            'plugins/list.js',
            'plugins/source.js',
            'plugins/enterkey.js',
            'plugins/preview.js',
            'plugins/basestyle.js',
            'plugins/video.js',
            'plugins/selectall.js',
            'plugins/removeformat.js',
            'plugins/keystrokes.js',
            'plugins/autosave.js',
            'plugins/autoupload.js',
            'plugins/formula.js',
            'plugins/table.js',
            'plugins/blank.js',
            'ui/widget.js',
            'ui/button.js',
            'ui/toolbar.js',
            'ui/menu.js',
            'ui/dropmenu.js',
            'ui/splitbutton.js',
            'ui/colorsplitbutton.js',
            'ui/popup.js',
            'ui/scale.js',
            'ui/colorpicker.js',
            'ui/combobox.js',
            'ui/buttoncombobox.js',
            'ui/modal.js',
            'ui/tooltip.js',
            'ui/tab.js',
            'ui/separator.js',
            'ui/scale.js',
             'ui/tableselector.js',
            'adapter/adapter.js',
            'adapter/button.js',
            'adapter/fullscreen.js',
            'adapter/dialog.js',
            'adapter/popup.js',
            'adapter/imagescale.js',
            'adapter/autofloat.js',
            'adapter/source.js',
            'adapter/combobox.js',
            'adapter/table.js'
        ],*/
    var rootURL = getRootPath(),
    baseURL = rootURL + '/js/umeditor/js/';
    document.write('<link href="'+ rootURL +'/js/lib/umeditor/themes/default/_css/umeditor.css" type="text/css" rel="stylesheet">');
    document.write('<script type="text/javascript" charset="utf-8" src="'+ rootURL +'/js/lib/umeditor/umeditor.config.js"></script>');
    document.write('<script type="text/javascript" charset="utf-8" src="'+ rootURL +'/js/lib/umeditor/umeditor.min.js"></script>');
    /*for (var i=0,pi;pi = paths[i++];) {
        document.write('<script type="text/javascript" src="'+ baseURL + pi +'"></script>');
    };*/
    document.write('<script type="text/javascript" src="'+ rootURL +'/js/lib/umeditor/lang/zh-cn/zh-cn.js"></script>');


})();
