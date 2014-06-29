// ==UserScript==
// @name        SmallPonyScript
// @namespace   http://азъесмь.рф/*
// @version     0.14.88
// @include     азъесмь.рф/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// ==/UserScript==


var user_hide_list = GM_getValue("user_hide_list", "");

function applyCss() {
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = "\
#ps_small_panel { \
    position: fixed; bottom: 0px; right: 0px; \
    padding: 5px; \
background-color: #E0E0E0; \
} \
#ps_big_panel { \
    width: 150px;\
    position: fixed; \
    bottom: 0px; \
    right: 0px; \
    padding: 15px; \
background-color: #E0E0E0; \
}";
    document.body.appendChild(css);
}

function createSmallPanel() {
    var panel = document.createElement("div");
    panel.setAttribute("id", "ps_small_panel");
    $(panel).click(function() {
        console.log("show");
        $("#ps_big_panel").show();
        
    });
    panel.innerHTML = 'Настройки PS';
    $("body").append(panel);
}

function createBigPanel(text) {
    var panel = document.createElement("div");
    panel.setAttribute("id", "ps_big_panel");
    $(panel).hide();
    
    $(panel).append('Кого скрывать (указывать имена через пробел):');
    $(panel).append('<textarea id="ps_hide_text" cols="40" rows="3">' + (text ? text : "") + '</textarea>');
    $(panel).append('<div class="ps_button">Save</div>');
    
    $("body").append(panel);
    
    $(".ps_button").click(function() {
        $("#ps_big_panel").hide();
        user_hide_list = $("#ps_hide_text").val();
        GM_setValue("user_hide_list", user_hide_list);
        hideUser();
        location.reload();
    });
}

function selectNamedMessage(name) {
    msgs_txt = $("div.msg_txt");
    
    $.each(msgs_txt, function(i, msg_txt) {
       ind = msg_txt.innerHTML.indexOf("@" + name);
       if (ind != -1) {
           info = $(msg_txt).parent();
           
           msg_txt = $(info).parent()[0];
           msg_txt.style.boxShadow = "0px 0px 9px #888";
           msg_txt.style.border = '5px solid #679e72';
       }
    });
}

function hideUser() {
    if (user_hide_list) {
       $.each(user_hide_list.split(" "), function(i, u) {
          hideUser_(u);
       });
    }
}

function hideUser_(name) {
    name = "@" + name;
    
    msgs_info = $(".msg_info")
    $.each(msgs_info, function(i, msg_info) {
       info_username = $(msg_info).children(".username")[1];
        
       if (info_username.innerHTML == name) {
           info = $(msg_info).parent(".info")[0];
           msg = $(info).parent(".msg")[0];
           msg.innerHTML = "Hide " + name;
       }
    });
}

applyCss();

var user_name = $("#current-user")[0].innerHTML;

createBigPanel(user_hide_list);
createSmallPanel();

hideUser();
selectNamedMessage(user_name);
