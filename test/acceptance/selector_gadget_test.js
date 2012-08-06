require.config({
  baseUrl: "vendors",
  paths: {
    "lib": "../lib"
  }
});

define(["jquery", "lib/interface"], function ($, SelectorGadget) {

  buster.testCase("SelectorGadget", {

    setUp: function () {
      this.sg = new SelectorGadget();
      $("body").append("<div class='logo'>Logo</div>");
    },

    tearDown: function () {
      this.sg.destroy();
    },

    "after initialization": {

      "controls UI is not displayed": function () {
        buster.assert.equals($("#_sg_div").length, 0);
      },

      // the following two tests try to ensure SelectorGadget is doing something
      "the border divs are not created right away": function () {
        buster.assert.equals($(".sg_border").length, 0);
      },

      "border divs are created after mousing over": function () {
        $(".logo").trigger("mouseover");
        buster.assert.equals($(".sg_border").length, 4);
      }
    },

    "setSelector changes currently active selector": function () {
      assert.equals($(".sg_suggested").length, 0);
      this.sg.setSelector(".logo");
      assert.equals($(".sg_suggested").length, 1);
      assert($(".logo").hasClass("sg_suggested"));
    },

    "setSelector with empty selector clears the selection": function () {
      this.sg.setSelector(".logo");
      assert.equals($(".sg_suggested").length, 1);
      this.sg.setSelector();
      assert.equals($(".sg_suggested").length, 0);
    },

    "event is fired when the suggested path changes": function (done) {
      this.sg.onChangeSelector = function (selector) {
        assert.equals(selector, ".logo");
        done();
      };
      $(".logo").trigger("mousedown");
    }

  });

});