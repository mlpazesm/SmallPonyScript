// ==UserScript==
// @name            SmallPonyScript
// @version         0.14.88
// @namespace       http://азъесмь.рф/
// @author          @млп (понилюб)
// @description     VerySmallPonyScript
// @include         http://азъесмь.рф/*
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           unsafeWindow
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// ==/UserScript==


//var user_hide_list = GM_getValue("user_hide_list", "");
var user_hide_list = "";

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
    
    $("body").append(css);
}

function createSmallPanel() {
    var panel = document.createElement("div");
    panel.setAttribute("id", "ps_small_panel");
    $(panel).click(function() {
        $("#ps_hide_text").val(GM_getValue("user_hide_list", ""));
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
       ind = msg_txt.innerText.indexOf("@" + name);
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
        var splitted_list = user_hide_list.split(" ");

        $(".msg_info").each(function(i, msg_info) {
           info_username = $(msg_info).children(".username")[1];
            
           if (splitted_list.indexOf(info_username.innerText) != -1) {
               info = $(msg_info).parent(".info")[0];
               msg = $(info).parent(".msg")[0];
               msg.innerHTML = "Hide " + name;
           }
        });
    }
}

applyCss();
var user_name = $("#current-user")[0].innerText;
createBigPanel(user_hide_list);
createSmallPanel();
hideUser();
selectNamedMessage(user_name);

if (document.URL.indexOf(encodeURIComponent("новости")) != -1) {
    console.log("Вы на новостной странице");
} else if (document.URL.indexOf(encodeURIComponent("обращение")) != -1) {
    $("div.greeting").html("Добро пожаловать в Обращения. <br>Обратите внимание! Это неофициальная функция!");
    unsafeWindow.$(window).unbind('scroll');
    //Код на десяточку!
    loadMessages = function (e) {
        list = $('.msg_list');
        
        current_url = '/v1/feed?time=sec' + (e ? "$before_item_id=" + e : "");
        if (current_url == '') {
            return
        }
        
        $.ajax({
            url: current_url,
            type: 'get',
            dataType: 'json',
            success: function (e) {
                'ok' == e.status && ($.each(e.messages, function (e, t) {
                    try {
                        last = Math.min(t.item_id, last);
                        if (t.content.indexOf("@" + user_name) != -1) unsafeWindow.showNewMsg(t, 'bottom');
                    } catch (n) {
                    }
                }), $('.info_line') .remove(), list.attr('data-page') && list.attr('data-page', parseInt(list.attr('data-page')) + 1), (e.end_of_line === !0 || 0 == e.messages.length) && list.append('<div id="end-of-line" class="info_line"></div>'))
                //loadNext();
            },
            error: function () {
            }
        });
        
    };

    var last = false;
    var i = 0;
    function loadNext() {
        i++;
        if (i > 2) {
            return;
        }
        
        //строка на 10/10
        null === unsafeWindow.document.getElementById('end-of-line') && ($('.msg_list') [0] ? (msg_id = $('.msg_list .msg:last') .data('item-id'), $('.msg_list') .append('<div id="end-of-line" class="info_line loading"></div>'), loadMessages(last))  : $('.users_list') [0] && (user_id = $('.users_list .user:last') .data('username'), $('.users_list') .append('<div id="end-of-line" class="info_line loading"></div>'), loadMessages(last)))
    }
}


$(document).ready(function() {
    user_hide_list = GM_getValue("user_hide_list", "");
    hideUser();
        
    loadNext();
    console.log("Load!");
});
