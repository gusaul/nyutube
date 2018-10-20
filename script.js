var injected = false, onTop = false;
var stateWatch = false, searchBar = true;

chrome.app.window.current().innerBounds.width = 1000;
chrome.app.window.current().innerBounds.height = 600;
chrome.app.window.current().innerBounds.top = 100;
chrome.app.window.current().innerBounds.left = 100;

$(document).ready(function() {
    var webview = document.getElementById('main-view');

    $('.close').click(function() {
        window.close();
    });

    $('html').hover(function(){
        $('.navigation, .gonav').removeClass('none');
    }, function(){
        $('.navigation, .gonav').addClass('none');
        if(!$('.address').hasClass('none')) {
            $('.address').addClass('none');
        }
    });

    var watchManipulate = `
        var header = document.getElementById("masthead-container");
        header.className += " none";
        var mainContent = document.getElementById("page-manager");
        mainContent.className += " forceTop";
        var primary = document.querySelectorAll("#primary")[1];
        primary.className += " fit";
    `;
    var normalManipulate = `
        var header = document.getElementById("masthead-container");
        header.className = header.className.replace(" none", "");
        var mainContent = document.getElementById("page-manager");
        mainContent.className = mainContent.className.replace(" forceTop", "");
        var primary = document.querySelectorAll("#primary")[1];
        primary.className = primary.className.replace(" fit", "");;
    `;

    $('.search').click(function() {
        if(searchBar) {
            webview.executeScript({code: watchManipulate});
        } else {
            webview.executeScript({code: normalManipulate});
        }
        searchBar = !searchBar;
    });
    $('.top').click(function() {
        onTop = !onTop;
        chrome.app.window.current().setAlwaysOnTop(onTop);
        if(onTop) {
            $('.top').addClass('navactive');
        } else {
            $('.top').removeClass('navactive');
        }
    });
    $('.minimize').click(function() {
        chrome.app.window.current().minimize();
    });
    $('.view').click(function() {
        if(stateWatch) {
            chrome.app.window.current().innerBounds.width = 1000;
            chrome.app.window.current().innerBounds.height = 600;
            chrome.app.window.current().innerBounds.top = 100;
            chrome.app.window.current().innerBounds.left = 100;
            if(!searchBar) {
                webview.executeScript({code: normalManipulate});
                searchBar = true;
            }
        } else {
            chrome.app.window.current().innerBounds.width = 426;
            chrome.app.window.current().innerBounds.height = 240;
            chrome.app.window.current().innerBounds.top = screen.height-240;
            chrome.app.window.current().innerBounds.left = screen.width-426;
            if(searchBar) {
                webview.executeScript({code: watchManipulate});
                searchBar = false;
            }
        }
        stateWatch = !stateWatch;
    });

    $('.back').click(function() {
        webview.back();
    });
    $('.forward').click(function() {
        webview.forward();
    });
    $('.youtube').click(function() {
        if($('.address').hasClass('none')) {
            $('.address').removeClass('none');
        } else {
            $('.address').addClass('none');
        }
    });
    $('#gonow').click(function() {
        var url = $('#goto').val();
        if(url.includes("http://youtube.com") || url.includes("https://youtube.com") ||
            url.includes("http://www.youtube.com") || url.includes("https://www.youtube.com")) {
            $('#goto').val('');
            document.querySelector('webview').src = url;
        }
    });
    $('.copy').click(function(){
        var url = document.querySelector('webview').src;
        $('#copyarea').val(url);
        $('#copyarea').select();
        document.execCommand('copy');
    });
    document.querySelector('#goto').addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            $('#gonow').click();
        }
    });

    $("html").keydown(function(e) {
        var key = e.which || e.keyCode;
        if(key === 27) {
            chrome.app.window.current().innerBounds.top = screen.height;
            chrome.app.window.current().innerBounds.left = screen.width;
        }
    });
    $("html").keyup(function(e) {
        var key = e.which || e.keyCode;
        if(key === 27) {
            chrome.app.window.current().innerBounds.top = (stateWatch) ? screen.height-240 : 100;
            chrome.app.window.current().innerBounds.left =  (stateWatch) ? screen.width-426 : 100;
        }
    });

    var manipulateCss = `
        body::-webkit-scrollbar {
            display: none;
        }
        body {
            overflow-x: hidden;
        }
        .none {
            display: none!important;
        }
        .forceTop {
            margin-top:0!important;
        }
        .fit {
            padding: 0!important;
            margin: 0!important;
        }
    `;

    webview.addEventListener("loadstop", function(event) {
        if(!injected){
            webview.insertCSS({code: manipulateCss});

            if(stateWatch) {
                // webview.executeScript({code: });
            }
            injected = true;
        }
    });

    webview.addEventListener("loadstart", function(event) {
        injected = false;
    });
});

function updateWebviews() {
    var webview = document.querySelector("webview");
    webview.style.height = document.documentElement.clientHeight + "px";
    webview.style.width = document.documentElement.clientWidth + "px";
};

onload = updateWebviews;
window.onresize = updateWebviews;