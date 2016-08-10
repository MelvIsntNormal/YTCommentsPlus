(function(CommentsPlus) {
  "use strict";

  const
    freeze = Object.freeze,
    utils = CommentsPlus.utils;

  const commentSectionItemsSelector = '#comment-section-renderer-items';
  
  const Process = CommentsPlus.Process = {
    new: function (commentsSection) {
      const myself = Object.create(this);
      myself.commentsSection = commentsSection;
      return freeze(myself);
    },

    start: function () {
      console.log(this.commentsSection);
    },

    terminate: function () {

    }
  }
})(self.CommentsPlus = self.CommentsPlus || {});