const DEBUG = false;
const EBAY_DOMAINS = [""];
const REDIRECT_DOMAIN = "ebay.es";

var logger = function (message) {
    if (DEBUG) console.log(message);
}

function CheckForDomain(url, domain) {
    return url != undefined && url.hostname != undefined && url.hostname.indexOf(domain) >= 0;
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status !== "loading") return;
    logger("Cogemos el tab.\n" +
        "id: " + tab.id +
        ", url: " + tab.url);
    // Recoge tab.url y crea en formato URL para poder extraer hostname y pathname
    var url = new URL(tab.url);
    // Primero comprobamos si ebay es parte del hostname
    if (!CheckForDomain(url, "ebay")) { logger("dominio no ebay, terminamos"); return; }
    logger("tab.url en formato URL: " + url);
    if (url.href) {
        logger("hostname: " + url.hostname);
        // No es el dominio que buscamos, redirigimos
        if (!CheckForDomain(url, REDIRECT_DOMAIN)) {
            var itemPage = url.href.indexOf("itm") >= 0;
            if (itemPage) {
                logger("item page, redirecting");
                const redirectURL = "http://" + REDIRECT_DOMAIN + url.pathname;
                logger(redirectURL);
                chrome.tabs.update(tab.id, {
                    url: redirectURL
                });
            }
        }
    }
});