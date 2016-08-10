(function (CommentsPlus) {
  "use strict";
  
  const
    stream = highland,
    curry = highland.curry.bind(highland),
    Process = CommentsPlus.Process,
    utils = CommentsPlus.utils,

    awaitElement = curry(utils.awaitElement),
    elementFilter = curry(utils.elementFilter),
    mapPromise = utils.mapPromise,
    mutationStream = utils.mutationStream,
    swapProcess = utils.swapProcess(Process);

  const 
    contentElement = document.querySelector('#content'),
    watchContainerSelector = '#watch7-container',
    discussionSelector = '#watch-discussion';

  const main = function () {
    const
      elFilter = elementFilter(watchContainerSelector),
      awaitDiscussion = awaitElement(discussionSelector),
      mapper = mapPromise(awaitDiscussion),
      firstContainer = document.querySelector(watchContainerSelector),
      streamHead = stream([firstContainer]),
      streamTail = mutationStream(contentElement),
      containerStream = stream([streamHead, streamTail]).merge();

    containerStream
      .filter(elFilter)
      .flatMap(mapper)
      .scan(null, swapProcess)
      .each(function empty() {});
  };

  main();

})(self.CommentsPlus = self.CommentsPlus || {});