(function (w, d){
  var prot = ( (/^((https|chrome-extension):)/i).test(w.location.protocol) ? 'https' : 'http'),
  u = prot + '://share.pluso.ru', uid="1376748343798",
  tags = "getElementsByTagName",
  h = d[tags]("body")[0],
  b = d.documentElement, db = d.body,
  compat = 0/*@cc_on +(d.compatMode=='BackCompat')@*/;


  function js(url, id, callback)
  {
    if (typeof id == "function")
    {
      callback = id;
      id = null;
    }

    if (id && d.getElementById(id)) return;

    if (url.charAt(0)=="+") url = u + '/' + url.substring(1);

    s = d.createElement("script");
    s.type = "text/javascript";
    s.charset='UTF-8';
    s.async = true;
    if(typeof id == "string") s.id = id;
    s.src = url;

    if (typeof callback == "function")
    {
      var called = false;
      s.onreadystatechange = function()
      {
        if (this.readyState == "complete" && !called)
        {
          called = true;
          callback();
        }
      };
      s.onload = function()
      {
        if (!called)
        {
          called = true;
          callback();
        }
      };
    }

    h.appendChild(s);
  }


  function styled(rules)
  {
    var s = d.createElement('style');
    s.setAttribute("type", "text/css");
    h.appendChild(s);

    if (s.styleSheet) {
        s.styleSheet.cssText = rules;
    } else {
        s.appendChild(d.createTextNode(rules));
    }
  }


  // event position
  function pointed(event)
  {
    return {
             pageX:(typeof event.pageX!='undefined'?event.pageX:(event.clientX + d.body.scrollLeft + b.scrollLeft)),
             pageY:(typeof event.pageY!='undefined'?event.pageY:(event.clientY + d.body.scrollTop + b.scrollTop))
           };
  }

  function dimensions()
  {
    return {
             width: w.innerWidth||b.clientWidth||(db && db.clientWidth),
             height:Math.max( db && db.scrollHeight, db && db.offsetHeight, b.clientHeight, b.scrollHeight, b.offsetHeight )
           }
  } 

  function numk(num, mini)
  {
     var d=(typeof mini!='undefined'?0:1);
     if (num >= 1000000000) {
        return (num / 1000000000).toFixed(d).replace(/\.0$/, '') + 'G';
     }
     if (num >= 1000000) {
        return (num / 1000000).toFixed(d).replace(/\.0$/, '') + 'M';
     }
     if (num >= 1000) {
        return (num / 1000).toFixed(d).replace(/\.0$/, '') + 'K';
     }
     return num;
  }

  function osize(opt)
  {
    return (opt.small==1?'small':(opt.medium==1?'medium':'big'));
  }

  function rnd(min, max)
  {
    if (!max)
    {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // old browser support
  if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
      for(var i=0, l=this.length; i<l; i++){
        if(this[i]==obj){
          return i;
        }
      }
      return -1;
    }
  }

  if (!Array.prototype.map) {
    Array.prototype.map = function( f ) {
      var result = [];
      for(var i=0,l=this.length; i<l; i++) {
        result.push( f(this[i]) );
      }
      return result;
    };
  };


  var iterate = function(obj, callback)
  {
    for (var key in obj) if (obj.hasOwnProperty(key)) callback(key, obj);
  }

  // get elements by class name
  var elements = (d.querySelectorAll?
           function (className, context){return (context || d).querySelectorAll("." + className)}:
         function (className, context){
                         if(!className) return [];
                         var e = (context || d)[tags]('*');
                         var list = [];
                         for (var i = 0, length = e.length; i < length; i++) {
                          var clss = e[i].className.split(' ');
                          if (clss.indexOf(className)>-1)
                            list.push(e[i]);
                         }
                         return list;
          });


  var encode = encodeURIComponent;

  var cloned = function(obj)
  {
    if (typeof obj.length!='undefined') return obj.slice(0);

    var clone = {};
    for(var i in obj) {
        if(typeof(obj[i])=="object")
            clone[i] = cloned(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
  }

  var arrayed = function(obj)
  {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }


  var lang = function(elem, service, title)
  {
   var language = elem.pluso.params.lang;
   if (title)
   {
     return (pluso.lang[language] && pluso.lang[language].titles && pluso.lang[language].titles[service]) || title;
   }
   else
     return (pluso.lang[language] && pluso.lang[language][service])
         || (pluso.lang['ru'] && pluso.lang['ru'][service])
         || service;
  }

  // cross-browser DOM ready handler
  var ready = (function (w, d)
  {
    var inited = false, loaded = false, queue = [], done, old;

    function go()
    {
      if (!inited)
      {
        if (!d.body) return setTimeout(go, 13);

        inited = true;
        if (queue)
        {
          var j, k = 0;
          while ((j = queue[k++])) j.call(null)
          queue = null;
        }
      }
    }

    function check()
    {
      if (loaded) return;
      loaded = true;

      if (d.readyState === "complete") return go();

      if (d.addEventListener)
      {
        d.addEventListener("DOMContentLoaded", done, false);
        w.addEventListener("load", go, false)
      }
      else
      {
        if (d.attachEvent)
        {
          d.attachEvent("onreadystatechange", done);
          w.attachEvent("onload", go);
          var k = false;
          try
          {
            k = w.frameElement == null
          }
          catch (j)
          {}
          if (b.doScroll && k) ie();
        }
        else
        {
         old=w.onload;
         w.onload=function(e)
         {

           old(e);
           go()
         }
        }
      }
    }

    if (d.addEventListener)
    {
      done = function ()
      {
        d.removeEventListener("DOMContentLoaded", done, false);
        go()
      }
    }
    else
    {
      if (d.attachEvent)
      {
        done = function ()
        {
          if (d.readyState === "complete")
          {
            d.detachEvent("onreadystatechange", done);
            go()
          }
        }
      }
    }

    function ie()
    {
      if (inited) return;

      try
      {
        b.doScroll("left")
      }
      catch (j)
      {
        setTimeout(ie, 1);
        return
      }
      go()
    }

    return function (callback)
    {
      check();
      if (inited)
      {
        callback.call(null)
      }
      else
      {
        queue.push(callback)
      }
    }
  })(w, d);



  // begin but don't dublicate
  if (w.pluso && typeof w.pluso.start == "function") return;

  if (!w.pluso) w.pluso = {};

  pluso.cnt=0;
  pluso.uid=uid;


  if(!w.pluso.lang) w.pluso.lang={};

  pluso.lang['ru']= {
    'close':'ГђвЂ”ГђВ°ГђВєГ‘в‚¬Г‘вЂ№Г‘вЂљГ‘Е’',
    'get':'ГђЕёГђВѕГђВ»Г‘Ж’Г‘вЂЎГђВёГ‘вЂљГђВµ Г‘ВЃГђВІГђВѕГђВё ГђВєГђВЅГђВѕГђВїГђВєГђВё',
    'share':'ГђЕёГђВѕГђВґГђВµГђВ»ГђВёГ‘вЂљГђВµГ‘ВЃГ‘Е’ Г‘ВЃ ГђВґГ‘в‚¬Г‘Ж’ГђВ·Г‘Е’Г‘ВЏГђВјГђВё!',
    'bookmark':'ГђВЎГђВєГђВѕГђВїГђВёГ‘в‚¬Г‘Ж’ГђВ№Г‘вЂљГђВµ ГђВё ГђВґГђВѕГђВ±ГђВ°ГђВІГ‘Е’Г‘вЂљГђВµ Г‘ВЌГ‘вЂљГ‘Ж’ Г‘ВЃГ‘ВЃГ‘вЂ№ГђВ»ГђВєГ‘Ж’ ГђВІ ГђвЂ”ГђВ°ГђВєГђВ»ГђВ°ГђВґГђВєГђВё',
    'buy':'ГђЕЎГ‘Ж’ГђВїГђВёГ‘вЂљГ‘Е’'
  };

  pluso.lang['en'] = {
    'close':'Close',
    'get':'Get Your Buttons',
    'share':'Share With Friends!',
    'bookmark':'Copy the link and paste to your Bookmarks',
    'buy':'Buy',

    'titles': {
      'vkontakte':'VKontakte',
      'odnoklassniki':'Odnoklassniki',
      'moimir':'MoiMir@Mail.Ru',
      'bobrdobr':'BobrDobr',
      'vkrugu':'VKruguDruzei',
      'yandex':'ya.ru',
      'yazakladki':'Yandex.Bookmarks',
      'moikrug':'MoiKrug',
      'googlebookmark':'Google Bookmarks',
      'yahoo':'Yahoo Bookmarks',
      'moemesto':'MoeMesto',
      'bookmark':'Add to Favorite',
      'email':'Send by E-mail',
      'print':'Print'
    }
  };


pluso.css=[[["",".pluso"],"position:relative;z-index:1;display:inline-block;padding:0;-webkit-border-radius:22px;-moz-border-radius:22px;border-radius:22px;background:transparent;text-align:left;font-size:0;line-height:0;*display:inline;*zoom:1;"]
,[["", ".pluso span"], "float:none;"]
,[["0","a:active"]," opacity:.6; "]
,[[32,".pluso-wrap a"],"display:inline-block;vertical-align:inherit;margin:5px 0 0 5px;padding:0;width:40px;height:40px;background:url({i}/img/pluso-like/round/big/04.png) 0 0 transparent no-repeat;"]
,[[64,".pluso-wrap a"],"display:inline-block;vertical-align:inherit;margin:3px 0 0 3px;padding:0;width:20px;height:20px;background:url({i}/img/pluso-like/round/small/04.png) 0 0 transparent no-repeat;"]
,[[16,".pluso-wrap a"],"display:inline-block;vertical-align:inherit;margin:3px 0 0 3px;padding:0;width:30px;height:30px;background:url({i}/img/pluso-like/round/medium/04.png) 0 0 transparent no-repeat;"]
,[["", ".pluso-wrap"], "margin:0px !important;"]
,[["0",".pluso-wrap"],"position:relative;z-index:1;display:inline-block;padding:0 5px 5px 0;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;background:{bb};text-align:left;font-size:0;line-height:0;*display:inline;*zoom:1;"]
,[[64,".pluso-wrap"],"padding:0 3px 3px 0px;"]
,[[66,".pluso-wrap"],"-webkit-border-radius:12px;-moz-border-radius:12px;border-radius:12px;"]
,[[16,".pluso-wrap"],"padding:0 3px 3px 0px;"]
,[[18,".pluso-wrap"],"-webkit-border-radius:12px;-moz-border-radius:12px;border-radius:12px;"]
,[[34,".pluso-wrap"],"-webkit-border-radius:22px;-moz-border-radius:22px;border-radius:22px;"]
,[[544,""],"width:50px;"]
,[[800,""],"width:95px;"]
,[[576,""],"width:26px;"]
,[[528,""],"width:36px;"]
,[[832,""],"width:49px;"]
,[[784,""],"width:69px;"]
,[[32,"a.pluso-more"],"width:40px;height:40px;background:url({i}/img/plus.png) 0 -60px no-repeat!important;position:relative;"]
,[[64,"a.pluso-more"],"width:20px;height:20px;background:url({i}/img/plus.png) 0 0 no-repeat!important;position:relative;"]
,[[16,"a.pluso-more"],"width:30px;height:30px;background:url({i}/img/plus.png) 0 -25px no-repeat!important;position:relative;"]
,[[1280, ".pluso-wrap a"], "float:left;text-align:middle;"]
,[[2048, ".pluso-wrap > div"], "cursor:default;display:inline-block;text-decoration:none !important;color:white;"]
,[[2048, ".pluso-wrap a"], "margin:0px;"]
,[[2048, ".pluso-wrap div b"], "float:right;font-weight:normal;color:white;"]
,[[2080, ".pluso-wrap > div"], "border-radius:6px;margin-right:4px;"]
,[[2080, ".pluso-wrap a"], "width:40px;"]
,[[2080, ".pluso-wrap div b"], "padding-left:5px;padding-right:10px;font-size:16px;line-height:40px;"]
,[[2064, ".pluso-wrap >div"], "border-radius:4px;margin-right:3px;height:30px;"]
,[[2064, ".pluso-wrap a"], "margin:2px;"]
,[[2064, ".pluso-wrap div b"], "padding-right:3px;font-size:12px;line-height:30px;"]
,[[2112, ".pluso-wrap >div"], "border-radius:3px;margin-right:3px;height:20px;"]
,[[2112, ".pluso-wrap a"], "margin:1px;"]
,[[2112, ".pluso-wrap div b"], "padding-right:3px;font-size:11px;line-height:20px;"]
,[[576,"a.pluso-more"],"margin-bottom:-12px;*left:5px;"]
,[[832,"a.pluso-more"],"margin-left:13px;*left:13px;"]
,[[832,".pluso-wrap a:nth-child(even).pluso-more"],"margin-left:3px;margin-bottom:0px"]
,[[1216,"a.pluso-more"],"margin-right:-12px;*left:5px;"]
,[[1344,"a.pluso-more"],"margin-right:-12px;top:-12px;*left:auto;"]
,[[528,"a.pluso-more"],"margin-bottom:-12px;*left:5px;"]
,[[784,"a.pluso-more"],"margin-left:18px;*left:18px;"]
,[[784,".pluso-wrap a:nth-child(even).pluso-more"],"margin-left:3px;margin-bottom:0px;"]
,[[1280,".pluso-wrap a:nth-child(even).pluso-more"], "top: 0px;"]
,[[1168,"a.pluso-more"],"margin-right:-12px;*left:5px;"]
,[[1296,"a.pluso-more"],"margin-right:-18px;top:-17px;*left:auto;"]
,[[1296,".pluso-wrap a:nth-child(even).pluso-more"],"top:inherit;"]
,[[544,"a.pluso-more"],"margin-bottom:-22px;*left:5px;"]
,[[800,"a.pluso-more"],"margin-left:27px;*left:27px;"]
,[[800,".pluso-wrap a:nth-child(even).pluso-more"],"margin-left:5px;margin-bottom:0px;"]
,[[1056,"a.pluso-more"],"margin-right:-22px;*left:5px;"]
,[[1312,"a.pluso-more"],"top:-22px;*left:auto;"]
,[[1312,".pluso-wrap a:nth-child(even).pluso-more"],"top:inherit;"]
,[[64,".pluso-counter b"],"position:relative;padding:2px 4px;-webkit-border-radius: 22px;-moz-border-radius: 22px;border-radius: 22px;background:{bc};box-shadow:0 0 3px rgba(0,0,0,.3);color:{bt};white-space: nowrap;font:11px\/12px Tahoma, Geneva, sans-serif!important;"]
,[[1088,".pluso-counter"],"position:relative;padding-right:18px;"]
,[[1088,".pluso-counter b"],"top:-6px;left:18px;"]
,[[1344,".pluso-counter b"],"top:-16px;left:18px;"]
,[[1088,".pluso-counter b:after"],"position: absolute;top: 5px;left: -6px;z-index: 0;display: block;width: 0;border-width: 4px 8px 4px 0;border-style: solid;border-color: transparent {bc};content: '';"]
,[[576,".pluso-counter"],"position:relative;display:block;margin-top:20px;width:100%;text-align:center;"]
,[[576,".pluso-counter:after"],"position: absolute;top: -5px;left: 50%;margin-left:-4px;z-index: 10;display: block;width: 0;border-width: 0 4px 8px;border-style: solid;border-color: {bc} transparent;content: '';"]
,[[16,".pluso-counter b"],"position:relative;padding:6px 8px;-webkit-border-radius: 30px;-moz-border-radius: 22px;border-radius: 30px;background:{bc};box-shadow:0 0 3px rgba(0,0,0,.3);color:{bt};white-space: nowrap;font:12px\/14px Tahoma, Geneva, sans-serif!important;"]
,[[1040,".pluso-counter"],"position:relative;padding-right:18px;"]
,[[1040,".pluso-counter b"],"top:-10px;left:18px;"]
,[[1296,".pluso-counter b"],"top:-27px;left:23px;"]
,[[1040,".pluso-counter b:after"],"position: absolute;top: 9px;left: -6px;z-index: 0;display: block;width: 0;border-width: 4px 8px 4px 0;border-style: solid;border-color: transparent {bc};content: '';"]
,[[528,".pluso-counter"],"position:relative;display:block;margin-top:20px;width:100%;text-align:center;"]
,[[528,".pluso-counter:after"],"position: absolute;top: -10px;left: 50%;margin-left:-4px;z-index: 10;display: block;width: 0;border-width: 0 4px 8px;border-style: solid;border-color: {bc} transparent;content: '';"]
,[[32,".pluso-counter b"],"position:relative;padding:8px 12px;-webkit-border-radius: 22px;-moz-border-radius: 22px;border-radius: 122px;background:{bc};box-shadow:0 0 3px rgba(0,0,0,.3);color:{bt};white-space:nowrap;font:16px\/40px Tahoma, Geneva, sans-serif!important;"]
,[[1056,".pluso-counter"],"position:relative;padding-right:28px;"]
,[[1056,".pluso-counter b"],"top:-14px;left:28px;"]
,[[1312,".pluso-counter b"],"top:-35px;left:28px;"]
,[[1056,".pluso-counter b:after"],"position: absolute;top: 13px;left: -8px;z-index: 0;display: block;width: 0;border-width: 5px 9px 5px 0;border-style: solid;border-color: transparent {bc};content: '';"]
,[[544,".pluso-counter"],"position:relative;display:block;margin-top:30px;width:100%;text-align:center;"]
,[[544,".pluso-counter:after"],"position: absolute;top: -8px;left: 50%;margin-left:-4px;z-index: 10;display: block;width: 0;border-width: 0 5px 11px;border-style: solid;border-color: {bc} transparent;content: '';"]
,[[128,"br"]," display:none; "]
,[[4,".pluso-counter"]," display:none; "]
,[["",".pluso-box"],"position:absolute;border:4px solid #eaebea;width:310px;height:225px;overflow:hidden;z-index: 777;background:#f2f2f2;font:normal normal 12px\/25px Tahoma, Geneva, sans-serif;box-shadow:0 4px 10px rgba(0, 0, 0, 0.4);text-align:left;-webkit-border-radius:14px;-moz-border-radius:14px;border-radius:14px;"]
,[["",".pluso-box a b"],"width:20px;height:20px;position:absolute;left:0;top:2px;"]
,[["",".pluso-box a:visited,.pluso-box a:hover,.pluso-box a"],"font:normal normal 12px\/25px Tahoma, Geneva, sans-serif;color:#7f7f7f;text-decoration:none;white-space:nowrap;padding:0 0 0 25px;margin:0 0 0 5px;border:0;position:relative;width:115px;float:left;"]
,[["",".pluso-box .pluso-list"],"background:#ffffff;border-radius:14px;width:100%;height:200px;overflow:auto;position:absolute;left:0;top:25px;"]
,[["",".pluso-box a.pluso-logo"],"background:url({i}/img/pluso-like/logo-mini.png) 0 5px no-repeat;width:66px;height:19px;border:0;text-indent:-600em;padding:0 0 0 12px;margin:0 0 0 9px;"]
,[["",".pluso-box a.pluso-go"],"color:#4c4c4c;text-decoration:underline;padding-left:0;"]
,[["",".pluso-box a.pluso-close,.pluso-box a.pluso-close:hover,.pluso-box a.pluso-close:visited"],"float:right;width:20px;text-align:center;font-size:12px;line-height:20px;width:20px;margin:1px 1px 0 0;padding:0;font-weight:bold;color:#4c4c4c;text-decoration:none;background:#ffffff;border-radius:15px;border:1px solid #eaebea;"]
,[["",".pluso-box a.pluso-close:hover"],"background:#7f7f7f;color:#ffffff;border-color:transparent"]
,[["",".pluso-tip"],"cursor:pointer;position:absolute;padding:10px;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;white-space:nowrap;font:bold 14px/12px Tahoma, Geneva, sans-serif!important;color:#fff;background:#f78d1d;background:-webkit-gradient(linear, left top, left bottom, from(#7ed263), to(#3d9530));background:-webkit-linear-gradient(top,#7ed263,#3d9530);background:-moz-linear-gradient(top,#7ed263,#3d9530);background:-ms-linear-gradient(top,#7ed263,#3d9530);background:-o-linear-gradient(top,#7ed263,#3d9530);background:linear-gradient(top,#7ed263,#3d9530);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#7ed263, endColorstr=#3d9530);box-shadow:0 0 5px rgba(0,0,0,.5), inset 0 0 0px 1px rgba(0,0,0,.3)"]
,[["",".pluso-tip:after"],"position:absolute;z-index:0;display:block;width:0;height:0;border-style: solid;content:''"]
,[["",".pluso-tip.pluso-left-arrow:after"],"top:40%;right:-6px;border-color:transparent #447b36;border-width:6px 0px 6px 6px"]
,[["",".pluso-tip.pluso-top-arrow:after"],"bottom:-6px;border-color:#27601f transparent;border-width:6px 6px 0px 6px"]
,[["",".pluso-tip.pluso-bottom-arrow:after"],"top:-6px;border-color:#447b36 transparent;border-width:0px 6px 6px 6px"]
,[["","@keyframes pluso-market-animate"],"0% { opacity:1 } 50%{ opacity:.3} 100% { opacity:1}"]
,[["","@-webkit-keyframes pluso-market-animate"],"0% { opacity:1 } 50%{ opacity:.3} 100% { opacity:1}"]
,[["",".pluso-overlay-background"],"height:100%;width:100%;position:fixed;left:0;top:0;z-index:999999999;background-color: rgb(0, 0, 0);background-color: rgba(0, 0, 0, 0.6);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);-ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)\";padding:0;margin:0;"]
,[["",".pluso-overlay-box"],"width:910px;margin: 50px auto 0;overflow:hidden;height:85%;background-color: #f5f5f5;border:1px solid #c4c4c4;padding:0!important;text-align:left;box-shadow:0 4px 12px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.5) inset;border-radius:10px;"]
,[["","a.pluso-overlay-close,a.pluso-overlay-close:hover,a.pluso-overlay-close:visited"],"position:absolute;left:50%;margin:0 0 0 442px;top:38px;width:26px;height:26px;text-align:center;font:normal 20px/22px Arial;padding:0;color:#878787;text-decoration:none;background:#ffffff;border-radius:26px;border:2px solid #c4c4c4;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"]
,[["","a.pluso-overlay-close:hover"],"background:#7f7f7f;color:#ffffff;border-color:transparent"]
,[["",".pluso-overlay-box div"],"margin:20px 0 0 0;padding:0 0 12px 0;border-bottom:1px solid #c4c4c4;"]
,[["",".pluso-overlay-box ul"],"list-style:none;margin:10px 0 10px 0px;padding:0;height:85%;overflow:auto;"]
,[["",".pluso-overlay-box li"],"width:210px;height:260px;background:#ffffff;border-radius:10px;border:none;float:left;padding:0;margin:0 0px 10px 10px;"]
,[["",".pluso-overlay-box li a"],"display:block;text-decoration:none;margin:0;padding:0;height:100%;overflow:hidden;position:relative;"]
,[["",".pluso-overlay-box li a span, .pluso-overlay-box li a:hover span"],"position: relative;width: 190px;height:150px;border:1px solid #c4c4c4;overflow:hidden;margin:10px auto 5px auto;padding:0;text-align:center;display:block;"]
,[["",".pluso-overlay-box li a:hover span"],"box-shadow:0 0 5px #c4c4c4;-webkit-box-shadow:0 0 5px #c4c4c4;border:1px solid #c4c4c4"]
,[["",".pluso-overlay-box li a em"],"font:normal bold 15px\/20px Arial;float:left;color:#e86340;padding:0px 0 0 10px;margin:0;"]
,[["",".pluso-overlay-box li a em u"],"font:normal normal 12px\/12px Arial;text-decoration:none;display:block;color:#eb6338;padding:0;margin:0;"]
,[["",".pluso-overlay-box li a strong"],"font:normal 11px\/14px Arial;display:block;padding:0 10px;color:#454545;position:relative;bottom:auto;height:42px;width:180px;overflow:hidden;margin:0 0 5px 0;border:0;"]
,[["",".pluso-overlay-box li a:hover strong"],"height:42px;overflow:auto;padding:0 10px;border:0;"]
,[["",".pluso-overlay-box li a b, .pluso-overlay-box li a b:hover, .pluso-overlay-box li a b:active"],"font:bold normal 15px\/18px Arial, sans-serif;color: #ffffff;padding-top: 7px;padding-right: 12px;padding-bottom: 7px;padding-left: 12px;text-decoration: none;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;-webkit-box-shadow: inset 0px -1px 2px rgba(255,255,255,.5);-moz-box-shadow: inset 0px -1px 2px rgba(255,255,255,.5);box-shadow: inset 0px -1px 2px rgba(255,255,255,.5);text-shadow: 0px 1px 2px #3d8a33;border:solid #4bb543 1px;background:-webkit-gradient(linear, 0 0, 0 100%, from(#95e488), to(#20a517));background: -moz-linear-gradient(top, #95e488, #20a517);background: -o-linear-gradient(top, #95e488, #20a517);-ms-filter: progid:DXImageTransform.Microsoft.gradient(startColorStr=#95e488, endColorStr=#20a517);filter: progid:DXImageTransform.Microsoft.gradient(startColorStr=#95e488, endColorStr=#20a517);display:inline-block;float:right;bottom:auto;right:10px;position:relative;"]
,[["",".pluso-overlay-box li a b:hover"],"background:-webkit-gradient(linear, 0 0, 0 100%, from(#b1f4a3), to(#27c21c));background: -moz-linear-gradient(top, #b1f4a3, #27c21c);background:-o-linear-gradient(top, #b1f4a3, #27c21c);-ms-filter: progid:DXImageTransform.Microsoft.gradient(startColorStr=#b1f4a3, endColorStr=#27c21c);filter: progid:DXImageTransform.Microsoft.gradient(startColorStr=#b1f4a3, endColorStr=#27c21c);"]
,[["",".pluso-overlay-box li a b:active"],"background:-webkit-gradient(linear, 0 0, 0 100%, from(#20a517), to(#95e488));background: -moz-linear-gradient(top, #20a517, #95e488);background:-o-linear-gradient(top, #20a517, #95e488);-ms-filter: progid:DXImageTransform.Microsoft.gradient(startColorStr=#20a517, endColorStr=#95e488);filter: progid:DXImageTransform.Microsoft.gradient(startColorStr=#20a517, endColorStr=#95e488);"]];

  pluso.tree = [
    ['sepcounter',
     'horizontal','vertical',
     'multiline','line',
     'small','big','medium',
     'counter','nocounter',
     'round','square'
    ],
    {
     horizontal:'vertical',
     multiline:'line',
     small:['big','medium'],
     counter:'nocounter',
     round:'square',

     vertical:'horizontal',
     line:'multiline',
     big:['small','medium'],
     nocounter:'counter',
     square:'round',
     medium:['small','big']
    },
    [
     ['round','square'],
     ['small','big','medium']
    ]
  ];

  // ordered list of services, titles, image offsets in sprite, id's and bg-colors
  pluso.titles = [
    ['vkontakte','ВКонтакте',5,3,'#41658b'],
    ['odnoklassniki','Одноклассники',4,4,'#f4960f'],
    ['facebook','Facebook',1,1,'#39579a'],
    ['twitter','Twitter',2,2,'#00abf0'],
    ['google','Google+',7,5,'#be3308'],
    ['moimir','Мой Мир@Mail.Ru',8,7,'#2f69a1'],
    ['readability','Readability',19,18,'#9d0000'],
    ['linkedin','LinkedIn',37,36,'#0072ab'],
    ['email','Ուղարկել այս հասցեն էլեկտրոնային մեյլով',23,27,'#5f32b0'],
    ['print','ГђЕёГђВµГ‘вЂЎГђВ°Г‘вЂљГђВ°Г‘вЂљГ‘Е’',24,28,'#0fae96']
  ];


  // buy buttons
  pluso.buy = ['cart','dollar', 'bulb', 'quest', 'tag']

  pluso.tips = [
   [
      'Гђ ГђВ°Г‘ВЃГђВїГ‘в‚¬ГђВѕГђВґГђВ°ГђВ¶ГђВ°!',
      'ГђВ­Г‘вЂљГђВѕ ГђВјГђВѕГђВ¶ГђВµГ‘вЂљ ГђВ±Г‘вЂ№Г‘вЂљГ‘Е’ ГђвЂ™ГђВ°ГђВј ГђВёГђВЅГ‘вЂљГђВµГ‘в‚¬ГђВµГ‘ВЃГђВЅГђВѕ!',
      'ГђвЂєГ‘Ж’Г‘вЂЎГ‘Л†ГђВёГђВµ Г‘вЂљГђВѕГђВІГђВ°Г‘в‚¬Г‘вЂ№ Г‘ВЃГђВѕ Г‘ВЃГђВєГђВёГђВґГђВєГђВѕГђВ№!',
      'ГђВЎГђВїГђВµГ‘вЂ ГђВїГ‘в‚¬ГђВµГђВґГђВ»ГђВѕГђВ¶ГђВµГђВЅГђВёГ‘ВЏ ГђВѕГ‘вЂљ ГђВёГђВЅГ‘вЂљГђВµГ‘в‚¬ГђВЅГђВµГ‘вЂљ-ГђВјГђВ°ГђВіГђВ°ГђВ·ГђВёГђВЅГђВѕГђВІ!',
      'ГђВЎГђВ°ГђВјГ‘вЂ№ГђВµ ГђВїГ‘в‚¬ГђВѕГђВґГђВ°ГђВІГђВ°ГђВµГђВјГ‘вЂ№ГђВµ Г‘вЂљГђВѕГђВІГђВ°Г‘в‚¬Г‘вЂ№!',
      'ГђвЂєГ‘ЕЅГђВ±Г‘вЂ№ГђВµ Г‘вЂљГђВѕГђВІГђВ°Г‘в‚¬Г‘вЂ№ ГђВїГђВѕ ГђВ»Г‘Ж’Г‘вЂЎГ‘Л†ГђВёГђВј Г‘вЂ ГђВµГђВЅГђВ°ГђВј!',
      'ГђЕёГђВѕГђВїГ‘Ж’ГђВ»Г‘ВЏГ‘в‚¬ГђВЅГ‘вЂ№ГђВµ Г‘вЂљГђВѕГђВІГђВ°Г‘в‚¬Г‘вЂ№ ГђВїГђВѕ ГђВ»Г‘Ж’Г‘вЂЎГ‘Л†ГђВёГђВј Г‘вЂ ГђВµГђВЅГђВ°ГђВј!',
      'ГђЕёГђВѕГђВїГ‘Ж’ГђВ»Г‘ВЏГ‘в‚¬ГђВЅГ‘вЂ№ГђВµ Г‘вЂљГђВѕГђВІГђВ°Г‘в‚¬Г‘вЂ№ Г‘ВЃГђВѕ Г‘ВЃГђВєГђВёГђВґГђВєГђВѕГђВ№!',
      'ГђВўГђВѕГђВІГђВ°Г‘в‚¬Г‘вЂ№ ГђВґГђВ»Г‘ВЏ ГђВєГђВѕГђВјГ‘вЂћГђВѕГ‘в‚¬Г‘вЂљГђВЅГђВѕГђВ№ ГђВ¶ГђВёГђВ·ГђВЅГђВё Г‘ВЃГђВѕ Г‘ВЃГђВєГђВёГђВґГђВєГђВѕГђВ№!',
      'ГђВЎГђВ°ГђВјГ‘вЂ№ГђВµ ГђВІГђВѕГ‘ВЃГ‘вЂљГ‘в‚¬ГђВµГђВ±ГђВѕГђВІГђВ°ГђВЅГђВЅГ‘вЂ№ГђВµ Г‘вЂљГђВѕГђВІГђВ°Г‘в‚¬Г‘вЂ№ Г‘ВЃГђВѕ Г‘ВЃГђВєГђВёГђВґГђВєГђВѕГђВ№!',
      'ГђВќГђВѕГђВІГђВёГђВЅГђВєГђВё ГђВѕГ‘вЂљ ГђВёГђВЅГ‘вЂљГђВµГ‘в‚¬ГђВЅГђВµГ‘вЂљ-ГђВјГђВ°ГђВіГђВ°ГђВ·ГђВёГђВЅГђВѕГђВІ!',
      'ГђвЂєГ‘Ж’Г‘вЂЎГ‘Л†ГђВёГђВµ Г‘вЂ ГђВµГђВЅГ‘вЂ№ ГђВѕГ‘вЂљ ГђВёГђВЅГ‘вЂљГђВµГ‘в‚¬ГђВЅГђВµГ‘вЂљ-ГђВјГђВ°ГђВіГђВ°ГђВ·ГђВёГђВЅГђВѕГђВІ!',
      'ГђвЂГђВµГ‘ВЃГ‘вЂљГ‘ВЃГђВµГђВ»ГђВ»ГђВµГ‘в‚¬Г‘вЂ№ ГђВѕГ‘вЂљ ГђВёГђВЅГ‘вЂљГђВµГ‘в‚¬ГђВЅГђВµГ‘вЂљ-ГђВјГђВ°ГђВіГђВ°ГђВ·ГђВёГђВЅГђВѕГђВІ!',
      'ГђвЂГђВµГ‘ВЃГ‘вЂљГ‘ВЃГђВµГђВ»ГђВ»ГђВµГ‘в‚¬Г‘вЂ№ ГђВїГђВѕ ГђВ»Г‘Ж’Г‘вЂЎГ‘Л†ГђВёГђВј Г‘вЂ ГђВµГђВЅГђВ°ГђВј!',
      'ГђВќГђВѕГђВІГђВёГђВЅГђВєГђВё ГђВїГђВѕ ГђВ»Г‘Ж’Г‘вЂЎГ‘Л†ГђВёГђВј Г‘вЂ ГђВµГђВЅГђВ°ГђВј!'
   ],
   {
     'big':{'top':'top:-38px;left:10px', 'left':'top:9px;right:5px', 'bottom':'top:57px;left:10px'},
     'medium':{'top':'top:-38px;left:2px', 'left':'top:0px;right:5px', 'bottom':'top:42px;left:2px'},
     'small':{'top':'top:-38px;left:-3px', 'left':'top:-5px;right:5px', 'bottom':'top:32px;left:-3px'}
   }
  ]

  // services names and positions for pluso.titles
  pluso.services = false;

  // loaded themes indicator
  pluso.sets = {}

  // counters for all button sets
  pluso.counter = {}
  pluso.counters = {}
  pluso.sepcounters = {}
  pluso.advs = false;
  pluso.user = false;

  pluso.offsets = {
    'small':21,
    'medium':31,
    'big':42
  };


  pluso.tabbed = [
    'livejournal',
    'liveinternet',
    'stumbleupon',
    'bobrdobr',
    'evernote',
    'instapaper',
    'digg'
  ];

  pluso.defaults={
    options:{
      horizontal:1,
      line:1,
      small:1,
      counter:1,
      round:1,
      theme:'04',
      sepcounter: 0
    },

    services: [],

    params: {
      background:'#eaeaea',
      baloon:'#eaeaeb',
      text:'#707070',

      url:w.location.href.split('#')[0],
      title:d.title,
      image:'',
      description: d.getElementsByName('description')[0]?d.getElementsByName('description')[0].content:'',
      user:0,
      lang:'ru'
    }
  };


  pluso.html = function(elem, debug)
  {
      if (elem.pluso) return false;
      if (elem.className.split(' ').indexOf('pluso-skip')>-1) return false;

      var ep=elem.pluso=cloned(pluso.defaults);

      function unset(key)
      {
        if(!key) return;
        if (arrayed(key))
        {
          for (var i=0;i<key.length;i++) unset(key[i]);
        }
        else
        {
          delete ep.options[key];
        }
      }

      var options = elem.getAttribute("data-options");

      if (options) options.split(',').map( function(a){
        k=a.split('=');

        //old style
        if(arrayed(k) && (k.length>1))
        {
          if (k[1]=='0')
          {
            var i=pluso.tree[1][k[0]];
            if(arrayed(i)) i=i[0];

            k=[i, 1];
          }
        }
        else
        {
          k=[k[0], 1];
        }

        unset(pluso.tree[1][k[0]]);
        return ep.options[k[0]]=k[1];
      });

      var services = elem.getAttribute("data-services");
      if (services) ep.services=services.split(',');

      iterate(ep.params, function(key, obj){
           var value = elem.getAttribute("data-"+key);
           if (value) obj[key]=value;
      });


      if (ep.params.url.split('://').length<2) ep.params.url=prot + '://' + ep.params.url;
      if( (ep.params.url.indexOf('#') == -1) && (ep.params.url.split('/').length<4) ) ep.params.url+='/';

      var opt=[], uniq=[], o=ep.options, j, num;

      //calculate option mask and uniq number
      pluso.tree[0].map(function(key){
        j=(typeof o[key]!='undefined' && o[key]=='1')?'1':'0';
        if (j>0) opt.push(key);

        uniq.push(j);
      });

      uniq=uniq.join('');
      num=parseInt(uniq,2);

      uniq='pluso-'+uniq+'-'+ o.theme;

      opt.push('t'+o.theme);

      var reps = {'u':u, 'i':u, 'bb':ep.params.background, 'bc':ep.params.baloon, 'bt':ep.params.text};

      var html=['<div class="'+ uniq + (debug?' ' + opt.join(' '):'') +'">'], css=[], p, m;

      var replacer = function(p){

        return p.replace(/\{(\w+)\}/g, function(s, key) {
          return reps[key] || s;
        })
      }


      var x=pluso.offsets[osize(o)];

      // create css
      if (typeof pluso.sets[uniq]=='undefined')
      {
        for(var i=0;i<pluso.css.length;i++)
        {
          p = pluso.css[i];

          if ( ((p[0][0]=='') && !pluso.services) || ((num & p[0][0]) == p[0][0]) )
          {
            css.push((p[0][0]==''?'':'.'+uniq+' ')+p[0][1]+'{'+replacer(p[1])+'}\n');
          }
        }

        // service image for current combination of styles
        p=[];
        for(var i=0;i<pluso.tree[2].length;i++)
        {
          for (var j=0;j<pluso.tree[2][i].length;j++)
          {
            if (o[pluso.tree[2][i][j]] && (o[pluso.tree[2][i][j]]!=0))
            {
              p.push(pluso.tree[2][i][j]);
              continue;
            }
          }
        }

        css.push('.'+uniq+' .pluso-wrap a{ background-image:url('+u+'/img/pluso-like/'+p.join('/')+'/'+o['theme']+'.png) }');

        for(var i=0;i<pluso.buy.length;i++)
        {
          css.push('.'+uniq+' .pluso-wrap a.pluso-market-'+pluso.buy[i]+', .'+uniq+' .pluso-wrap a.pluso-market-'+pluso.buy[i]+'-animate{ background:url('+u+'/img/pluso-like/'+p.join('/')+'/market.png) -'+(i*x)+'px 0}');
          css.push('.'+uniq+' .pluso-wrap a.pluso-market-'+pluso.buy[i]+'-animate{animation: pluso-market-animate 3s linear infinite alternate;-webkit-animation: pluso-market-animate 3s linear infinite alternate;}');
        }
      }

      // services styles for popup box
      if (!pluso.services)
      {
        pluso.services={};
        css.push('.pluso-box a b{ background-image:url('+u+'/img/pluso-like/round/small/04.png) }');
        css.push('.pluso-box a.pluso-market b{ background:url('+u+'/img/pluso-like/round/small/market.png) -21px 0}');

        for(var i=0,l=pluso.titles.length;i<l;i++)
        {
          p = pluso.titles[i];
          pluso.services[p[0]]=i;
          css.push('.pluso-box a.pluso-'+p[0]+' b{ background-position: -'+((p[2]-1)*pluso.offsets.small)+'px 0}');
        }
      }


      html.push('<span class="pluso-wrap" style="background:'+ep.params.background+'">');

      for(var i=0,l=ep.services.length,q=l/2;i<l;i++)
      if (typeof pluso.services[ep.services[i]]!='undefined')
      {
         p = pluso.titles[pluso.services[ep.services[i]]];
         pt = lang(elem, p[0], p[1]);

         var st = '';
         if (o.horizontal>0 && o.multiline>0 && (o.multiline!=2) && (i>=q))
         {
           o.multiline=2
           st = "clear:both;"
         }

         var serv = '<a href="'+ep.params.url+'" title="'+pt+'" class="pluso-'+p[0]+'"'+(p[0]=='bookmark'?' rel="sidebar"':'')+(st!=''?'style="'+st+'"':'')+'></a>';
         if(o.sepcounter==1){
          var servWrapper = d.createElement('div');
          servWrapper.style.background = p[4];
          var sc = pluso.sepcounters[p[0]] || 0;
          servWrapper.innerHTML = serv + '<b title = "'+sc+'">'+sc+'</b>';
          serv = servWrapper.outerHTML;
         }
         html.push(serv);

         // service image offset
         if(!pluso.sets[uniq] || (pluso.sets[uniq].indexOf(p[0]<0)) )
         {
            css.push('.'+uniq+' .pluso-wrap a.pluso-'+p[0]+'{ background-position: -'+((p[2]-1)*x)+'px 0}');

            if (!pluso.sets[uniq]) pluso.sets[uniq]=[];
            pluso.sets[uniq].push(p[0]);
         }

      }

      //html.push('<a href="'+prot+'://pluso.ru/" class="pluso-more"></a>');
      html.push('</span>');

      if (o.counter<-5)
      html.push('<span class="pluso-counter"><b>'+(pluso.counter[ep.params.url] || '0')+'</b></span>');

      html.push('</div>');


      if (!pluso.sets[uniq]) pluso.sets[uniq] = [];

      return {'html':html.join(''), 'css':css.join('')};
  }

  pluso.styles = function(r)
  {
    var ret=[];

    ['small','big','medium'].map(function(sze)
    {
      ['round','square'].map(function(frm)
      {
          for (var j=1;j<15;j++)
          {
            var thm=((j<10)?'0':'')+j;

            ret.push('.pluso .'+sze+'.'+frm+'.t'+thm+' .pluso-wrap a{ background-image:url('+u+'/img/pluso-like/'+([frm,sze,thm].join('/'))+'.png) }');
            for(var i=0,l=pluso.titles.length;i<l;i++)
            {
              p = pluso.titles[i];
              ret.push('.pluso .'+sze+'.'+frm+'.t'+thm+' .pluso-wrap a.pluso-'+p[0]+'{ background-position: -'+((p[2]-1)*pluso.offsets[sze])+'px 0}');
            }
          };
      });
    });

    ret=ret.join("");

    return r?ret:styled(ret);
  }


  pluso.click = function(elem, menu)
  {
    return function(e)
      {
        if (!e) var e=window.event;
        var t=(e.target||e.srcElement);
        if(t.tagName=='B') t=t.parentNode;

        if(t.tagName=='A')
        {
          if (t.className.substr(0,12)=='pluso-market')
          {
            pluso.process("market", elem);
            var o=document.createElement('div');
            o.className='pluso-overlay-background';

            var oc=document.createElement('a');
            oc.href="#close";
            oc.className='pluso-overlay-close';
            oc.innerHTML='&times;';
            oc.onclick=function(e){ o.parentNode.removeChild(o); return false}

            o.appendChild(oc);

            var box=document.createElement('div');
            box.className='pluso-overlay-box';

            html = [];
            html.push('<div><a target="_blank" href="//market.pluso.ru?newmarket" style="margin:0 0 0 20px;padding:0;text-decoration:none"><img src="'+u+'/img/pluso-like/logo-market.png" border="0" width="300" height="30" alt="Pluso ГђЕ“ГђВ°Г‘в‚¬ГђВєГђВµГ‘вЂљ"></a><a target="_blank" href="//market.pluso.ru/" style="float:right;margin:3px 20px 0 0;text-align:right;font:bold normal 20px/26px Arial;text-decoration:none;color:#848484;width:550px">ГђвЂєГ‘Ж’Г‘вЂЎГ‘Л†ГђВёГђВµ Г‘вЂљГђВѕГђВІГђВ°Г‘в‚¬Г‘вЂ№ ГђВїГђВѕ Г‘ВЃГђВ°ГђВјГ‘вЂ№ГђВј ГђВІГ‘вЂ№ГђВіГђВѕГђВґГђВЅГ‘вЂ№ГђВј Г‘вЂ ГђВµГђВЅГђВ°ГђВј!</a></div>');
            html.push('<ul id="pluso-market-placeholder"></ul>');
            box.innerHTML = html.join('');

            o.appendChild(box);
            o.onclick=function(e) {
              if (!e) var e=window.event;
              var t=(e.target||e.srcElement);
              if(t.className=='pluso-overlay-background') o.parentNode.removeChild(o);
            }

            document.body.insertBefore(o, document.body.childNodes[0]);

            if (!t.clicked)
            {
              t.clicked=1;
              var ou='http://offers.pluso.ru/offers/'+elem.pluso.params.user+'/'+uid+'?callback=pluso.market&'+Math.random();
              js(ou, function(){t.clicked=0});
            }
          }
          else
          switch (t.className)
          {
            case 'pluso-more':
              pluso.more(pointed(e), elem);
            break;
            case 'pluso-promo':
            case 'pluso-logo':
            case 'pluso-go':
              pluso.process(t.className.substring(6), elem);
              return true;
            break;
            case 'pluso-close':
              elem.box.style.display="none";
            break;
            default:
              return pluso.share(t, elem, menu);
            break;
          }
        }

        return false;
      }
  }


  pluso.build=function (elem, debug)
  {
    var tt=pluso.html(elem, debug);
    if(!tt) return false;

    if (tt.css) styled(tt.css);
    elem.innerHTML=tt.html;

    if ( !( (elem.counter=elements('pluso-counter', elem)).length
         && (elem.counter=elem.counter[0][tags]('b')).length
         && (elem.counter=elem.counter[0]))
       )
    {
      elem.counter=d.createElement('b');
    }

    if(elem.pluso.options.sepcounter == '1') {
      for(var i in elem.pluso.services) {
        if(pluso.sepcounters[elem.pluso.services[i]]) {
          var serviceEl = elements('pluso-'+s, elem)[0]
          if(serviceEl){
            var serviceCounter = serviceEl.parentNode.getElementsByTagName('b')[0];
            serviceCounter.title = pluso.sepcounters[s];
            serviceCounter.inner = numk(pluso.sepcounters[s]);
          }
        }
        else {
          pluso.process('counter', elem, '&soc=1');
          break;
        }
      }
    }

    if (!pluso.counter[elem.pluso.params.url]) pluso.counter[elem.pluso.params.url]=0;

    elem.counter.title=pluso.counter[elem.pluso.params.url];
    elem.counter.innerHTML=numk(pluso.counter[elem.pluso.params.url]);

    if (!pluso.counters[elem.pluso.params.url]) pluso.counters[elem.pluso.params.url]=[];
    pluso.counters[elem.pluso.params.url].push(elem.counter);

    elem.onclick=pluso.click(elem, 0);

    /*var more=elements('pluso-more', elem)[0];
    more.onmouseover=function(e)
    {
      if (!e) var e=window.event;
      var xy=pointed(e);
      more.timer=setTimeout( function(){ pluso.more(xy, elem); }, 500);
    };
    more.onmouseout = function(){
      clearTimeout(more.timer);
    }*/

    return elem;
  }

  pluso.start = function(el)
  {
    pluso.screenWidth = null;
    pluso.screenHeight = null;

    if (parseInt(navigator.appVersion)>3) {
      pluso.screenWidth = screen.width;
      pluso.screenHeight = screen.height;
    }
    else if (navigator.appName == "Netscape" && parseInt(navigator.appVersion)==3 && navigator.javaEnabled()) {
      var jToolkit = java.awt.Toolkit.getDefaultToolkit();
      var jScreenSize = jToolkit.getScreenSize();
      pluso.screenWidth = jScreenSize.width;
      pluso.screenHeight = jScreenSize.height;
    }

    var el = el || elements('pluso');

    for(var ei=0,ll=el.length;ei<ll;ei++)
    {
      if (pluso.build(el[ei])) {
        var params = '';
        if(el[ei].pluso.options.sepcounter) params += '&soc=1';
        if(!pluso.cnt++) params += '&first=1';
        pluso.process('counter', el[ei], params);
        if(el[ei].getAttribute('data-user'))
          pluso.user = el[ei].getAttribute('data-user');
      }
    }
  }
  pluso.setCounter=function(c,url,buy,counters,advType){}

  pluso.share_readability = function() {
    js('http://www.readability.com/bookmarklet/save.js?r=' + Math.random() * 99999999);
  };

  pluso.share_print = function() {
    window.print();
  };

  pluso.share_email = function(ep) {
    var link = "mailto:?Subject="+ep.params.title+"&body="+encodeURIComponent(ep.params.url)+"%0A";
    window.open(link, 'mailto');
  };

  pluso.params = function(elem)
  {
    return 'u=' + encode(elem.pluso.params.url)
          + (pluso.screenWidth && pluso.screenHeight ? '&w=' + pluso.screenWidth + '&h='+ pluso.screenHeight : '')
          + '&ref=' + encode(d.referrer)
          + (elem.pluso.params.user>0?'&user=' + encode(elem.pluso.params.user):'')
          + '&uid=' + uid
          + '&k='+pluso.randomString(16);
  }

  pluso.share = function(t, elem, menu)
  {
    var sharer=t.className.substring(6),
        share = pluso["share_"+sharer],
        sharelink = pluso.sharelink(sharer, elem, menu);

    // increment counter for faster feedback without server call
    pluso.counter[elem.pluso.params.url]+=1;

    elem.counter.title=pluso.counter[elem.pluso.params.url];
    elem.counter.innerHTML=numk(pluso.counter[elem.pluso.params.url]);

    if(elem.pluso.options.sepcounter == '1'){
      
      var serviceClass = t.className
      if(!pluso.sepcounters[sharer])
        pluso.sepcounters[sharer] = 0;
      pluso.sepcounters[sharer] = parseInt(pluso.sepcounters[sharer]) + 1;

      var serviceCounter = t.parentNode.getElementsByTagName('b')[0];
      serviceCounter.title = pluso.sepcounters[sharer];
      serviceCounter.innerHTML = numk(pluso.sepcounters[sharer]);
      
    }

    if (typeof share == "function")
    {
      js(sharelink);

      if(window.opera && (sharer=='bookmark'))
      {
        t.href = elem.pluso.params.url;
        return true;
      }
      else
      {
        share(elem.pluso);
      }
    }
    else
    {
      if (!window.open(sharelink, sharer, pluso.tabbed.indexOf(sharer)==-1?'toolbar=0,status=0,resizable=1,width=626,height=436':'')) {
        w.location.href = sharelink;
      }
    }
    return false;
  }

  pluso.sharelink = function(sharer, elem, menu)
  {
    var k = d.getSelection, y = w.getSelection, x = d.selection;
    var s = (y ? y() : (k) ? k() : (x ? x.createRange().text : 0));

  return u+'/process?act=share&'+pluso.params(elem)+
           '&type=' + encode(sharer) +
           '&t=' + encode(elem.pluso.params.title) +
           '&s=' + encode(s||elem.pluso.params.description) +
           (elem.pluso.params.image?'&img=' + encode(elem.pluso.params.image):'') +
           (menu?'&menu=1':'');
  };


  // logo, go, menu, counter
  pluso.process = function (action, elem, params)
  {
    js('+process?act='+action+'&'+pluso.params(elem)+(params || ''));
  }

  // function for send click action

  pluso.randomString = function(length)
  {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (! length) {
      length = rnd(chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
      str += chars[rnd(chars.length)];
    }
    return str;
  };

  ready(function()
  {
    pluso.start();
    if (typeof pluso_ready == "function") pluso_ready();

  });


})(window, document);
