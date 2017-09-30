'use strict';

(function (CommentsPlus) {

  // const 
  //   NodeWatcher = CommentsPlus.NodeWatcher,
  //   utils = CommentsPlus.utils,

  //   awaitElement = utils.awaitElement,
  //   fromPromise = utils.fromPromise,
  //   pipeTo = utils.pipeTo,
  //   replyComment = utils.replyComment,
  //   removePlus = utils.removePlus;

  // const discussionWatcherCtor = function (container) {
  //   // Construct a watcher that looks for comments in the comments section
  //   return NodeWatcher.new({
  //     container: container,
  //     selectors: ['.comment-renderer'],
  //     options: {
  //       childList: true,
  //       subtree: true,
  //       emitExisting: ['.comment-renderer']
  //     }
  //   }).filter(replyComment)
  //     .observe(removePlus);
  // };

  // // Ends an old watcher when the comments section changes
  // const discussionSwitcher = NodeWatcher.switcher(discussionWatcherCtor);

  // // Watches the "content" container and looks for new discussion containers
  // const contentWatcher = NodeWatcher.new({
  //   container: document.querySelector('#content'),
  //   selectors: ['#watch7-container'],
  //   options: {
  //     childList: true, 
  //     emitExisting: ['#watch7-container']
  //   }
  // }).map(awaitElement('.comment-section-renderer-items'))
  //   .flatMap(fromPromise);

  // // Send all discussion containers to the switcher
  // discussionSwitcher.plug(contentWatcher);

})(global.CommentsPlus);