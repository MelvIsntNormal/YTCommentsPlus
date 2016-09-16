'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  const 
    updated = details.reason === 'update',
    version = chrome.runtime.getManifest().version_name,
    title = "YouTube Comments+ " + (updated? "Updated!" : "Installed!"),
    message = updated? "Updated to " + version : "Thank you for installing";


  chrome.notifications.create("install", {
    type: "basic",
    title: title,
    message: message,
    iconUrl: "images/icons/icon_128.png"
  });
});