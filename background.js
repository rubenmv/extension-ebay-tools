const REDIRECT_DOMAIN = "www.ebay.es";

var listener = chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo.status !== "loading") return;
    // Recoge tab.url y crea en formato URL para poder extraer hostname y pathname
    var url = new URL(tab.url);
    //console.log("location href: " + tab.url);
    if (url.href !== undefined) {
        //console.log("hostname: " + url.hostname);
        if (url.hostname.indexOf(REDIRECT_DOMAIN) < 0) {
            var itemPage = url.href.indexOf("itm") >= 0;
            if (itemPage) {
                //console.log("item page, redirecting");
                const redirectURL = "http://" + REDIRECT_DOMAIN + url.pathname;
                //console.log(redirectURL);
                chrome.tabs.update(tab.id, {
                    url: redirectURL
                });
            }
        }
    }
});