'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  const 
    title = "YouTube Comments+ Disabled",
    message = `
      This extension has been disabled due to the changes in YouTube's layout.
      See github.com/MelvIsntNormal/YTCommentsPlus for more details and updates.
    `;


  chrome.notifications.create("install", {
    type: "basic",
    title: title,
    message: message,
    iconUrl: "images/icons/icon_128.png"
  });
});