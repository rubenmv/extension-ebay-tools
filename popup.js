/*global chrome, FileReader, window, document, console, Sortable*/
"use strict";
const DEBUG = false;
var bgPage = chrome.extension.getBackgroundPage();
var ocultarPaisesSwitch, ocultarPaisesText,
    ocultarVendedoresSwitch, ocultarVendedoresText,
    redirigirSwitch, redirigirText;
var logger = function(message)
{
    if (DEBUG) console.log(message);
}
var logError = function(message)
{
    if (DEBUG) console.error(message);
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

function onSaveClicked()
{
    var options = initializeOptions();
    options.ocultarPaisesEnabled = ocultarPaisesSwitch.checked;
    options.ocultarPaisesLista = ocultarPaisesText.value;
    options.ocultarVendedoresEnabled = ocultarVendedoresSwitch.checked;
    options.ocultarVendedoresLista = ocultarVendedoresText.value;
    options.redirigirEnabled = redirigirSwitch.checked;
    options.redirigirDominio = redirigirText.value;
    chrome.storage.sync.set(options, function()
    {
        bgPage.onOptionsUpdated();
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        var saveButton = document.getElementById('saveButton');
        saveButton.style.display = "none";
        status.textContent = "Options saved";
        // Check for error
        if (chrome.runtime.lastError !== undefined)
        {
            logError("An error ocurred saving options: " + chrome.runtime.lastError.string);
            logError(chrome.runtime.lastError);
            status.textContent = "An error ocurred saving options";
        }
        window.setTimeout(function()
        {
            status.textContent = "";
            saveButton.style.display = "inline-block";
        }, 1800);
    });
}
/**
 * Gets data from background page
 */
function initialize()
{
    var options = initializeOptions();
    // Obtenemos las prerefencias
    chrome.storage.sync.get(options, function(storedSettings)
    {
        // Check for error
        if (chrome.runtime.lastError !== undefined)
        {
            logError("An error ocurred restoring options: " + chrome.runtime.lastError);
            return;
        }
        // OCULTAR PAISES
        // Switch de ocultar paises
        ocultarPaisesSwitch = document.getElementById("ocultarPaisesSwitch");
        ocultarPaisesSwitch.checked = storedSettings.ocultarPaisesEnabled === undefined ? true : storedSettings.ocultarPaisesEnabled;
        // Paises que ocultar
        ocultarPaisesText = document.getElementById("ocultarPaisesText");
        ocultarPaisesText.value = storedSettings.ocultarPaisesLista === undefined ? "" : storedSettings.ocultarPaisesLista;
        // OCULTAR Vendedores
        // Switch de ocultar Vendedores
        ocultarVendedoresSwitch = document.getElementById("ocultarVendedoresSwitch");
        ocultarVendedoresSwitch.checked = storedSettings.ocultarVendedoresEnabled === undefined ? true : storedSettings.ocultarVendedoresEnabled;
        // Vendedores que ocultar
        ocultarVendedoresText = document.getElementById("ocultarVendedoresText");
        ocultarVendedoresText.value = storedSettings.ocultarVendedoresLista === undefined ? "" : storedSettings.ocultarVendedoresLista;
        // REDIRIGIR
        redirigirSwitch = document.getElementById("redirigirSwitch");
        redirigirSwitch.checked = storedSettings.redirigirEnabled === undefined ? true : storedSettings.redirigirEnabled;
        // Lista de paises a los que redirigir
        redirigirText = document.getElementById("redirigirText");
        redirigirText.value = storedSettings.redirigirDominio === undefined ? "" : storedSettings.redirigirDominio;
        // Eventos
        document.getElementById("saveButton").addEventListener("click", onSaveClicked)
    });
}
document.addEventListener("DOMContentLoaded", initialize);