const DEBUG = false;
//const HIDDEN_COUNTRIES = /(China|Hong Kong)/;
var hiddenCountriesEnabled = false,
    hiddenCountriesValue = /()/;
var IsChecking = false;
var logger = function(message)
{
    if (DEBUG) console.log(message);
}
logger("-------- HideCountries -------\n" + hiddenCountriesValue);
var HideCountries = function()
{
    if (!hiddenCountriesEnabled)
    {
        return true;
    }
    logger("-------- HideCountries -------\n" + hiddenCountriesValue);
    // Buscamos si la pagina es un listado de busqueda
    var list = document.getElementById("ListViewInner");
    if (list)
    {
        logger("listing page, hiding items from selected countries");
        // Buscamos los items que contengan algunos de los paises en el detalle
        var items = document.querySelectorAll('.lvdetails');
        //var itemsToHide = [];
        for (var i = 0, len = items.length; i < len; i++)
        {
            if (items[i].textContent && items[i].textContent.match(hiddenCountriesValue))
            {
                list.removeChild(items[i].parentElement);
            }
        }
        //if(itemsToHide.length === 0) return;
    }
    return true;
}

function initializeOptions()
{
    var options = {
        ocultarPaisesEnabled: false,
        ocultarPaisesLista: "",
        redirigirEnabled: false,
        redirigirDominio: ""
    };
    return options;
}
var options = initializeOptions();
chrome.storage.sync.get(options, function(storedSettings)
{
    logger("Getting storaged settings: " + storedSettings);
    // Check for error
    if (chrome.runtime.lastError !== undefined)
    {
        logger("An error ocurred restoring options: " + chrome.runtime.lastError);
        return;
    }
    hiddenCountriesEnabled = storedSettings.ocultarPaisesEnabled === undefined ? true : storedSettings.ocultarPaisesEnabled;
    if (storedSettings.ocultarPaisesLista)
    {
        var rxString = "(" + storedSettings.ocultarPaisesLista + ")";
        hiddenCountriesValue = new RegExp(rxString);
    }
    var startTime = Date.now();
    var countryChecker = window.setInterval(function()
    {
        // Mientras hay una comprobacion no hacemos nada
        if (IsChecking) return;
        IsChecking = true;
        var done = HideCountries();
        logger("done: " + done);
        IsChecking = false;
        // Si la comprobacion ha finalizado con exito, deshabilitamos el checker
        if (done) window.clearInterval(countryChecker);
        // After 5 seconds stop checking
        var timeInSeconds = Math.floor((Date.now() - startTime)) / 1000;
        var stopChecks = timeInSeconds > 5;
        if (stopChecks === true)
        {
            window.clearInterval(countryChecker);
        }
    }, 500);
});