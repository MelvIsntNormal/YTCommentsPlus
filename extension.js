// helper function to iterate over certain Lists
function iterator(list, self) {
  return { forEach: function (callback) {
    for (var i = 0; i < list.length; i++) {
      if(self) callback.call(self, list[i], list, i);
      else callback(list[i], list, i);
    }
  }};
}

function videoIDOfComments(commentsSection) {
  var container = commentsSection.parentElement.parentElement.parentElement;
  return container.querySelector("meta[itemprop='videoId']").content.trim();
}


var CommentFilter = {
  // constructor
  create: function (containerElementID, commentsSectionID) {
    // Create an object using the object I'm inside as the base
    var self = Object.create(this);
    self.containerElementID = containerElementID;
    self.commentsSectionID = commentsSectionID;
    self.running = false;
    return self;
  },

  start: function (videoID) {
    var 
      self = this,
      container = document.body,
      initialObserver;

    function initialObserverCallback(mutations) {
      if (self.commentsSection) initialObserver.disconnect();
      else {
        self.commentsSection = container.querySelector(self.commentsSectionID);
        if (!self.commentsSectionObserver) {
          initialObserver.disconnect();
        } else if(self.commentsSection && self.commentsSectionBelongsToVideo(videoID)) {
          self.commentsSectionObserver.observe(self.commentsSection, {childList: true, subtree: true});
          self.hideReccomendations();
        } else {
          self.commentsSection = null;
        }
      }
    }

    if (self.running) return;

    if(!container) {
      setTimeout(1000, self.start.bind(self));
    } else {
      self.commentsSectionObserver = new MutationObserver(function (mutations) { console.log(mutations); self.hideReccomendations(); });
      initialObserver = new MutationObserver(initialObserverCallback);
      initialObserver.observe(container, {childList: true, subtree: true});
      initialObserverCallback();
      self.running = true;
    }
  },

  end: function () {
    var
      self = this;

    if (!self.running) return;
    self.commentsSectionObserver.disconnect();
    self.commentsSectionObserver = null;
    self.commentsSection = null;
    self.running = false;
  },

  hideReccomendations: function () {
    var 
      self = this;
      comments = self.commentsSection.querySelectorAll('.comment-renderer');

    iterator(comments).forEach(function (comment, comments, index) {
      var content = comment.querySelector('.comment-renderer-text-content').innerText.trim();
      if(content === "+") comment.remove();
    });
  },

  commentsSectionBelongsToVideo: function (videoID) {
    var
      self = this,
      sectionID = videoIDOfComments(self.commentsSection);
    return sectionID === videoID;
  }
}

var IDs = {
  container: ".watch-main-col",
  commentsSection: "#comment-section-renderer-items"
}

var commentFilter = CommentFilter.create(IDs.container, IDs.commentsSection);

var port = chrome.runtime.connect();

port.onMessage.addListener(function (message) {
  if (commentFilter.running) {
    commentFilter.end();
  }
  if (message.validPage) {
    commentFilter.start(message.videoID);
  }
});
