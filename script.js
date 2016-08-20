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

    var watchManipulate = `
        var header = document.getElementById("masthead-positioner");
        header.className += " none";
        var headerOfst = document.getElementById("masthead-positioner-height-offset");
        headerOfst.className += " none";
        var player = document.getElementById("player");
        player.className += " forceTop";
    `;
    var normalManipulate = `
        var header = document.getElementById("masthead-positioner");
        header.className = header.className.replace(" none", "");
        var headerOfst = document.getElementById("masthead-positioner-height-offset");
        headerOfst.className = headerOfst.className.replace(" none", "");
        var player = document.getElementById("player");
        player.className = player.className.replace(" forceTop", "");
    `;
    var watchPlayerManipulate = `
        var player = document.getElementById("player");
        player.className += " forceTop";
        window.scrollTo(0, 0);
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
            top:0!important;
        }
        .player-api {
            background:none!important;
        }
        #a11y-announcements-container {
            display:none;
        }
    `;

    webview.addEventListener("loadstop", function(event) {
        if(!injected){
            webview.insertCSS({code: manipulateCss});

            $('html').hover(function(){
                $('.navigation').removeClass('none');
            }, function(){
                $('.navigation').addClass('none');
            });

            if(stateWatch) {
                webview.executeScript({code: watchPlayerManipulate});
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