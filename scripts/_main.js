(function (CommentsPlus) {
  "use strict";

  const
    utils = CommentsPlus.utils,
      urlPointsToVideo = utils.urlPointsToVideo,
      videoIdOf = utils.videoIdOf,
    Process = CommentsPlus.Process;

  const 
    containerSelector = '#content',
    contentContainerSelector = '#watch7-container',
    container = document.querySelector(containerSelector);

  // Top-level changes in the container implies that the page has changed.
  // When the page changes, the comments section element changes, meaning that mutations can't be 
  // tracked anymore. The process needs to be restarted to account for this.

  const containerMutationCallback = function (process) {
    // Create callback for the MutationObserver
    return function (mutations) {
      if (this instanceof MutationObserver) this.disconnect();
      if (process && process.isRunning) process.stop();
      beginProcess(location);
    }
  }

  const beginProcess = function (url) {
    const 
      pageIsVideo = urlPointsToVideo(url),
      contentContainer = pageIsVideo? container.querySelector(contentContainerSelector) : null,
      videoId = pageIsVideo? videoIdOf(url) : null,
      process = pageIsVideo? Process.new(videoId, videoContentContainer) : null,
      callback = callback(process),
      observer = new MutationObserver(callback);
    observer.observe(container, {childList: true});
  }

})(self.CommentsPlus = self.CommentsPlus || {});