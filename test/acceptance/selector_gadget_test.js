require.config({
  baseUrl: "vendors",
  paths: {
    "lib": "../lib"
  }
});

define(["jquery", "lib/main"], function ($, SelectorGadget) {

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
    },

    "elements with class .sg_ignore and their children": {

      setUp: function () {
        $("body").append("" +
          "<div class='parent sg_ignore'>" +
            "<span class='child'>child</span>" +
          "</div>"
        );

        // make borders visible
        // TODO borders should be made visible in the constructor
        // to simplify this test
        $(".logo").mouseover();
        assert.equals($(".sg_border:visible").length, 4);
        $(".logo").mouseout();
        assert.equals($(".sg_border:visible").length, 0);
      },

      ".child shouldn't have classes sg_selected, sg_suggested": function () {
        refute($(".child").hasClass("sg_selected"));
        refute($(".child").hasClass("sg_suggested"));
      },

      "are ignored when mousing over": function () {
        $(".child").mouseover();
        assert.equals($(".sg_border:visible").length, 0);
        refute($(".child").hasClass("sg_selected"));
      },

      // ~ unit test
      "are ignored when mousing out": function () {
        this.sg.removeBorders = this.spy();
        $(".child").mouseover();
        refute.called(this.sg.removeBorders);
      },

      "are ignored when clicking": function () {
        $(".child").mousedown();
        refute($(".child").hasClass("sg_selected"));
        refute($(".child").hasClass("sg_suggested"));
      },

      "are not highlighted when referenced in setSelector()": function () {
        this.sg.setSelector(".child");
        refute($(".child").hasClass("sg_suggested"));
      }

    }

  });

});