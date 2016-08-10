(function (PlusFilter) {
  "use strict";
  console.log(self.PlusFilter);

  const
    utils = PlusFilter.utils,
    parseQueryString = utils.parseQueryString,
    urlPointsToVideo = utils.urlPointsToVideo,
    videoIDOf = utils.videoIDOf,
    sendCommand = utils.sendCommand;

  const historyListener = function (details) {
    if (details.tabId === tab.id) {
      console.log(details.url);
      sendCommand(port, details.url);
    }
  }

  const onDisconnectListener = function () {
    chrome.webNavigation.onHistoryStateUpdated.removeListener(historyListener);
  }

  const onConnectListener = function (port) {
    const tab = port.sender.tab;
    sendCommand(port, tab.url);

    chrome.webNavigation.onHistoryStateUpdated.addListener(historyListener);
    port.onDisconnect.addListener(onDisconnectListener);
  }

  chrome.runtime.onConnect.addListener(onConnectListener);

})(self.PlusFilter = self.PlusFilter || {});