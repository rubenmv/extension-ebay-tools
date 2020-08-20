const DEBUG = false;
var IsChecking = false;
//const REDIRECT_DOMAIN = "ebay.es";
var redirectDomainEnabled = false,
    redirectDomainValue = /()/;
var logger = function(message)
{
    if (DEBUG) console.log(message);
}

function CheckForDomain(url, domain)
{
    return url != undefined && url.hostname != undefined && url.hostname.indexOf(domain) >= 0;
}

function Redirect(tab)
{
    logger("-------- Redirect -------");
    logger("Cogemos el tab.\n" + "id: " + tab.id + ", url: " + tab.url);
    // Recoge tab.url y crea en formato URL para poder extraer hostname y pathname
    var url = new URL(tab.url);
    // Primero comprobamos si ebay es parte del hostname
    if (!CheckForDomain(url, "ebay"))
    {
        logger("dominio no ebay, terminamos");
        return;
    }
    logger("tab.url en formato URL: " + url);
    if (url.href)
    {
        logger("hostname: " + url.hostname);
        // No es el dominio que buscamos, redirigimos
        if (!CheckForDomain(url, redirectDomainValue))
        {
            var itemPage = url.href.indexOf("itm") >= 0;
            if (itemPage)
            {
                logger("item page, redirecting");
                const redirectURL = "http://" + redirectDomainValue + url.pathname;
                logger(redirectURL);
                chrome.tabs.update(tab.id,
                {
                    url: redirectURL
                });
            }
        }
    }
}

function initializeOptions()
{
    var options = {
        ocultarPaisesEnabled: false,
        ocultarPaisesLista: "",
        ocultarVendedoresEnabled: false,
        ocultarVendedoresLista: "",
        redirigirEnabled: false,
        redirigirDominio: ""
    };
    return options;
}

function onOptionsUpdated()
{
    var options = initializeOptions();
    chrome.storage.sync.get(options, function(storedSettings)
    {
        // Check for error
        if (chrome.runtime.lastError !== undefined)
        {
            logger("An error ocurred restoring options: " + chrome.runtime.lastError);
            return;
        }
        redirectDomainEnabled = storedSettings.redirigirEnabled === undefined ? true : storedSettings.redirigirEnabled;
        redirectDomainValue = storedSettings.redirigirDominio === undefined ? "" : storedSettings.redirigirDominio;
    });
}
onOptionsUpdated();
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
    // Primero comprobamos durante la carga si el dominio hay que redirigirlo
    if (changeInfo.status === "loading")
    {
        if (redirectDomainEnabled && redirectDomainValue !== undefined && redirectDomainValue !== '') Redirect(tab);
    }
});