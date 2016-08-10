(function (PlusFilter) {
  "use strict";

  PlusFilter.utils = {
    videoIDOfComments: function (commentsSection) {
      const container = commentsSection.parentElement.parentElement.parentElement;
      return container.querySelector("meta[itemprop='videoId']").content.trim();
    },

    parseQueryString: function (queryString) {

      const reductor = function (params, paramString) {
        const param = paramString.split('=');
        params[param[0]] = param[1];
        return params;
      }

      if (queryString[0] === '?') queryString = queryString.substr(1);
      return queryString.split('&').reduce(reductor, {});
    },

    urlPointsToVideo: function (url) {
      return (url.pathname === "/watch") && 
        (url.hostname.trim() === "www.youtube.com");
    },

    videoIDOf: function (url) {
      const params = this.parseQueryString(url.search);
      return params['v'];
    },

    sendCommand: function (port, urlString) {
      console.log(this);
      const url = new URL(urlString);
      const command = {validPage: this.urlPointsToVideo(url)};
      if (command.validPage) command.videoID = this.videoIDOf(url);
      port.postMessage(command);
    },

    bindMethods: function (object) {
      Object.keys(object)
        .filter(function (key) { return typeof(object[key] === "function"); })
        .forEach(function (key) { object[key] = object[key].bind(object); });
    }
  }

  PlusFilter.utils.bindMethods(PlusFilter.utils);
})(self.PlusFilter = self.PlusFilter || {});