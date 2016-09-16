(function (CommentsPlus) {
  "use strict";

  const
    stream = Kefir.stream,
    sequence = Kefir.sequentially,
    curry = R.curry,
    flatten = R.flatten,
    any = R.any,
    compose = R.compose,
    not = R.not,
    forEach = R.forEach,
    isArrayLike = R.isArrayLike,
    _ = R.__;

  const awaitElement = curry(function (selector, container) {
    container = container || document;

    function cb(resolve, reject) {
      animationFrame.take(1).observe(function (time) {
        const el = container.querySelector(selector);
        if (el) resolve(el);
        else cb(resolve, reject);
      });
    };

    return new Promise(cb);
  });

  const fromPromise = function (promise) {
    return Kefir.fromPromise(promise);
  };

  const animationFrame = stream(function (emitter) {
    function emitTime(time) {
      emitter.emit(time);
      window.requestAnimationFrame(emitTime);
    }
    window.requestAnimationFrame(emitTime);
  });

  const isElement = function (object) {
    return object instanceof Element;
  };

  const addedNodes = function (mutation) {
    return mutation.addedNodes || [];
  };

  const discussionElement = function (element) {
    return element.querySelector('#watch-discussion');
  };

  const elementMatches = curry(function (selector, element) {
    return isElement(element) && element.matches(selector);
  });

  const elementMatchesAny = curry(function (selectors, element) {
    return any(elementMatches(_, element))(selectors);
  });

  const mutationStreamCallback = curry(function (emit, mutations) {
    flatten(mutations.map(addedNodes))
      .filter(isElement)
      .forEach(emit);
  });

  const emitExisting = curry(function (element, callback, selector) {
    callback([{addedNodes: element.querySelectorAll(selector)}]);
  });

  const mutationStreamGenerator = curry(function (element, options, emitter) {
    const 
      pushFunc = emitter.value,
      callback = mutationStreamCallback(pushFunc),
      observer = new MutationObserver(callback);
    observer.observe(element, options);

    if (isArrayLike(options.emitExisting)) 
      forEach(emitExisting(element, callback), options.emitExisting);

    // This will be called when the last listener unsubscribes
    return function () {
      observer.disconnect();
      emitter.end();
    };
  });

  const mutationStream = function (element, options) {
    return stream(mutationStreamGenerator(element, options));
  };

  const headComment = function (comment) {
    // A comment is a head comment if it has a sibling that renders replies
    return comment
      .parentElement
      .querySelector('.comment-replies-renderer');
  };

  const replyComment = compose(not, headComment);

  const removePlus = function (comment) {
    const
      textEl = comment.querySelector('.comment-renderer-text-content'),
      text = textEl.innerText.trim();

    if (text === '+') comment.remove();
  };

  CommentsPlus.utils = {
    elementMatchesAny: elementMatchesAny,
    mutationStream: mutationStream,
    awaitElement: awaitElement,
    removePlus: removePlus,
    fromPromise: fromPromise,
    replyComment: replyComment
  };

})(global.CommentsPlus);