var App=window.App||{};App.Updaters={index:{},indexData:{},reset:function(){this.index={},this.indexData={}},header:function(a){var b=$(".navbar ul.nav li");b.removeClass("active"),b.filter('[data-type="'+a+'"]').addClass("active")},update_left_selection:function(a,b){var c,d,e,f,g,h,i,j,k=$("#content-left"),l=k.children(),m=!1;for(a=$.trim(a),""===a&&b&&(b=!1,a=k.data("selected")),b||k.data("selected",a),f=0;f<btp.dataList.length;f++)if(h=btp.dataList[f]&&btp.dataList[f].items){for(c=0,d=0,g=0;g<h.length;g++)if(i=String(h[g].val),j=i.toLocaleLowerCase(),!b&&i===a||b&&j.indexOf(a)>=0){l.eq(f).trigger("click"),d=1;break}if(l.eq(f)[1===d?"addClass":"removeClass"]("show"),d=0,l.eq(f).data("active"))for(c=l.eq(f).find("ul").children(),b||c.filter(".active").removeClass("active"),g=0;g<h.length;g++)i=String(h[g].val),j=i.toLocaleLowerCase(),b?(e=j.indexOf(a)>=0,c.eq(g)[e?"show":"hide"]()):(e=i===a,e&&(c.eq(g).addClass("active"),m=!0),c.eq(g).show()),e&&(d=1);l.eq(f)[b&&1!==d?"hide":"show"]()}else b?l.eq(f)[btp.dataList[f].val.toLocaleLowerCase().indexOf(a)>=0?"show":"hide"]():btp.dataList[f].val===a?(m=!0,l.eq(f).addClass("active").show()):l.eq(f).removeClass("active").show();return m},left_dashboards:function(a){if("dashboards"==App.Updaters.index.left)this.update_left_selection(a);else{$(".js-mainmenu").filter('[data-type="dashboard"]').click();var b=Dashboards.getList();btp.dataList=b,btp.dataType="dashboard",btp.show("left_list",{r:b,link:curry(getLink,btp.dataType),header:"Дашборды"},"#content-left").then(function(){App.Updaters.update_left_selection(a)})}App.Updaters.index.left="dashboards",$(".form-search").find("input").focus()},left_services:function(a){var b=$.Deferred();return"services"==App.Updaters.index.left?this.update_left_selection(a)?b.resolve(!1):b.reject():($(".js-mainmenu").filter('[data-type="service"]').click(),$.when(btp.query("get_list",{service:"?",scale:App.scale,sortby:""})).done(function(c,d){btp.dataList=c=transform_list("services",c,d),btp.dataType="service",btp.show("left_list",{r:c,link:curry(getLink,btp.dataType),header:"Сервисы"},"#content-left").then(function(){App.Updaters.update_left_selection(a)?b.resolve(!0):b.reject()})}).fail(function(a){b.reject(a)})),App.Updaters.index.left="services",$(".form-search").find("input").focus(),b.promise()},left_scripts:function(a){var b=$.Deferred();return"scripts"==App.Updaters.index.left?this.update_left_selection(a)?b.resolve(!1):b.reject():($('.js-mainmenu[data-type="script"]').click(),$.when(btp.query("get_list",{script:"?",scale:App.scale,sortby:""})).done(function(c,d){btp.dataList=c=transform_list("scripts",c,d),btp.dataType="script",btp.show("left_list",{r:c,link:curry(getLink,btp.dataType),header:"Скрипты"},"#content-left").then(function(){App.Updaters.update_left_selection(a)?b.resolve(!0):b.reject(),b.resolve(!0)})}).fail(function(a){b.reject(a)})),App.Updaters.index.left="scripts",$(".form-search").find("input").focus(),b.promise()},left_empty:function(){App.Updaters.index.left="empty",$("#content-left").html("")},right_empty:function(){App.Updaters.index.right="empty",$("#content-right").html("")},right_container:function(a){(a||"container"!=App.Updaters.index.right)&&(btp.show("right_container",{},"#content-right"),this.makeempty("right_top"),this.makeempty("right_middle"),this.makeempty("right_middle2"),this.makeempty("right_bottom")),App.Updaters.index.right="container"},_right_x:function(a,b,c,d){App.Updaters.index[a]!=b?($("#"+a).html(""),c("#"+a)):($("#"+a).html(""),d&&d("#"+a),c("#"+a)),App.Updaters.index[a]=b},right_top:function(a,b,c,d){return App.Updaters._right_x("right-top",a,b,c,d)},right_middle:function(a,b,c,d){return App.Updaters._right_x("right-middle",a,b,c,d)},right_middle2:function(a,b,c,d){return App.Updaters._right_x("right-middle2",a,b,c,d)},right_bottom:function(a,b,c,d){return App.Updaters._right_x("right-bottom",a,b,c,d)},makeempty:function(a){var b=$.Deferred();return App.Updaters[a]("empty",function(c){b.resolve($(c).html("")),App.Updaters.index[a]=null},function(a){b.reject($(a))}),b},makelist:function(a,b,c,d,e,f,g,h){var i=$.Deferred(),j=function(a){var b="active";$("li."+b,a).removeClass(b),void 0!==g&&$('li[data-val="'+g+'"]',a).addClass(b)};return"object"==typeof d&&(d.scale=App.scale),App.Updaters[a](c,function(a){delete App.Updaters.indexData[c],$.when(btp.query("get_list",d)).done(function(g,k){g=parse_names_from_path(g,d.op?3:2),f&&g.length>0&&g.push(""),App.Updaters.indexData[c]=g,btp.show("li_list",{r:g,link:e,warnings:k,header:b},a).done(function(a){j(a),h&&h(g),i.resolve(g,a)})})},function(a){j(a),h&&h(App.Updaters.indexData[c]),i.resolve(App.Updaters.indexData[c],$(a))},!!d.power),i.promise()},dummy:null},App.OldControllers={service:function(a){a=decodeparam(a),App.Updaters.left_services(a).done(function(){App.Updaters.right_container(!0),App.OldControllers.service_server_right_top(a)}).fail(function(){window.btp.onError({title:"Ошибка в данных",msg:"Сервис "+a+" не найден!"})})},service_srv:function(a,b){a=decodeparam(a),b=decodeparam(b),"@"==b&&(b=""),App.Updaters.right_container(),App.Updaters.left_services(a).done(function(){App.OldControllers.service_server_right_top(a,b).done(function(){function c(d,e){App.OldControllers.service_server_right_middle(a,b,d,e).done(function(f,g){f=f.map(function(a){return a.lastIndexOf("~~")>-1?a.substring(a.lastIndexOf("~~")+2):a}),App.Updaters.makeempty("right_middle2"),App.Updaters.makeempty("right_bottom"),App.OldControllers.service_server_right_bottom(a,b,f,e).done(function(){var a=g.find(".js-sortby-selector").removeClass("hide"),b=[],f=g.find(".js-sortby-powerCheckbox");g.find(".js-sortby-power").removeClass("hide"),e&&g.find(".js-sortby-powerCheckbox")[0]&&(g.find(".js-sortby-powerCheckbox")[0].checked=!0),a.find(".js-selected").text(d),$.each(["nosort","avg","perc50","perc80","perc95","perc99","perc100","min","max","lossy","count"],function(a,c){b.push("<li"+(c===d?' class="active"':"")+'><a tabindex="-1" href="#">'+c+"</a></li>")}),a.find("ul").append(b.join("")),a.on("click","a",function(){var b=$(this).text(),d=e;a.find(".js-selected").text(b),g.find(".js-sortby-powerCheckbox")[0].checked&&(d=!0),c(b,d)}),f.on("click",function(){e=!e,c(d,e)})})})}c("count")})}).fail(function(){window.btp.onError({title:"Ошибка в данных",msg:"Сервис "+a+" не найден!"})})},service_srv_op:function(a,b,c){a=decodeparam(a),b=decodeparam(b),"@"==b&&(b=""),App.Updaters.right_container(),App.Updaters.left_services(a).done(function(){App.OldControllers.service_server_right_top(a,b).done(function(){App.OldControllers.service_server_right_middle(a,b).done(function(){App.OldControllers.service_server_right_middle2(a,b,c).done(function(){App.Updaters.makeempty("right_bottom"),App.OldControllers.service_server_right_bottom2(a,b,c)}).fail(function(){App.Updaters.makeempty("right_bottom").always(function(a){a.html('<h3 class="text-error">Нет данных</h3>'),$("#right-middle ul li").each(function(a,b){var d=$(b);d.find(">a").toggleClass("text-error",d.data("val")===c)})})})})})}).fail(function(){window.btp.onError({title:"Ошибка в данных",msg:"Сервис "+a+" не найден!"})})},service_server_right_top:function(a,b){return null!=b?App.Updaters.makelist("right_top","Серверы, которые обслуживают сервис "+a,"servers_of_"+a,{service:a,server:"?"},curry(getLink,"service",a),!0,b):App.Updaters.makelist("right_top","Серверы, которые обслуживают сервис "+a,"servers_of_"+a,{service:a,server:"?"},curry(getLink,"service",a),!0,b,function(b){b&&1==b.length?Backbone.history.navigate(getLink("service",a,b[0]),{trigger:!0,replace:!0}):Backbone.history.navigate(getLink("service",a,""),{trigger:!0,replace:!0})})},service_server_right_middle:function(a,b,c,d){return App.Updaters.makelist("right_middle","Операции на сервере "+b,"ops_"+b+"_"+c,{service:a,server:b,op:"?",sortby:c,power:d},curry(getLink,"service",a,b),!1,c)},service_server_right_middle2:function(a,b,c){var d=$.Deferred();return App.Updaters.right_middle2("gr_"+a+"_"+b+"_"+c,function(e){btp.query("get_graph",{service:a,server:b,op:c,scale:App.scale}).done(function(f){if($("#graphs").html(""),App.newGraph&&App.isAPIv2)App.showPlot({el:e,data:App.getPlotDataSingle(f),pType:1,addLegend:!0,link:curry(getLink,"service",a,b)});else{var g=f.scale/1e6||App.getPlotScale(),h=App.getOldPlotData(f.counters,g),i=App.getOldPlotTS(h),j=new window.btpgraph(i,g);j.addCount(h,c).addTime(h,c),j.init(e,{width:App.current_width,rateAndCountSelector:!0})}d.resolve(!0)}).fail(function(){d.reject()})}),d.promise()},service_server_right_bottom:function(a,b,c,d){console.log(c);var e=$.Deferred();return App.Updaters.right_bottom("service_"+a+"_"+b,function(f){$.when(btp.query("get_multigraph",{field:"perc80",service:a,server:b,op:"*",scale:App.scale,names:c,power:d}),!!App.isAPIv2||btp.query("get_multigraph",{field:"count",service:a,server:b,op:"*",scale:App.scale,names:c})).done(function(c,d){if(!c||!d)return void e.reject();if(App.newGraph&&App.isAPIv2){var g=App.getPlotData(c.data,null);App.showPlot({el:f,data:g[0],pType:2,addLegend:!0,link:curry(getLink,"service",a,b)},{el:f,data:g[1],pType:3})}else draw_pair(f,c,d,0,.5,null);e.resolve(!0)}).fail(function(){e.reject()})}),e.promise()},service_server_right_bottom2:function(a,b,c){var d=$.Deferred(),e=10;return App.Updaters.makelist("right_middle","Операции на сервере "+b,"ops_"+b,{service:a,server:b,op:"?"},curry(getLink,"service",a,b),!1,c,function(){var f=function(g,h){App.Updaters.right_bottom("gr_"+a+"_"+b+"_"+c+"_"+e+"_"+g+"_"+h,function(i){"_"!=b&&""!=b&&1!=$("#right-top li a").length||btp.query("get_list",{service:a,op:c,script:"?",limit:e,scale:App.scale,sortby:g,power:h}).done(function(j){j=parse_names_from_path(j,1),btp.show("li_list",{r:j,link:curry(function(){var b;return(b=[].slice.call(arguments,0)).push(a),getLink.apply(this,b)},"script"),linkPostfix:a,warnings:[],header:"Скрипты, которые вызывают "+c+" сервиса "+a+" (top"+e+" / <a class='js-load-next' href='#'>top"+(e+20)+"</a>)"},"#right-bottom").done(function(k){if(App.newGraph&&App.isAPIv2){var l=k.find(".js-sortby-selector").removeClass("hide"),m=[],n=k.find(".js-sortby-powerCheckbox");k.find(".js-sortby-power").removeClass("hide"),l.find(".js-selected").text(g),h&&(k.find(".js-sortby-powerCheckbox")[0].checked=!0),$.each(["avg","perc50","perc80","perc95","perc99","perc100","min","max","lossy","count"],function(a,b){m.push("<li"+(b===g?' class="active"':"")+'><a tabindex="-1" href="#">'+b+"</a></li>")}),l.find("ul").append(m.join("")),l.on("click","a",function(){var a=$(this).text(),b=h;k.find(".js-sortby-powerCheckbox")[0].checked&&(b=!0),l.find(".js-selected").text(a),f(a,b)}),n.on("click",function(){h=!h,f(g,h)}),btp.query("get_multigraph",{names:_.map(j||[],function(b){return"script~~"+b+"~~"+a+"~~"+c})}).done(function(c){var d=App.getPlotData(c.data,1);App.showPlot({el:i,data:d[0],pType:2,addLegend:!0,link:curry(getLink,"service",a,b)},{el:i,data:d[1],pType:3})})}else btp.query("get_multigraph",{names:_.map(j||[],function(b){return"script~~"+b+"~~"+a+"~~"+c})}).done(function(a){if(d.resolve(),a.data&&a.data.length){var b={ts:0,data:{},scale:a.scale/1e6||App.getPlotScale()};if(_.each(a.data,function(a){var c=a.name.split("~~")[1],d=b.data[c]=App.getOldPlotData(a.counters,b.scale),e=App.getOldPlotTS(d);e&&(b.ts=Math.max(b.ts,e))}),!b.ts&&!b.scale)return!1;var c=new window.btpgraph(b.ts,b.scale),e=new window.btpgraph(b.ts,b.scale);_.each(b.data,function(a,b){c.addTime(a,b),e.addCount(a,b)}),c.init(i,{width:App.current_width,percSelector:!0}),e.init(i,{width:App.current_width,rateAndCountSelector:!0}),c.setPair(e),e.setPair(c)}});$("#right-bottom h3 a.js-load-next").unbind("click").bind("click",function(a){a.preventDefault(),e+=20,f(g)})})})})};f("count")}),d.promise()},script:function(a){a=decodeparam(a),App.Updaters.left_scripts(a).done(function(){App.Updaters.right_container(!0),App.Updaters.makeempty("right_bottom"),App.OldControllers.script_service_right_top(a)}).fail(function(){window.btp.onError({title:"Ошибка в данных",msg:"Скрипт "+a+" не найден!"})})},script_service:function(a,b){App.Updaters.right_container(),App.Updaters.left_scripts(a).done(function(){App.OldControllers.script_service_right_top(a,b).done(function(){function c(d){App.Updaters.makeempty("right_middle"),App.Updaters.makeempty("right_middle2"),App.Updaters.makeempty("right_bottom"),App.OldControllers.script_service_right_middle(a,b,null,d).done(function(e,f){App.OldControllers.script_service_right_bottom_pair(a,b,e).done(function(){var a=f.find(".js-sortby-selector").removeClass("hide"),b=[];f.find(".js-sortby-power").removeClass("hide"),a.find(".js-selected").text(d),$.each(["avg","perc50","perc80","perc95","perc99","perc100","min","max","lossy","count"],function(a,c){b.push("<li"+(c===d?' class="active"':"")+'><a tabindex="-1" href="#">'+c+"</a></li>")}),a.find("ul").append(b.join("")),a.on("click","a",function(){var b=$(this).text();a.find(".js-selected").text(b),c(b)})})}).fail(function(){App.Updaters.makeempty("right_bottom").always(function(a){a.html('<h3 class="text-error">Нет данных</h3>')}),$("#right-middle ul li").each(function(a,b){var c=$(b);c.find(">a").toggleClass("text-error",c.data("val")===op)})})}c("count")})}).fail(function(){window.btp.onError({title:"Ошибка в данных",msg:"Скрипт "+a+" не найден!"})})},script_service_op:function(a,b,c){a=decodeparam(a),b=decodeparam(b),App.Updaters.right_container(),App.Updaters.left_scripts(a).done(function(){App.OldControllers.script_service_right_top(a,b).done(function(){App.OldControllers.script_service_right_middle(a,b,c).done(function(d,e){e.find(".js-sortby-selector").addClass("hide"),e.find(".js-sortby-power").addClass("hide"),App.Updaters.makeempty("right_middle2"),App.OldControllers.script_service_right_bottom_single(a,b,c).fail(function(){App.Updaters.makeempty("right_bottom").always(function(a){a.html('<h3 class="text-error">Нет данных</h3>')}),$("#right-middle ul li").each(function(a,b){var d=$(b);d.find(">a").toggleClass("text-error",d.data("val")===c)})})}).fail(function(){App.Updaters.makeempty("right_middle2").always(function(a){a.html('<h3 class="text-error">Нет данных</h3>')})})})}).fail(function(){window.btp.onError({title:"Ошибка в данных",msg:"Скрипт "+a+" не найден!"})})},script_service_right_top:function(a,b){return App.Updaters.makelist("right_top","Сервисы, которые используются из "+a,"services_of_"+a,{script:a,service:"?",sortby:""},curry(getLink,"script",a),!1,b)},script_service_right_middle:function(a,b,c,d){return App.Updaters.makelist("right_middle",'Операции с сервисом <a href="#service/'+encodeparam(b)+"//?"+$.param(App.getLinkParams())+'">'+b+"</a>, которые используются из "+a,"ops_"+b,{script:a,service:b,op:"?",sortby:d},curry(getLink,"script",a,b),!1,c)},script_service_right_bottom_single:function(a,b,c){var d=$.Deferred();return App.Updaters.right_bottom("script_"+a+"_"+b+"_"+c,function(e){btp.query("get_graph",{script:a,service:b,op:c,scale:App.scale}).done(function(f){if($("#graphs").html(""),App.newGraph&&App.isAPIv2)App.showPlot({el:e,data:App.getPlotDataSingle(f),pType:1,addLegend:!0,link:curry(getLink,"script",a,b)});else{var g=f.scale/1e6||App.getPlotScale(),h=App.getOldPlotData(f.counters,g),i=App.getOldPlotTS(h),j=new window.btpgraph(i,g);j.addCount(h,c).addTime(h,c),j.init(e,{width:App.current_width,rateAndCountSelector:!0})}d.resolve(e)}).fail(function(){d.reject()})}),d.promise()},script_service_right_bottom_pair:function(a,b,c){var d=$.Deferred();return App.Updaters.right_bottom("script_"+a+"_"+b,function(e){$.when(btp.query("get_multigraph",{field:"perc80",script:a,service:b,op:"*",scale:App.scale,names:c}),!!App.isAPIv2||btp.query("get_multigraph",{field:"count",script:a,service:b,op:"*",scale:App.scale,names:c})).done(function(c,f){if(!c||!f)return void d.reject();if(App.newGraph&&App.isAPIv2){var g=App.getPlotData(c.data,3);App.showPlot({el:e,data:g[0],pType:2,addLegend:!0,link:curry(getLink,"script",a,b)},{el:e,data:g[1],pType:3})}else draw_pair(e,c,f,0,.5,3);d.resolve(!0)}).fail(function(a){d.reject(a)})}),d.promise()},index:function(){btp.show("index",{},"#contentRight")},dummy:null},App.Controllers=window.Backbone.Router.extend({routes:{"service/*str":"service","script/*str":"script","dashboard/*str":"dashboard","":"index"},oldctl:null,initialize:function(a){this.oldctl=App.OldControllers},script:function(a){"script"!==App._category&&(App._category="script",App.Updaters.left_empty(),App.Updaters.right_empty());var b=App.parse_url(a);if(0==b.length)return this.scripts();var c="";return c=3==b.length?"script_service_op":2==b.length?"script_service":"script",this.oldctl[c].apply(this.oldctl,b.path)},service:function(a){"service"!==App._category&&(App._category="service",App.Updaters.left_empty(),App.Updaters.right_empty());var b=App.parse_url(a);if(0==b.length)return this.services();var c="";return c=3==b.length?"service_srv_op":2==b.length?"service_srv":"service",this.oldctl[c].apply(this.oldctl,b.path)},dashboard:function(a){App._category="dashboard";var b=App.parse_url(a);0==b.length?(App.Updaters.left_dashboards(),App.Updaters.right_empty()):(App.Updaters.left_dashboards(b.path[0]),App.Updaters.right_empty(),App.Updaters.index.right="dashboard",Dashboards[b.path[0]]($("#content-right")))},scripts:function(){App.Updaters.left_empty(),App.Updaters.left_scripts(),App.Updaters.right_empty()},services:function(){App.Updaters.left_empty(),App.Updaters.left_services(),App.Updaters.right_empty()},index:App.OldControllers.index});