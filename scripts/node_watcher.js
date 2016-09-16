'use strict';

(function (CommentsPlus) {

  const
    utils = CommentsPlus.utils,

    prop = R.prop,
    invoker = R.invoker,

    elementMatchesAny = utils.elementMatchesAny,
    mutationStream = utils.mutationStream;

  CommentsPlus.NodeWatcher = {
    new: function (options) {
      const
        container = options.container,
        elSelectors = options.selectors,
        elFilter = elementMatchesAny(elSelectors),
        containerStream = mutationStream(container, options.options);

      return containerStream.filter(elFilter);
    },

    switcher: function (ctor, stopFn) {
      // Stops one stream and creats another
      // ctor should return a Kefir subscription

      // The earlier subscription will always be the first one
      const earliestSubscription = prop(0);

      stopFn = stopFn || invoker(0, 'unsubscribe');

      const pool = Kefir.pool();
      pool
        .map(ctor)
        .slidingWindow(2, 2)
        .map(earliestSubscription)
        .observe(stopFn);
      return pool;
    }
  };

})(global.CommentsPlus);