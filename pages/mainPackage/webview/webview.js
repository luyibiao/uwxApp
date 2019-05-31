Page({

  data: {
    src:'https://www.twash.cn/'
  },

  onLoad: function (options) {
    if (options.src) {
      this.setData({ src: options.src });
    }
  },
});