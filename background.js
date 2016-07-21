function parseQueryString(queryString) {

  function reductor(params, paramString) {
    var param = paramString.split('=');
    params[param[0]] = param[1];
    return params;
  }

  if (queryString[0] === '?') queryString = queryString.substr(1);
  return queryString.split('&').reduce(reductor, {});
}

function urlPointsToVideo(url) {
  return (url.pathname === "/watch") && 
    (url.hostname.trim() === "www.youtube.com");
}

function videoIDOf(url) {
  var params = parseQueryString(url.search);
  return params['v'];
}

function sendCommand(port, urlString) {
  var url = new URL(urlString);
  var command = {validPage: urlPointsToVideo(url)};
  if (command.validPage) command.videoID = videoIDOf(url);
  port.postMessage(command);
}

chrome.runtime.onConnect.addListener(function (port) {
  var tab = port.sender.tab;
  sendCommand(port, tab.url);

  function historyListener(details) {
    if (details.tabId === tab.id) {
      console.log(details.url);
      sendCommand(port, details.url);
    }
  }

  chrome.webNavigation.onHistoryStateUpdated.addListener(historyListener);
  port.onDisconnect.addListener(function () {
    chrome.webNavigation.onHistoryStateUpdated.removeListener(historyListener);
  });
});