(function(){function at(){return"tinymce";}function g(aR){return O()!="3"&&aR.inline;}function E(aR){return aR.id.replace(/\[/,"_").replace(/\]/,"_");}function i(aS){if(O()=="3"||!g(aS)){return aS.getContainer();}var aR=window.document.getElementById(aS.theme.panel._id);return aR;}function c(aR){return aR.getDoc();}function P(aR){return aR.getContent();}function S(aS,aR){aS.setContent(aR);}function ab(aR){if(tinymce.activeEditor==null||tinymce.activeEditor.selection==null){return null;}return tinymce.activeEditor.selection.getNode();}function X(){return tinymce.baseURL;}function aI(){return h("jsplus_bootstrap_button");}function h(aW){for(var aU=0;aU<tinymce.editors.length;aU++){var aV=tinymce.editors[aU];var aT=W(aV,"external_plugins");if(typeof aT!="undefined"&&typeof aT[aW]!="undefined"){var aS=aT[aW].replace("\\","/");var aR=aS.lastIndexOf("/");if(aR==-1){aS="";}else{aS=aS.substr(0,aR)+"/";}return aS;}}return X()+"/plugins/"+aW+"/";}function O(){return tinymce.majorVersion=="4"?4:3;}function I(){return tinymce.minorVersion;}function v(aS,aR){return window["jsplus_bootstrap_button_i18n"][aR];}function Z(aS,aR){return W(aS,"jsplus_bootstrap_button_"+aR);}var ah={};function W(aS,aR){if(typeof(ah[aR])!="undefined"){return aS.getParam(aR,ah[aR]);}else{return aS.getParam(aR);}}function u(aR,aS){aa("jsplus_bootstrap_button_"+aR,aS);}function aa(aR,aS){ah[aR]=aS;}function aD(aS,aR){if(O()==4){aS.insertContent(aR);}else{aS.execCommand("mceInsertContent",false,aR);}}function s(){return"";}var F={};var aH=0;function aL(aT,aR){var aS=E(aT)+"$"+aR;if(aS in F){return F[aS];}return null;}function R(aU,bc,bb,a2,aY,a5,ba,aZ,aW,aT,a8){var a9=E(aU)+"$"+bc;if(a9 in F){return F[a9];}aH++;var a3="";var a0={};for(var a4=a5.length-1;a4>=0;a4--){var aR=a5[a4];var aX=E(aU)+"_jsplus_bootstrap_button_"+aH+"_"+a4;var aV=null;if(aR.type=="ok"){aV=-1;}else{if(aR.type=="cancel"){aV=-2;}else{if(aR.type=="custom"&&typeof(aR.onclick)!="undefined"&&aR.onclick!=null){aV=aR.onclick;}}}a0[aX]=aV;if(O()==3){var a6="border: 1px solid #b1b1b1;"+"border-color: rgba(0,0,0,.1) rgba(0,0,0,.1) rgba(0,0,0,.25) rgba(0,0,0,.25);position: relative;"+"text-shadow: 0 1px 1px rgba(255,255,255,.75);"+"display: inline-block;"+"-webkit-border-radius: 3px;"+"-moz-border-radius: 3px;"+"border-radius: 3px;"+"-webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,.2),0 1px 2px rgba(0,0,0,.05);"+"-moz-box-shadow: inset 0 1px 0 rgba(255,255,255,.2),0 1px 2px rgba(0,0,0,.05);"+"box-shadow: inset 0 1px 0 rgba(255,255,255,.2),0 1px 2px rgba(0,0,0,.05);"+"background-color: #f0f0f0;"+"background-image: -moz-linear-gradient(top,#fff,#d9d9d9);"+"background-image: -webkit-gradient(linear,0 0,0 100%,from(#fff),to(#d9d9d9));"+"background-image: -webkit-linear-gradient(top,#fff,#d9d9d9);"+"background-image: -o-linear-gradient(top,#fff,#d9d9d9);"+"background-image: linear-gradient(to bottom,#fff,#d9d9d9);"+"background-repeat: repeat-x;"+"filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffd9d9d9', GradientType=0);";if(aR.type=="ok"){a6="text-shadow: 0 1px 1px rgba(255,255,255,.75);"+"display: inline-block;"+"-webkit-border-radius: 3px;"+"-moz-border-radius: 3px;"+"border-radius: 3px;"+"-webkit-box-shadow: inset 0 1px 0 rgba(255,255,255,.2),0 1px 2px rgba(0,0,0,.05);"+"-moz-box-shadow: inset 0 1px 0 rgba(255,255,255,.2),0 1px 2px rgba(0,0,0,.05);"+"box-shadow: inset 0 1px 0 rgba(255,255,255,.2),0 1px 2px rgba(0,0,0,.05);"+"min-width: 50px;"+"color: #fff;"+"border: 1px solid #b1b1b1;"+"border-color: rgba(0,0,0,.1) rgba(0,0,0,.1) rgba(0,0,0,.25) rgba(0,0,0,.25);"+"background-color: #006dcc;"+"background-image: -moz-linear-gradient(top,#08c,#04c);"+"background-image: -webkit-gradient(linear,0 0,0 100%,from(#08c),to(#04c));"+"background-image: -webkit-linear-gradient(top,#08c,#04c);"+"background-image: -o-linear-gradient(top,#08c,#04c);"+"background-image: linear-gradient(to bottom,#08c,#04c);"+"background-repeat: repeat-x;"+"filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff0088cc', endColorstr='#ff0044cc', GradientType=0);";}styleBtn="-moz-box-sizing: border-box;"+"-webkit-box-sizing: border-box;"+"box-sizing: border-box;"+"padding: 4px 10px;"+"font-size: 14px;"+"line-height: 20px;"+"cursor: pointer;"+"text-align: center;"+"overflow: visible;"+"-webkit-appearance: none;"+"background: none;"+"border: none;";if(aR.type=="ok"){styleBtn+="color: #fff;text-shadow: 1px 1px #333;";}a3+='<div tabindex="-1" style="'+a6+"position:relative;float:right;top: 10px;height: 28px;margin-right:15px;text-align:center;"+'">'+'<button id="'+aX+'" type="button" tabindex="-1" style="'+styleBtn+"height:100%"+'">'+al(aR.title)+"</button>"+"</div>";}else{a3+='<div class="mce-widget mce-btn '+(aR.type=="ok"?"mce-primary":"")+' mce-abs-layout-item" tabindex="-1" style="position:relative;float:right;top: 10px;height: 28px;margin-right:15px;text-align:center">'+'<button id="'+aX+'" type="button" tabindex="-1" style="height: 100%;">'+al(aR.title)+"</button>"+"</div>";
}}if(O()==3){var a1='<div style="display: none; position: fixed; height: 100%; width: 100%;top:0;left:0;z-index:19000" data-popup-id="'+a9+'">'+'<div style="position: absolute; height: 100%; width: 100%;top:0;left:0;background-color: gray;opacity: 0.3;z-index:-1"></div>'+'<div class="mce_dlg_jsplus_bootstrap_button" style="display: table-cell; vertical-align: middle;z-index:19005">'+'<div class="" '+'style="'+"border-width: 1px; margin-left: auto; margin-right: auto; width: "+a2+"px;"+"-webkit-border-radius: 6px;-moz-border-radius: 6px;border-radius: 6px;-webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);-moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);"+"box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);background: transparent;background: #fff;"+"-webkit-transition: opacity 150ms ease-in;transition: opacity 150ms ease-in;"+"border: 0 solid #9e9e9e;background-repeat:repeat-x"+'">'+'<div style="padding: 9px 15px;border-bottom: 1px solid #c5c5c5;position: relative;">'+'<div style="line-height: 20px;font-size: 20px;font-weight: 700;text-rendering: optimizelegibility;padding-right: 10px;">'+al(bb)+"</div>"+'<button style="position: absolute;right: 15px;top: 9px;font-size: 20px;font-weight: 700;line-height: 20px;color: #858585;cursor: pointer;height: 20px;overflow: hidden;background: none;border: none;padding-top: 0 !important; padding-right: 0 !important;padding-left: 0 !important" type="button" id="'+E(aU)+"_jsplus_bootstrap_button_"+aH+'_close">×</button>'+"</div>"+'<div style="overflow:hidden">'+aY+'<div hidefocus="1" tabindex="-1" '+'style="border-width: 1px 0px 0px; left: 0px; top: 0px; height: 50px;'+"display: block;background-color: #fff;border-top: 1px solid #c5c5c5;-webkit-border-radius: 0 0 6px 6px;-moz-border-radius: 0 0 6px 6px;border-radius: 0 0 6px 6px;"+"border: 0 solid #9e9e9e;background-color: #f0f0f0;background-image: -moz-linear-gradient(top,#fdfdfd,#ddd);background-image: -webkit-gradient(linear,0 0,0 100%,from(#fdfdfd),to(#ddd));"+"background-image: -webkit-linear-gradient(top,#fdfdfd,#ddd);background-image: -o-linear-gradient(top,#fdfdfd,#ddd);"+"background-image: linear-gradient(to bottom,#fdfdfd,#ddd);background-repeat: repeat-x;"+'">'+'<div class="mce-container-body mce-abs-layout" style="height: 50px;">'+'<div class="mce-abs-end"></div>'+a3+"</div>"+"</div>"+"</div>"+"</div>"+"</div>"+"</div>";}else{var a1='<div style="display: none; font-family:Arial; position: fixed; height: 100%; width: 100%;top:0;left:0;z-index:19000" data-popup-id="'+a9+'">'+'<div style="position: absolute; height: 100%; width: 100%;top:0;left:0;background-color: gray;opacity: 0.3;z-index:-1"></div>'+'<div class="mce_dlg_jsplus_bootstrap_button" style="display: table-cell; vertical-align: middle;z-index:19005">'+'<div class="" '+'style="'+"border-width: 1px; margin-left: auto; margin-right: auto; width: "+a2+"px;"+"-webkit-border-radius: 6px;-moz-border-radius: 6px;border-radius: 6px;-webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);-moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);"+"box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);background: transparent;background: #fff;"+"-webkit-transition: opacity 150ms ease-in;transition: opacity 150ms ease-in;"+"border: 0 solid #9e9e9e;background-repeat:repeat-x"+'">'+'<div  class="mce-window-head">'+'<div class="mce-title">'+al(bb)+"</div>"+'<button class="mce-close" type="button" id="'+E(aU)+"_jsplus_bootstrap_button_"+aH+'_close" style="background:none;border:none">×</button>'+"</div>"+'<div class="mce-container-body mce-abs-layout">'+aY+'<div class="mce-container mce-panel mce-foot" hidefocus="1" tabindex="-1" style="border-width: 1px 0px 0px; left: 0px; top: 0px; height: 50px;">'+'<div class="mce-container-body mce-abs-layout" style="height: 50px;">'+'<div class="mce-abs-end"></div>'+a3+"</div>"+"</div>"+"</div>"+"</div>"+"</div>";}var aS=aq(a1)[0];var a7={$:aS,appendedToDOM:false,num:aH,editor:aU,open:function(){if(!this.appendedToDOM){this.editor.getElement().parentNode.appendChild(this.$);var bf=this;for(var bg in a0){var bd=a0[bg];if(bd!=null){var be=document.getElementById(bg);if(bd===-1){be.onclick=function(){bf.ok();};}else{if(bd===-2){be.onclick=function(){bf.cancel();};}else{be.onclick=function(){bd();};}}}}document.getElementById(E(this.editor)+"_jsplus_bootstrap_button_"+this.num+"_close").onclick=function(){bf.cancel();};this.appendedToDOM=true;if(a8!=null){a8(this.editor);}}if(aW!=null){aW(this.editor);}this.$.style.display="table";},close:function(){this.$.style.display="none";if(aT!=null){aT(this.editor);}},ok:function(){if(ba!=null){if(ba(this.editor)===false){return;}}a7.close();},cancel:function(){if(aZ!=null){if(aZ(this.editor)===false){return;}}this.close();}};F[a9]=a7;return a7;}var e={};var au=0;function ac(aS){var aR=E(aS);if(aR in e){return e[aR];}return null;}function aO(aY,aS,aW,aU,a0,aZ){var a1=E(aY);if(a1 in e){return e[a1];}au++;var aV="";
if(O()==3){aV="<div"+' style="margin-left:-11px;background: #FFF;border: 1px solid gray;z-index: 165535;padding:8px 12px 8px 8px;position:absolute'+(aS!=null?(";width:"+aS+"px"):"")+'">'+aW+"</div>";}else{aV="<div"+' class="mce-container mce-panel mce-floatpanel mce-popover mce-bottom mce-start"'+' style="z-index: 165535;padding:8px 12px 8px 8px'+(aS!=null?(";width:"+aS+"px"):"")+'">'+'<div class="mce-arrow" hidefocus="1" tabindex="-1" role="dialog"></div>'+aW+"</div>";}var aX='<div style="z-index:165534;position:absolute;left:0;top:0;width:100%;height:100%;display:none" data-popup-id="'+a1+'">'+aV+"</div>";var aT=aq(aX)[0];var aR={$_root:aT,$_popup:aT.children[0],num:au,appendedToDOM:false,editor:aY,open:function(){if(!this.appendedToDOM){this.$_root.onclick=(function(){return function(bc){e[this.getAttribute("data-popup-id")].close();bc.stopPropagation();};})();this.$_popup.onclick=function(bc){bc.stopPropagation();};i(this.editor).appendChild(this.$_root);var a8=this;this.appendedToDOM=true;if(aZ!=null){aZ(this.editor);}}if(aU!=null){aU(this.editor);}var a6=i(this.editor);var bb=a6.getElementsByClassName("mce_jsplus_bootstrap_button");if(bb.length==0){bb=a6.getElementsByClassName("mce-jsplus_bootstrap_button");}if(bb.length==0){console.log("Unable to find button with class 'mce_jsplus_bootstrap_button' or 'mce-jsplus_bootstrap_button' for editor "+E(this.editor));}else{var a2=bb[0];var ba=a2.getBoundingClientRect();var a9=function(bd,bc){var bf=0,be=0;do{bf+=bd.offsetTop||0;be+=bd.offsetLeft||0;bd=bd.offsetParent;}while(bd&&bd!=bc);return{top:bf,left:be};};var a3=i(this.editor);var a4=a9(a2,a3);this.$_popup.style.top=(a4.top+a2.offsetHeight)+"px";this.$_popup.style.left=(a4.left+a2.offsetWidth/2)+"px";this.$_popup.style.display="block";var a7=document.body;var a5=document.documentElement;this.$_root.style.height=Math.max(a7.scrollHeight,a7.offsetHeight,a5.clientHeight,a5.scrollHeight,a5.offsetHeight);this.$_root.style.display="block";}},close:function(){this.$_popup.style.display="none";this.$_root.style.display="none";if(a0!=null){a0(this.editor);}}};e[a1]=aR;return aR;}var p={};function Y(aV,a1,aY,aZ,aW,aX,a0){var aT=(function(){var a2=aV;return function(a3){aX(a2);};})();var aU=aV;var aS=function(a2,a3){if(!(E(a2) in p)){p[E(a2)]={};}p[E(a2)][a1]=a3;if(aW){tinymce.DOM.remove(a3.getEl("preview"));}if(aX!=null){a3.on("click",aT);}if(a0){a0(a2);}};var aR={text:"",type:"button",icon:true,classes:"widget btn jsplus_bootstrap_button btn-jsplus_bootstrap_button-"+E(aV),image:aY,label:aZ,tooltip:aZ,title:aZ,id:"btn-"+a1+"-"+E(aV),onclick:aT,onPostRender:function(){aS(aU,this);}};if(aW){aR.type=O()=="3"?"ColorSplitButton":"colorbutton";aR.color="#FFFFFF";aR.panel={};}if(O()=="3"&&aW){(function(){var a2=false;aV.onNodeChange.add(function(a9,a4,a5){if(a2){return;}a2=true;var a7=i(a9);var a8=a7.getElementsByClassName("mce_"+a1);if(a8.length>0){var a3=a8[0];var ba=a3.parentNode;var a6=ba.nextSibling;var bc=aq('<div id="content_forecolor" role="button" tabindex="-1" aria-labelledby="content_forecolor_voice" aria-haspopup="true">'+'<table role="presentation" class="mceSplitButton mceSplitButtonEnabled mce_forecolor" cellpadding="0" cellspacing="0" title="Select Text Color">'+"<tbody>"+"<tr>"+'<td class="mceFirst">'+"</td>"+'<td class="mceLast">'+'<a role="button" style="width:10px" tabindex="-1" href="javascript:;" class="mceOpen mce_forecolor" onclick="return false;" onmousedown="return false;" title="Select Text Color">'+'<span class="mceOpen mce_forecolor">'+'<span style="display:none;" class="mceIconOnly" aria-hidden="true">▼</span>'+"</span>"+"</a>"+"</td>"+"</tr>"+"</tbody>"+"</table>"+"</div>")[0];var bb=bc.getElementsByClassName("mceFirst")[0];ba.appendChild(bc);bb.appendChild(a3);a3.style.marginRight="-1px";a3.className=a3.className+" mceAction mce_forecolor";bc.getElementsByClassName("mceOpen")[0].onclick=aT;}});})();}aV.addButton(a1,aR);}var T=0;var H=1;var N=2;function q(aS,aU,aT){if(aT!=T&&aT!=H&&aT!=N){return;}if(O()==3){aS.controlManager.setDisabled(aU,aT==T);aS.controlManager.setActive(aU,aT==N);}else{if((E(aS) in p)&&(aU in p[E(aS)])){var aR=p[E(aS)][aU];aR.disabled(aT==T);aR.active(aT==N);}}}function Q(aR,aS){if(O==3){aR.onNodeChange.add(function(aU,aT,aV){aS(aU);});}else{aR.on("NodeChange",function(aT){aS(aT.target);});}}function G(aS,aR,aT){if(aR=="mode"){return;}if(aR=="beforeGetOutputHTML"){aS.on("SaveContent",function(aU){aU.content=aT(aS,aU.content);});return;}if(aR=="contentDom"){if(O()==4){aS.on("init",function(aU){aT(aS);});}else{aS.onInit.add(function(aU){aT(aU);});}return;}if(aR=="elementsPathUpdate"){return;}if(aR=="selectionChange"){if(O==3){aS.onNodeChange.add(function(aV,aU,aW){aT(aV);});}else{aS.on("NodeChange",function(aU){aT(aU.target);});}}if(aR=="keyDown"){aS.on("keydown",(function(){var aV=aS;var aU=aT;return function(aW){aU(aV,aW.keyCode,aW);};})());}}function M(aR){aR.preventDefault();}function w(aU,a0,aW,aT,aX,aR,aS){var aY=v(aU,aT.replace(/^jsplus_/,"").replace(/^jsplus_/,""));
var aZ="";if(aS&&aS!=null&&W(aU,aS)===true){aZ+="_bw";}var aV=aI()+"mce_icons/"+aW+s()+aZ+".png";Y(aU,a0,aV,aY,false,aX);if(aR&&O()>3){aU.addMenuItem(a0,{text:aY,context:aR,icon:true,image:aV});}}function r(aR){return true;}function an(aS,aR,aT){if(aR!=null&&aR!=""){tinymce.PluginManager.requireLangPack(aS);}tinymce.PluginManager.add(aS,function(aV,aU){aT(aV);});}function d(){var aR='<button type="button" class="jsdialog_x mce-close"><i class="mce-ico mce-i-remove"></i></button>';if(I().indexOf("0.")===0||I().indexOf("1.")===0||I().indexOf("2.")===0){aR='<button type="button" class="jsdialog_x mce-close">×</button>';}JSDialog.Config.skin=null;JSDialog.Config.templateDialog='<div class="jsdialog_plugin_jsplus_bootstrap_button jsdialog_dlg mce-container mce-panel mce-floatpanel mce-window mce-in" hidefocus="1">'+'<div class="mce-reset">'+'<div class="jsdialog_title mce-window-head">'+'<div class="jsdialog_title_text mce-title"></div>'+aR+"</div>"+'<div class="jsdialog_content_wrap mce-container-body mce-window-body">'+'<div class="mce-container mce-form mce-first mce-last">'+'<div class="jsdialog_content mce-container-body">'+"</div>"+"</div>"+"</div>"+'<div class="mce-container mce-panel mce-foot" hidefocus="1">'+'<div class="jsdialog_buttons mce-container-body">'+"</div>"+"</div>"+"</div>"+"</div>";JSDialog.Config.templateButton=(I().indexOf("0.")===0||I().indexOf("1.")===0||I().indexOf("2.")===0)?'<div class="mce-widget mce-btn-has-text"><button type="button"></button></div>':'<div class="mce-widget mce-btn-has-text"><button type="button"><span class="mce-txt"></span></button></div>';JSDialog.Config.templateBg='<div class="jsdialog_plugin_jsplus_bootstrap_button jsdialog_bg"></div>';JSDialog.Config.classButton="mce-btn";JSDialog.Config.classButtonOk="mce-primary";JSDialog.Config.contentBorders=[3,1,15,1,73];y(document,".jsdialog_plugin_jsplus_bootstrap_button.jsdialog_bg { background-color: black; opacity: 0.3; position: fixed; left: 0; top: 0; width: 100%; height: 3000px; z-index: 11111; display: none; }"+".jsdialog_plugin_jsplus_bootstrap_button.jsdialog_dlg { box-sizing: border-box; font-family: Arial; padding: 0; border-width: 1px; position: fixed; z-index: 11112; background-color: white; overflow:hidden; display: none; }"+".jsdialog_plugin_jsplus_bootstrap_button.jsdialog_show { display: block; }"+".jsdialog_plugin_jsplus_bootstrap_button .mce-foot { height: 50px; }"+".jsdialog_plugin_jsplus_bootstrap_button .mce-foot .jsdialog_buttons { padding: 10px; }"+".jsdialog_plugin_jsplus_bootstrap_button .mce-btn-has-text { float: right; margin-left: 5px; text-align: center; }"+".jsdialog_plugin_jsplus_bootstrap_button .jsdialog_message_contents { font-size: 16px; padding: 10px 0 10px 7px; display: table; overflow: hidden; }"+".jsdialog_plugin_jsplus_bootstrap_button .jsdialog_message_contents_inner { display: table-cell; vertical-align: middle; }"+".jsdialog_plugin_jsplus_bootstrap_button .jsdialog_message_icon { padding-left: 100px; min-height: 64px; background-position: 10px 10px; background-repeat: no-repeat; box-sizing: content-box; }"+".jsdialog_plugin_jsplus_bootstrap_button .jsdialog_message_icon_info { background-image: url(info.png); }"+".jsdialog_plugin_jsplus_bootstrap_button .jsdialog_message_icon_warning { background-image: url(warning.png); }"+".jsdialog_plugin_jsplus_bootstrap_button .jsdialog_message_icon_error { background-image: url(error.png); }"+".jsdialog_plugin_jsplus_bootstrap_button .jsdialog_message_icon_confirm { background-image: url(confirm.png); }");}function J(aR,aV,aT){if(typeof aV=="undefined"){aV=true;}if(typeof aT=="undefined"){aT=" ";}if(typeof(aR)=="undefined"){return"";}var aW=1000;if(aR<aW){return aR+aT+(aV?"b":"");}var aS=["K","M","G","T","P","E","Z","Y"];var aU=-1;do{aR/=aW;++aU;}while(aR>=aW);return aR.toFixed(1)+aT+aS[aU]+(aV?"b":"");}function al(aR){return aR.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}function aF(aR){return aR.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");}function aq(aR){var aS=document.createElement("div");aS.innerHTML=aR;return aS.childNodes;}function aC(aR){return aR.getElementsByTagName("head")[0];}function ax(aR){return aR.getElementsByTagName("body")[0];}function aK(aT,aV){var aR=aT.getElementsByTagName("link");var aU=false;for(var aS=aR.length-1;aS>=0;aS--){if(aR[aS].href==aV){aR[aS].parentNode.removeChild(aR[aS]);}}}function ag(aU,aW){if(!aU){return;}var aR=aU.getElementsByTagName("link");var aV=false;for(var aS=0;aS<aR.length;aS++){if(aR[aS].href.indexOf(aW)!=-1){aV=true;}}if(!aV){var aT=aU.createElement("link");aT.href=aW;aT.type="text/css";aT.rel="stylesheet";aC(aU).appendChild(aT);}}function k(aU,aW){if(!aU){return;}var aR=aU.getElementsByTagName("script");var aV=false;for(var aT=0;aT<aR.length;aT++){if(aR[aT].src.indexOf(aW)!=-1){aV=true;}}if(!aV){var aS=aU.createElement("script");aS.src=aW;aS.type="text/javascript";aC(aU).appendChild(aS);}}function aM(aR,aT,aS){ag(c(aR),aT);
if(document!=c(aR)&&aS){ag(document,aT);}}function am(aR,aT,aS){k(c(aR),aT);if(document!=c(aR)&&aS){k(document,aT);}}function av(aS,aR){var aT=c(aS);y(aT,aR);}function y(aT,aR){var aS=aT.createElement("style");aC(aT).appendChild(aS);aS.innerHTML=aR;}function aE(aS,aR){if(aQ(aS,aR)){return;}aS.className=aS.className.length==0?aR:aS.className+" "+aR;}function aJ(aT,aR){var aS=a(aT);while(aS.indexOf(aR)>-1){aS.splice(aS.indexOf(aR),1);}var aU=aS.join(" ").trim();if(aU.length>0){aT.className=aU;}else{if(aT.hasAttribute("class")){aT.removeAttribute("class");}}}function a(aR){if(typeof(aR.className)==="undefined"||aR.className==null){return[];}return aR.className.split(/\s+/);}function aQ(aU,aR){var aT=a(aU);for(var aS=0;aS<aT.length;aS++){if(aT[aS].toLowerCase()==aR.toLowerCase()){return true;}}return false;}function aN(aT,aU){var aS=a(aT);for(var aR=0;aR<aS.length;aR++){if(aS[aR].indexOf(aU)===0){return true;}}return false;}function ad(aT){if(typeof(aT.getAttribute("style"))==="undefined"||aT.getAttribute("style")==null||aT.getAttribute("style").trim().length==0){return{};}var aV={};var aU=aT.getAttribute("style").split(/;/);for(var aS=0;aS<aU.length;aS++){var aW=aU[aS].trim();var aR=aW.indexOf(":");if(aR>-1){aV[aW.substr(0,aR).trim()]=aW.substr(aR+1);}else{aV[aW]="";}}return aV;}function ap(aT,aS){var aU=ad(aT);for(var aR in aU){var aV=aU[aR];if(aR==aS){return aV;}}return null;}function ai(aU,aT,aR){var aV=ad(aU);for(var aS in aV){var aW=aV[aS];if(aS==aT&&aW==aR){return true;}}return false;}function D(aT,aS,aR){var aU=ad(aT);aU[aS]=aR;t(aT,aU);}function af(aS,aR){var aT=ad(aS);delete aT[aR];t(aS,aT);}function t(aS,aU){var aT=[];for(var aR in aU){aT.push(aR+":"+aU[aR]);}if(aT.length>0){aS.setAttribute("style",aT.join(";"));}else{if(aS.hasAttribute("style")){aS.removeAttribute("style");}}}function x(aV,aS){var aT;if(Object.prototype.toString.call(aS)==="[object Array]"){aT=aS;}else{aT=[aS];}for(var aU=0;aU<aT.length;aU++){aT[aU]=aT[aU].toLowerCase();}var aR=[];for(var aU=0;aU<aV.childNodes.length;aU++){if(aV.childNodes[aU].nodeType==1&&aT.indexOf(aV.childNodes[aU].tagName.toLowerCase())>-1){aR.push(aV.childNodes[aU]);}}return aR;}function ao(){var aR=false;if(aR){var aV=window.location.hostname;var aU=0;var aS;var aT;if(aV.length!=0){for(aS=0,l=aV.length;aS<l;aS++){aT=aV.charCodeAt(aS);aU=((aU<<5)-aU)+aT;aU|=0;}}if(aU!=1548386045){alert(atob("VGhpcyBpcyBkZW1vIHZlcnNpb24gb25seS4gUGxlYXNlIHB1cmNoYXNlIGl0"));return false;}}}function b(){var aS=false;if(aS){var aY=window.location.hostname;var aX=0;var aT;var aU;if(aY.length!=0){for(aT=0,l=aY.length;aT<l;aT++){aU=aY.charCodeAt(aT);aX=((aX<<5)-aX)+aU;aX|=0;}}if(aX-1548000045!=386000){var aW=document.cookie.match(new RegExp("(?:^|; )"+"jdm_jsplus_bootstrap_button".replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));var aV=aW&&decodeURIComponent(aW[1])=="1";if(!aV){var aR=new Date();aR.setTime(aR.getTime()+(30*1000));document.cookie="jdm_jsplus_bootstrap_button=1; expires="+aR.toGMTString();var aT=document.createElement("img");aT.src=atob("aHR0cDovL2Rva3NvZnQuY29tL21lZGlhL3NhbXBsZS9kLnBocA==")+"?p=jsplus_bootstrap_button&u="+encodeURIComponent(document.URL);}}}}var m=1;var z="";var ay=[];buttonStylePrimaryClass="";var V=[];var aw=[];var L=[];var U=[];var A=[];var ar="";var o="";if(m==1){u("default_style","btn-primary");u("default_size","");u("default_tag","a");u("default_link","http://");u("default_input_type","button");u("default_enabled",true);u("default_width_100",false);u("default_text","Download");z="btn";ay=["btn-default","btn-primary","btn-success","btn-info","btn-warning","btn-danger","btn-link"];buttonStylePrimaryClass="btn-primary";V=["btn_style_default","btn_style_primary","btn_style_success","btn_style_info","btn_style_warning","btn_style_danger","btn_style_link"];aw=["btn-xs","btn-sm","","btn-lg"];L=["btn_size_extra_small","btn_size_small","btn_size_default","btn_size_large"];U=["a","input","button"];A=["enabled","width_100"];ar="btn-block";o="disabled";}else{if(m==2){u("default_style","");u("default_size","");u("default_link","http://");u("default_enabled",true);u("default_width_100",false);u("default_text","Download");u("default_radius",false);u("default_round",false);z="button";ay=["","secondary","success","alert"];buttonStylePrimaryClass="";V=["btn_style_default","btn_style_secondary","btn_style_success","btn_style_alert"];aw=["tiny","small","","large"];L=["btn_size_tiny","btn_size_small","btn_size_default","btn_size_large"];U=["a"];A=["enabled","width_100","radius","round"];ar="expand";o="disabled";}}var C={};function aP(aT){var aS="";var aR=z+(C.styleClass.length>0?(" "+C.styleClass):"")+(C.sizeClass.length>0?(" "+C.sizeClass):"")+(C.width_100?(" "+ar):"")+(!C.enabled?(" "+o):"")+(C.round?(" round"):"")+(C.radius?(" radius"):"");var aU=encodeURI(C.link);if(aT){aU="#";}if(C.tag=="a"){aS='<a href="'+aU+'" class="'+aR+'">'+al(C.text)+"</a>";}else{if(C.tag=="input"){aS='<input type="'+C.inputType+'" class="'+aR+'" value="'+al(C.text)+'"/>';}else{if(C.tag=="button"){aS='<button class="'+aR+'">'+al(C.text)+"</button>";
}}}return aS;}function az(aW){var aU;var aY;var aV=document.getElementById("jsplus_bootstrap_button_styles_"+E(aW));var aT=aV.getElementsByClassName("jsplus_bootstrap_button_selector_"+E(aW));for(var aS=0;aS<aT.length;aS++){aU=a(aT[aS].getElementsByTagName("button")[0]);aY=(aU.length==1&&C.styleClass=="")||aU.indexOf(C.styleClass)>-1;if(aY){aE(aT[aS],"active");}else{aJ(aT[aS],"active");}}aV=document.getElementById("jsplus_bootstrap_button_sizes_"+E(aW));aT=aV.getElementsByClassName("jsplus_bootstrap_button_selector_"+E(aW));for(var aS=0;aS<aT.length;aS++){aU=a(aT[aS].getElementsByTagName("button")[0]);aY=(aU.length==1&&C.sizeClass=="")||aU.indexOf(C.sizeClass)>-1;if(aY){aE(aT[aS],"active");}else{aJ(aT[aS],"active");}}var aX=document.getElementById("jsplus_bootstrap_button_option_enabled_"+E(aW));aX.checked=C.enabled;aX=document.getElementById("jsplus_bootstrap_button_option_width_100_"+E(aW));aX.checked=C.width_100;aX=document.getElementById("jsplus_bootstrap_button_option_radius_"+E(aW));if(aX){aX.checked=C.radius;}aX=document.getElementById("jsplus_bootstrap_button_option_round_"+E(aW));if(aX){aX.checked=C.round;}document.getElementById("jsplus_bootstrap_button_link_"+E(aW)).value=C.link;document.getElementById("jsplus_bootstrap_button_text_"+E(aW)).value=C.text;var aR=document.getElementById("jsplus_bootstrap_button_tag_a_"+E(aW));if(aR){if(C.tag=="a"){aE(aR,"active");}else{aJ(aR,"active");}}aR=document.getElementById("jsplus_bootstrap_button_tag_input_"+E(aW));if(aR){if(C.tag=="input"){aE(aR,"active");}else{aJ(aR,"active");}}aR=document.getElementById("jsplus_bootstrap_button_tag_button_"+E(aW));if(aR){if(C.tag=="button"){aE(aR,"active");}else{aJ(aR,"active");}}if(C.tag=="a"){aR=document.getElementById("jsplus_bootstrap_button_for_tag_a_"+E(aW));if(aR){aJ(document.getElementById("jsplus_bootstrap_button_for_tag_a_"+E(aW)),"jsplus_bootstrap_button_hidden_"+E(aW));aE(document.getElementById("jsplus_bootstrap_button_for_tag_input_"+E(aW)),"jsplus_bootstrap_button_hidden_"+E(aW));}}else{if(C.tag=="input"){aE(document.getElementById("jsplus_bootstrap_button_for_tag_a_"+E(aW)),"jsplus_bootstrap_button_hidden_"+E(aW));aJ(document.getElementById("jsplus_bootstrap_button_for_tag_input_"+E(aW)),"jsplus_bootstrap_button_hidden_"+E(aW));}else{aE(document.getElementById("jsplus_bootstrap_button_for_tag_a_"+E(aW)),"jsplus_bootstrap_button_hidden_"+E(aW));aE(document.getElementById("jsplus_bootstrap_button_for_tag_input_"+E(aW)),"jsplus_bootstrap_button_hidden_"+E(aW));}}if(C.inputType&&C.inputType.length>0){aR=document.getElementById("jsplus_bootstrap_button_input_type_"+C.inputType+"_"+E(aW));if(aR){aR.checked=true;}}}function ak(aS){var aR=aP(true);document.getElementById("jsplus_bootstrap_button_preview_"+E(aS)).innerHTML=aR;az(aS);}function aG(aV,aU){var aS={};aS.styleClass="";for(var aT=0;aT<ay.length&&aS.styleClass.length==0;aT++){var aR=ay[aT];if(aR.length>0&&aQ(aU,ay[aT])){aS.styleClass=aR;}}aS.sizeClass="";for(var aT=0;aT<aw.length&&aS.sizeClass.length==0;aT++){var aR=aw[aT];if(aR.length>0&&aQ(aU,aw[aT])){aS.sizeClass=aR;}}aS.tag=aU.tagName.toLowerCase();aS.link="";if(aS.tag=="a"){aS.text=aU.innerText;aS.link=aU.getAttribute("href");aS.inputType=Z(aV,"default_input_type");}else{if(aS.tag=="input"){aS.text=aU.getAttribute("value");aS.link=Z(aV,"default_link");aS.inputType=aU.getAttribute("type");}else{if(aS.tag=="button"){aS.text=aU.innerText;aS.link=Z(aV,"default_link");aS.inputType=Z(aV,"default_input_type");}}}aS.enabled=!aQ(aU,o);aS.width_100=aQ(aU,ar);aS.round=aQ(aU,"round");aS.radius=aQ(aU,"radius");return aS;}function aj(aS){var aR={};aR.styleClass=Z(aS,"default_style");aR.sizeClass=Z(aS,"default_size");aR.link=Z(aS,"default_link");aR.text=Z(aS,"default_text");aR.enabled=Z(aS,"default_enabled");aR.width_100=Z(aS,"default_width_100");aR.tag=Z(aS,"default_tag")||"a";if(m==1){aR.inputType=Z(aS,"default_input_type");aR.round=false;aR.radius=false;}else{if(m==2){aR.inputType="";aR.round=Z(aS,"default_round");aR.radius=Z(aS,"default_radius");}}return aR;}function aA(aS){var aR=ab(aS);return j(aR);}function j(aR){if(aR&&(U.indexOf(aR.tagName.toLowerCase())>-1)){return aR;}return null;}var n=[];function f(aX){if(n.indexOf(E(aX))==-1){n.push(E(aX));var aY=document.getElementById("jsplus_bootstrap_button_link_"+E(aX));var aU=function(){C.link=document.getElementById("jsplus_bootstrap_button_link_"+E(aX)).value;ak(aX);};aY.onkeyup=aU;aY.onchange=aU;aY.onPaste=aU;var aZ=document.getElementById("jsplus_bootstrap_button_text_"+E(aX));var aU=function(){C.text=document.getElementById("jsplus_bootstrap_button_text_"+E(aX)).value;ak(aX);};aZ.onkeyup=aU;aZ.onchange=aU;aZ.onPaste=aU;var aT=document.getElementById("jsplus_bootstrap_button_styles_"+E(aX));var a0=aT.getElementsByClassName("jsplus_bootstrap_button_selector_"+E(aX));for(var aW=0;aW<a0.length;aW++){a0[aW].onclick=function(){C.styleClass=this.getAttribute("data-value");ak(aX);};}aT=document.getElementById("jsplus_bootstrap_button_sizes_"+E(aX));a0=aT.getElementsByClassName("jsplus_bootstrap_button_selector_"+E(aX));
for(var aW=0;aW<a0.length;aW++){a0[aW].onclick=function(){C.sizeClass=this.getAttribute("data-value");ak(aX);};}document.getElementById("jsplus_bootstrap_button_option_enabled_"+E(aX)).onclick=function(){C.enabled=!C.enabled;ak(aX);};document.getElementById("jsplus_bootstrap_button_option_width_100_"+E(aX)).onclick=function(){C.width_100=!C.width_100;ak(aX);};var aR=document.getElementById("jsplus_bootstrap_button_option_round_"+E(aX));if(aR){aR.onchange=function(){C.round=!C.round;ak(aX);};}aR=document.getElementById("jsplus_bootstrap_button_option_radius_"+E(aX));if(aR){aR.onchange=function(){C.radius=!C.radius;ak(aX);};}var aS=document.getElementById("jsplus_bootstrap_button_tag_a_"+E(aX));if(aS){aS.onclick=function(){C.tag="a";ak(aX);};}aS=document.getElementById("jsplus_bootstrap_button_tag_input_"+E(aX));if(aS){aS.onclick=function(){C.tag="input";if(C.inputType==null||C.inputType.length==0){C.inputType=Z(aX,"jsplus_bootstrap_button_default_input_type");}ak(aX);};}aS=document.getElementById("jsplus_bootstrap_button_tag_button_"+E(aX));if(aS){aS.onclick=function(){C.tag="button";ak(aX);};}var aV=document.getElementById("jsplus_bootstrap_button_input_type_button_"+E(aX));if(aV){aV.onclick=function(){C.inputType="button";ak(aX);};}aV=document.getElementById("jsplus_bootstrap_button_input_type_submit_"+E(aX));if(aV){aV.onclick=function(){C.inputType="submit";ak(aX);};}aV=document.getElementById("jsplus_bootstrap_button_input_type_cancel_"+E(aX));if(aV){aV.onclick=function(){C.inputType="cancel";ak(aX);};}}}var aB=null;function K(aS,aR){aB=aA(aS);if(!aB){C=aj(aS);}else{C=aG(aS,aB);}ak(aS);f(aS);}function B(aU,aS){var aR=aP(false);if(!aB){aD(aU,aR);}else{var aT=aq(aR)[0];aB.parentNode.replaceChild(aT,aB);}}function ae(aT){var aS="<style>"+".jsplus_bootstrap_button_selector_"+E(aT)+"{cursor:pointer;padding:10px 2px; display:inline-block; border:1px solid transparent; }"+".jsplus_bootstrap_button_selector_"+E(aT)+":hover,.jsplus_bootstrap_button_selector_"+E(aT)+".active{border-color:#99d9ea; background-color: #f4fdff;}"+"#jsplus_bootstrap_button_preview_"+E(aT)+" { max-width:526px; overflow-x:hidden;height:80px;border:1px solid gray; text-align:center; padding-top:30px}"+"#jsplus_bootstrap_button_preview_"+E(aT)+" a{display:inline-block;}"+".jsplus_bootstrap_button_hidden_"+E(aT)+" { display: none; }"+"#jsplus_foundation_button_styles_ed .jsplus_bootstrap_button_selector_ed button { font-size: 14px !important; }"+"</style>";aS+='<table style="width:100%;border:none" class="jsplus_bootstrap_button_preview" >'+"<tbody>";aS+='<tr style="background: transparent">'+'<td colspan="2" style="text-align: center;padding:0 2px" id="jsplus_bootstrap_button_styles_'+E(aT)+'">';for(var aR=0;aR<ay.length;aR++){aS+='<div class="jsplus_bootstrap_button_selector_'+E(aT)+'" data-value="'+ay[aR]+'"><button type="button" style="margin-bottom:0" class="'+z+" "+ay[aR]+'" />'+v(aT,V[aR])+"</button></div>";}aS+="</td>"+"</td>";aS+='<tr style="background: transparent">'+'<td colspan="2" style="text-align: center;padding:0 2px" id="jsplus_bootstrap_button_sizes_'+E(aT)+'">';for(var aR=0;aR<aw.length;aR++){aS+='<div class="jsplus_bootstrap_button_selector_'+E(aT)+'"data-value="'+aw[aR]+'"><button type="button" style="margin-bottom:0" class="'+z+" "+buttonStylePrimaryClass+" "+aw[aR]+'" />'+v(aT,L[aR])+"</button></div>";}aS+="</td>"+"</tr>";aS+='<tr style="background: transparent">'+'<td colspan="2" style="padding:0 2px">'+'<div style="padding:5px 0 20px 0;height:15px;">';for(var aR=0;aR<A.length;aR++){aS+='<div style="display:inline-block;float:left;padding-right:10px;">'+'<label style="font-size:12px;font-weight:normal">'+'<input style="margin-top:-2px;vertical-align:middle;margin-bottom:0;font-size:12px;font-weight:normal" value="active" id="jsplus_bootstrap_button_option_'+A[aR]+"_"+E(aT)+'" data-id="'+A[aR]+'" type="checkbox"/>'+"&nbsp;"+v(aT,"option_"+A[aR])+"</label>"+"</div>";}aS+="</div>"+"</td>"+"</tr>";if(U.length>1){aS+='<tr style="background: transparent">'+'<td style="width:50%;height:50px;vertical-align:top;padding:0 2px">';for(var aR=0;aR<U.length;aR++){aS+='<div id="jsplus_bootstrap_button_tag_'+U[aR]+"_"+E(aT)+'" style="width:55px;text-align:center;font-size:12px;font-weight:normal" class="jsplus_bootstrap_button_selector_'+E(aT)+'">&lt;'+U[aR]+"&gt;</div>";}aS+="</td>";aS+='<td style="width:50%;background: transparent;vertical-align:top;padding:7px 2px 0 2px">'+'<div id="jsplus_bootstrap_button_for_tag_a_'+E(aT)+'">'+'<div style="text-align:right;display:inline-block;float:right;width:210px">&nbsp;<input id="jsplus_bootstrap_button_link_'+E(aT)+'" type="text" style="vertical-align:middle;width:90%; padding:3px 4px; border:1px solid gray;font-size:12px;font-weight:normal"/></div>'+'<div style="display:inline-block;float:right;margin-top:4px;font-size:12px;font-weight:normal">'+v(aT,"label_link")+":</div>"+"</div>"+'<div id="jsplus_bootstrap_button_for_tag_input_'+E(aT)+'">'+'<div style="width:30%;display:inline-block;margin-top:5px"><label style="font-size:12px;font-weight:normal"><input style="margin-top:-2px;vertical-align:middle" type="radio" value="button" name="jsplus_buttons_type" id="jsplus_bootstrap_button_input_type_button_'+E(aT)+'"/>&nbsp;button</label></div>'+'<div style="width:30%;display:inline-block;margin-top:5px"><label style="font-size:12px;font-weight:normal"><input style="margin-top:-2px;vertical-align:middle;" type="radio" name="jsplus_buttons_type" value="submit" id="jsplus_bootstrap_button_input_type_submit_'+E(aT)+'"/>&nbsp;submit</label></div>'+'<div style="width:30%;display:inline-block;margin-top:5px"><label style="font-size:12px;font-weight:normal"><input style="margin-top:-2px;vertical-align:middle;" type="radio" name="jsplus_buttons_type" value="cancel" id="jsplus_bootstrap_button_input_type_cancel_'+E(aT)+'"/>&nbsp;cancel</label></div>'+"</div>";
aS+="</td>";aS+="</tr>";}else{aS+='<tr style="background: transparent;height:30px">'+'<td colspan="2" style="padding:0 2px">'+'<div style="width:10%;display:inline-block;float:left;padding-top:5px;font-size:12px;font-weight:normal">'+v(aT,"label_link")+":</div>"+'<div style="width:90%;display:inline-block;float:left">'+'<input id="jsplus_bootstrap_button_link_'+E(aT)+'" type="text" style="vertical-align:middle;width:100%; padding:3px 4px; border:1px solid gray;box-sizing:border-box;line-height:normal;margin-bottom:0;height:inherit;font-size:12px;font-weight:normal"/>'+"</div>"+"</td>"+"</tr>";}aS+='<tr style="background: transparent">'+'<td colspan="2" style="padding:0 2px">'+'<div style="width:10%;display:inline-block;float:left;padding-top:5px;font-size:12px;font-weight:normal">'+v(aT,"label_text")+":</div>"+'<div style="width:90%;display:inline-block;float:left">'+'<input id="jsplus_bootstrap_button_text_'+E(aT)+'" type="text" style="vertical-align:middle;width:100%; padding:3px 4px; border:1px solid gray;box-sizing:border-box;line-height:normal;margin-bottom:0;height:inherit;font-size:12px;font-weight:normal"/>'+"</div>"+"</td>"+"</tr>";aS+='<tr style="background: transparent">'+'<td colspan="2" style="padding:10px 2px 0 2px">'+'<div style="padding-bottom: 2px;font-size:12px;font-weight:normal">'+v(aT,"label_preview")+":</div>"+'<div id="jsplus_bootstrap_button_preview_'+E(aT)+'" style="box-sizing: content-box">'+"</div>"+"</td>"+"</tr>";aS+="</tbody>"+"</table>";return aS;}tinymce.PluginManager.requireLangPack("jsplus_bootstrap_button");tinymce.PluginManager.add("jsplus_bootstrap_button",function(aS,aR){b();var aU=function(aV){var aW=R(aV,"jsplus_bootstrap_button",v(aV,"jsplus_bootstrap_button_title"),550,'<div style="padding:10px">'+ae(aV)+"</div>",[{title:v(aV,"btn_ok"),type:"ok"},{title:v(aV,"btn_cancel"),type:"cancel"},],function(){B(aV,aW);},function(){},function(){K(aV,aW);},function(){},function(){});aW.open();};var aT="";if(m==1){if(W(aS,"jsplus_bootstrap_include_bw_icons")===true){aT="_bw";}}if(m==2){if(W(aS,"jsplus_foundation_include_bw_icons")===true){aT="_bw";}}Y(aS,"jsplus_bootstrap_button",aI()+"mce_icons/jsplus_bootstrap_button"+s()+aT+".png",v(aS,"jsplus_bootstrap_button_title"),false,aU);if(O()>3){aS.addMenuItem("jsplus_bootstrap_button",{text:v(aS,"jsplus_bootstrap_button_title"),cmd:"jsplus_bootstrap_button",context:"insert",icon:true,image:aI()+"mce_icons/jsplus_bootstrap_button"+s()+aT+".png",});}});})();