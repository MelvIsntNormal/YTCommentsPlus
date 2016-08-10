(function (CommentsPlus) {
  "use strict";

  const exports = CommentsPlus.utils = CommentsPlus.utils || {};

  const
    stream = highland,
    curry = highland.curry.bind(highland);

  const videoIdOfComments = exports.videoIdOfComments = function (commentsSection) {
    const container = commentsSection.parentElement.parentElement.parentElement;
    return container.querySelector("meta[itemprop='videoId']").content.trim();
  };

  const parseQueryString = exports.parseQueryString = function (queryString) {
    const reductor = function (params, paramString) {
      const param = paramString.split('=');
      params[param[0]] = param[1];
      return params;
    }

    return 
      (queryString[0] === '?' 
        ? queryString 
        : queryString.substr(1)
      ).split('&').reduce(reductor, {});
  };

  const urlPointsToVideo = exports.urlPointsToVideo = function (url) {
    return (url.pathname === "/watch") && 
      (url.hostname.trim() === "www.youtube.com");
  };

  const videoIdOf = exports.videoIdOf = function (url) {
    const params = this.parseQueryString(url.search);
    return params['v'];
  };

  const sendCommand = exports.sendCommand = function (port, urlString) {
    console.log(this);
    const url = new URL(urlString);
    const command = {validPage: urlPointsToVideo(url)};
    if (command.validPage) command.videoID = videoIDOf(url);
    port.postMessage(command);
  };

  const awaitNext = exports.awaitNext = function (stream) {
    return new Promise(function (resolve, reject) {
      stream.pull(function (err, item) {
        if (err) reject(err);
        else resolve(item);
      });
    });
  };

  const awaitElement = exports.awaitElement = function (selector, container) {
    container = container || document;
    function _recurse(resolve, reject) {
      const element = container.querySelector(selector);
      if (element) resolve(element);
      else awaitNext(animationFrame).then(function () {_recurse(resolve, reject);});
    };

    return new Promise(_recurse);
  };

  const animationFrame = stream(function (push, next) {
    window.requestAnimationFrame(function (time) {
      push(null, time);
      next();
    });
  });

  const bindMethods = exports.bindMethods = function (object) {
    Object.keys(object)
      .filter(function (key) { return typeof(object[key] === "function"); })
      .forEach(function (key) { object[key] = object[key].bind(object); });
  };

  const mapPromise = exports.mapPromise = function (promiseFunc) {
    return function (item) {
      return stream(promiseFunc(item));
    };
  };

  const isElement = function (object) {
    return object instanceof Element;
  };

  const addedNodes = function (mutation) {
    return stream(mutation.addedNodes);
  };

  const discussionElement = function (element) {
    return element.querySelector('#watch-discussion');
  };

  const elementFilter = exports.elementFilter = function (selector, element) {
    return isElement(element) && element.matches(selector);
  };

  const mutationStreamCallback = exports.mutationStream = curry(function (push, mutations) {
    stream(mutations)
      .map(addedNodes)
      .flatten()
      .filter(isElement)
      .each(push);
  });

  const mutationStreamGenerator = curry(function (element, push, next) {
    const 
      pushFunc = curry(push)(null),
      callback = mutationStreamCallback(pushFunc),
      observer = new MutationObserver(callback);
    observer.observe(element, {childList: true});
  });

  const mutationStream = exports.mutationStream = function (element) {
    const 
      generator = mutationStreamGenerator(element);
    return stream(generator);
  };

  const swapProcess = exports.swapProcess = function (Process) {
    return function (previousProcess, commentsSection) {
      if (previousProcess) previousProcess.terminate();
      const newProcess = Process.new(commentsSection);
      newProcess.start();
      return newProcess;
    }
  }; 

  const startProcess = function (proc) {
    if (proc) proc.start();
  };

})(self.CommentsPlus = self.CommentsPlus || {});