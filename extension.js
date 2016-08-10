(function (PlusFilter) {
  "use strict";

  const
    videoIDOfComments = PlusFilter.videoIDOfComments;

  // helper function to iterate over certain Lists
  const iterator = function (list) {
    return { forEach: function (callback) {
      for (var i = 0; i < list.length; i++)
        callback(list[i], list, i);
    }};
  }


  const CommentFilter = PlusFilter.CommentFilter = {
    // constructor
    create: function (containerElementID, commentsSectionID) {
      // Create an object using the object I'm inside as the base
      const filter = Object.create(this);
      filter.containerElementID = containerElementID;
      filter.commentsSectionID = commentsSectionID;
      filter.running = false;
      return filter;
    },

    start: function (videoID) {
      const 
        container = document.body;
      var initialObserver;

      const initialObserverCallback = function (mutations) {
        if (this.commentsSection) initialObserver.disconnect();
        else {
          this.commentsSection = container.querySelector(this.commentsSectionID);
          if (!this.commentsSectionObserver) {
            initialObserver.disconnect();
          } else if(this.commentsSection && this.commentsSectionBelongsToVideo(videoID)) {
            this.commentsSectionObserver.observe(this.commentsSection, {childList: true, subtree: true});
            this.hideReccomendations();
          } else {
            this.commentsSection = null;
          }
        }
      }

      if (this.running) return;

      if(!container) {
        setTimeout(1000, this.start.bind(this));
      } else {
        this.commentsSectionObserver = new MutationObserver(function (mutations) { console.log(mutations); this.hideReccomendations(); });
        initialObserver = new MutationObserver(initialObserverCallback);
        initialObserver.observe(container, {childList: true, subtree: true});
        initialObserverCallback();
        this.running = true;
      }
    },

    end: function () {

      if (!this.running) return;
      this.commentsSectionObserver.disconnect();
      this.commentsSectionObserver = null;
      this.commentsSection = null;
      this.running = false;
    },

    hideReccomendations: function () {
      const 
        comments = this.commentsSection.querySelectorAll('.comment-renderer');

      iterator(comments).forEach(function (comment, comments, index) {
        const content = comment.querySelector('.comment-renderer-text-content').innerText.trim();
        if(content === "+") comment.remove();
      });
    },

    commentsSectionBelongsToVideo: function (videoID) {
      const
        sectionID = videoIDOfComments(this.commentsSection);
      return sectionID === videoID;
    }
  }

  const IDs = {
    container: ".watch-main-col",
    commentsSection: "#comment-section-renderer-items"
  }

  const commentFilter = CommentFilter.create(IDs.container, IDs.commentsSection);

  const port = chrome.runtime.connect();

  port.onMessage.addListener(function (message) {
    if (commentFilter.running) {
      commentFilter.end();
    }
    if (message.validPage) {
      commentFilter.start(message.videoID);
    }
  });
})(self.PlusFilter = self.PlusFilter || {});