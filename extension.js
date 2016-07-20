// helper function to iterate over certain Lists
function iterator(list, self) {
  return { forEach: function (callback) {
    for (var i = 0; i < list.length; i++) {
      if(self) callback.call(self, list[i], list, i);
      else callback(list[i], list, i);
    }
  }};
}


// This is supposed to wait for changes to the comments section, then remove any plus comments
// There seems to be a bug when using other extensions.
(new MutationObserver(function (mutations) {
  var commentsSection = document.querySelector('#comment-section-renderer-items');

  function hideReccomendations(commentsSection) {
    var comments = commentsSection.querySelectorAll('.comment-renderer');
    iterator(comments).forEach(function (comment, comments, index) {
      var content = comment.querySelector('.comment-renderer-text-content').innerText.trim();
      if(content === "+") comment.remove();
    });
  }

  var commentsSectionObserver = new MutationObserver(function (mutations) {
    hideReccomendations(commentsSection);
  });
  commentsSectionObserver.observe(commentsSection, {childList: true, subtree: true});
  hideReccomendations(commentsSection);

})).observe(document.querySelector("#watch-discussion"), {childList: true});