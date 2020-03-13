// ==UserScript==
// @name         Tesla VIN Seeker
// @namespace    https://github.com/uforepair/tm-tesla-vin-seeker
// @version      0.1
// @description  Reveals your hidden VIN if present
// @author       trickyNoodles
// @match        https://www.tesla.com/teslaaccount/product-finalize*
// @grant        none
// @@run-at      document-idle
// ==/UserScript==

function getOrCreateMessageContainer(containerId) {
    var element = document.getElementById(containerId);
    if (!element) {
        element = document.createElement('div');
        element.id = containerId;
    }
    return element;
}

function getContainerSibling() {
    var siblingElement = document.getElementById('page_title');
    if (siblingElement == null) {
        siblingElement = document.body;
    }
    return siblingElement;
}

function getVinMessage() {
     var tesla = typeof(Tesla) == "undefined" ? null : Tesla;
     if (!tesla ||
         !tesla.ProductF ||
         !tesla.ProductF.Data ||
         !tesla.ProductF.Data.Insurance ||
         !tesla.ProductF.Data.Insurance.hasOwnProperty('vin'))
    {
        throw "The webpage must have changed. Expecting object Tesla.ProductF.Data.Insurance with a vin property.";
    }
    var vin = tesla.ProductF.Data.Insurance.vin;
    var message = "";
    if (typeof(vin) == "string" && vin.indexOf("5YJ") == 0) {
        message = "You got VIN: " + vin;
    } else {
        message = "Tesla hasn't assigned a VIN in source begining with 5YJ yet. Check again later.";
    }
    return (message);
}

(function() {
    'use strict';

    var message = "";
    var messageColor = "white";
    try {
        message = getVinMessage();
    } catch(err) {
        message = err;
        messageColor = "red";
    }
    var messageContainer = getOrCreateMessageContainer('naiveVinFinderMessage');
    messageContainer.innerText = message;
    messageContainer.style="background-color:#222;color:" + messageColor + ";padding:5px 20px;font-weight:bold;";
    document.body.prepend(messageContainer);
})();
