require.config({
  baseUrl: "vendors",
  paths: {
    "lib": "../lib"
  }
});

define(["jquery", "lib/dom"], function ($, DomPredictionHelper) {

  buster.testCase("DomPredictionHelper", {

    setUp: function () {
      $("body").html("" +
        "<h1>DOM Tests</h1>" +
        "<p>This page contains tests for the DOM fu script using jsUnit. To see them, take a look at the source.</p>" +
        "<p>&nbsp;</p>" +
        "<p>&nbsp;</p>" +
        "<p>&nbsp;</p>" +
        "<p>&nbsp;</p>" +
        "<p>&nbsp;</p>" +
        "<p>&nbsp;</p>" +
        "" +
        "<div id='parent1'><span class='sibling'><b>&nbsp;</b></span><span class='sibling something else'><i id='leaf1'>&nbsp;</i></span>" +
        "  <span class='sibling' id='leaf2'>" +
        "    <b>&nbsp;</b>" +
        "  </span>" +
        "  <span class='sibling'>&nbsp;</span>" +
        "</div>"
      );
    },

    testEscapeCssNames: function () {
      var dom = new DomPredictionHelper();
      assert.equals("this\\.is\\.a\\.test", dom.escapeCssNames("this.is.a.test"));
      assert.equals("this\\#is\\#a\\#test", dom.escapeCssNames("this#is#a#test"));
      assert.equals("this\\>is\\>a\\>test", dom.escapeCssNames("this>is>a>test"));
      assert.equals("this\\,is\\,a\\,test", dom.escapeCssNames("this,is,a,test"));
      assert.equals("world", dom.escapeCssNames("sg_blahblah world"));
      assert.equals("world", dom.escapeCssNames("world sg_blahblah"));
      assert.equals("", dom.escapeCssNames("sg_suggested"));
      assert.equals("hello\\\\", dom.escapeCssNames("hello\\"));
    },

    testDecodeCss: function () {
      var dom = new DomPredictionHelper();
      assert.equals(["div", "#id"].toString(), dom.decodeCss("div#id").toString());
      refute.equals(["div#", "id"].toString(), dom.decodeCss("div#id").toString());
      refute.equals(["div", "id"].toString(), dom.decodeCss("div#id").toString());
      refute.equals(["div", " ", ",", " ", "id"].toString(), dom.decodeCss("div,html").toString());
      assert.equals(["div", " ", "#id"].toString(), dom.decodeCss("div #id").toString());
      assert.equals(["div", " ", "#id"].toString(), dom.decodeCss("div      \t#id").toString());
      assert.equals(["div", " ", "div", "#id", ".class1", ".class2", ":nth-child(2)", " ", "span"].toString(), 
                    dom.decodeCss("div div#id.class1.class2:nth-child(2) span").toString());
      assert.equals(["div", ">id"].toString(), dom.decodeCss("div>id").toString());
      assert.equals(["div", ".class", " ", "div", " ", "a", "#blah\\.hi"].toString(), dom.decodeCss("div.class div a#blah\\.hi").toString());
    },

    testEncodeCssForDiff: function () {
      var dom = new DomPredictionHelper();
      var existing_tokens = {};
      var strings = ["body div#main #something", "body div#main #something_else"];
      var new_strings = dom.encodeCssForDiff(strings, existing_tokens);
      assert.equals(new_strings[0].substring(0, 1), new_strings[1].substring(0, 1));
      assert.equals(dom.invertObject(existing_tokens)[new_strings[0].substring(0, 1)], 'body');
      assert.equals(new_strings[0].substring(1, 2), new_strings[1].substring(1, 2));
      assert.equals(dom.invertObject(existing_tokens)[new_strings[0].substring(1, 2)], ' ');
      assert.equals(new_strings[0].substring(2, 3), new_strings[1].substring(2, 3));
      assert.equals(new_strings[0].substring(3, 4), new_strings[1].substring(3, 4));
      assert.equals(dom.invertObject(existing_tokens)[new_strings[0].substring(3, 4)], '#main');
      refute.equals(new_strings[0].substring(5, 6), new_strings[1].substring(5, 6));
    },

    testDecodeCss: function () {
      var dom = new DomPredictionHelper();
      var existing_tokens = {};
      var strings = ["body div#main #something", "body div#main #something_else"];
      var new_strings = dom.encodeCssForDiff(strings, existing_tokens);
      assert.equals(dom.decodeCss(new_strings[0], existing_tokens), "body div#main #something");
    },

    testCommonCss: function () {
      var dom = new DomPredictionHelper();
      assert.equals(dom.commonCss([]), '');
      assert.equals(dom.commonCss(['']), '');
      assert.equals(dom.commonCss(["body div#main #something", "body div#main #something_else"]), 'body div#main');
      assert.equals(dom.commonCss(["body blah div#main", "body div#main"]), 'body div#main');
      assert.equals(dom.commonCss(["body blah a div#main", "body div#main"]), 'body div#main');
    },
    
    testChildElemNumber: function () {
      var dom = new DomPredictionHelper();
      var parent = $('<div>').append($('<b>hello</b>')).append($('<b>hi</b>')).append(document.createTextNode('hi')).append($('<b>there</b>')).get(0);
      assert.equals(0, dom.childElemNumber(parent.childNodes[0]));
      assert.equals(1, dom.childElemNumber(parent.childNodes[1]));
      assert.equals(2, dom.childElemNumber(parent.childNodes[2]));
      
      assert.equals(0, dom.childElemNumber($(':nth-child(1)', parent).get(0)));
      assert.equals(1, dom.childElemNumber($(':nth-child(2)', parent).get(0)));
      assert.equals(2, dom.childElemNumber($(':nth-child(3)', parent).get(0)));
    },
    
    testPathOf: function () {
      var dom = new DomPredictionHelper();
      assert(dom.pathOf($('#leaf1').get(0)).indexOf("#leaf1") > -1);
      assert(dom.pathOf($('#leaf1').get(0)).indexOf("span.sibling.something.else:nth-child(2) i#leaf1") > -1);
    },
    
    testSimplifyCss: function () {
      var dom = new DomPredictionHelper();
      assert.equals("body", dom.simplifyCss("body", ["body"], []));
      assert.equals("", dom.simplifyCss("body", ["a"], []));
      assert.equals("", dom.simplifyCss("body", [], []));
      assert.equals("", dom.simplifyCss("tr td", ["a b c tr td e", "tr td"], []));
      assert.equals("td", dom.simplifyCss("tr td", ["a b c tr td", "tr td"], []));
      assert.equals("tr td", dom.simplifyCss("tr td", ["a b c tr td", "tr td"], ["td"]));
    },
    
    testPredictCss: function () {
      var dom = new DomPredictionHelper();
      assert.equals('.sibling', dom.predictCss([$('#parent1 span.sibling:nth-child(1)').get(0), $('#parent1 span.sibling:nth-child(2)').get(0)], 
                                          []));
      
      assert.equals('#leaf1', dom.predictCss([$('#parent1 i').get(0)], [$('#parent1 b').get(0)]));
    },
    
    testSelectorBlockMatchesSelectorBlock: function () {
      var dom = new DomPredictionHelper();
      assert.equals(true, dom.selectorBlockMatchesSelectorBlock(['b'], ['b']));
      assert.equals(true, dom.selectorBlockMatchesSelectorBlock(['b'], ['b', ':nth-child(1)']));
      assert.equals(true, dom.selectorBlockMatchesSelectorBlock(['b', ':nth-child(1)'], ['b', ':nth-child(1)']));
      assert.equals(true, dom.selectorBlockMatchesSelectorBlock([':nth-child(1)'], ['b', ':nth-child(1)']));
      assert.equals(false, dom.selectorBlockMatchesSelectorBlock(['i', ':nth-child(1)'], ['b', ':nth-child(1)']));
      assert.equals(false, dom.selectorBlockMatchesSelectorBlock(['i', '.class'], ['i']));
    },
    
    testSelectorGets: function () {
      var dom = new DomPredictionHelper();
      assert.equals(true, dom.selectorGets('all', ['table td div#a', 'something_else td div#a'], 'div#a'));
      assert.equals(true, dom.selectorGets('all', ['table td div#a.hi:nth-child(2)', 'something_else td div#a.hi '], 'div#a'));
      assert.equals(false, dom.selectorGets('all', ['table td div#a.hi:nth-child(2) b', 'something_else td div#a'], 'div#a'));
      assert.equals(false, dom.selectorGets('all', ['table td div#a.hi:nth-child(2) .b', 'something_else td div#a'], 'div#a'));
      assert.equals(false, dom.selectorGets('all', ['table td div#a.hi:nth-child(2)', 'something_else td div#a :nth-child(1)'], 'div#a'));
      assert.equals(false, dom.selectorGets('all', ['table td div', 'something_else td div#a'], 'div#a'));
      assert.equals(false, dom.selectorGets('all', ['table td div#a div', 'something_else td div#a'], 'div#a'));
      assert.equals(true, dom.selectorGets('all', ['table td div div#a', 'something_else td div#a'], 'div#a'));
      assert.equals(true, dom.selectorGets('all', ['table td div div div', 'something_else td div#a'], 'div'));
      assert.equals(true, dom.selectorGets('all', ["a b c tr td", "tr td"], "tr td"));
      assert.equals(true, dom.selectorGets('all', ["a b c tr td td", "tr td"], "tr td"));
      assert.equals(false, dom.selectorGets('all', ["a b c tr td td", "tr td a"], "tr td"));
      assert.equals(true, dom.selectorGets('all', ["a b c tr td td .hi", "tr td a.hi"], "tr td .hi"));
      assert.equals(false, dom.selectorGets('all', ["a b c tr td td .hi", "tr td a.hi .b"], "tr td .hi"));

      assert.equals(true, dom.selectorGets('all', ["a b c tr td td .hi", "tr td a.hi .b a"], "tr td .hi , a"));

      assert.equals(false, dom.selectorGets('all', ["a b c tr td td .hi :c", "tr td a.hi:c"], "tr td .hi :c"));
      assert.equals(true, dom.selectorGets('all', ["a b c tr td td .hi :c", "tr td a.hi:c :c"], "tr td .hi :c"));
      assert.equals(false, dom.selectorGets('all', ["a b c tr td td .hi :c", "td a.hi:c :c"], "tr td .hi :c"));
      
      assert.equals(false, dom.selectorGets('all', ['table td div', 'something_else td div#a'], '#a'));
      assert.equals(false, dom.selectorGets('all', ['table td#a div', 'something_else td div#a'], '#a'));
      assert.equals(true, dom.selectorGets('all', ['table td div#a', 'something_else td div#a'], '#a'));
      
      assert.equals(false, dom.selectorGets('all', ['table td div.a:nth-child(1)', 'something_else td div.a:nth-child(2)'], '.b'));
      assert.equals(true, dom.selectorGets('all', ['table td div.a:nth-child(1)', 'something_else td div.a:nth-child(2)'], '.a'));
      
      assert.equals(false, dom.selectorGets('all', [], '#b'));
      assert.equals(true, dom.selectorGets('none', [], '#b'));
      
      assert.equals(true, dom.selectorGets('none', ['table td div#a', 'something_else td div#a'], '#b'));
      assert.equals(true, dom.selectorGets('none', ['table td div#a', 'something_else td div#a'], 'table'));
      assert.equals(true, dom.selectorGets('none', ['table td div#a', 'something_else td table table div#a'], 'table'));
      assert.equals(false, dom.selectorGets('none', ['table td div#a table', 'something_else td div#a'], 'table'));
    },
    
    test_selectorGets: function () {
      var dom = new DomPredictionHelper();
      assert.equals(true, dom._selectorGets([['something_else'], ['td'], ['div', '#a']], [['div', '#a']]));
      assert.equals(false, dom._selectorGets([['something_else'], ['td'], ['div', '#a']], [['div', '#a', ':blah']]));
      assert.equals(true, dom._selectorGets([['something_else'], ['a'], ['div', '#a']], [['a'], ['div', '#a']]));
    },
    
    testFragmentSelector: function () {
      var dom = new DomPredictionHelper();
      assert.equals("body", dom.fragmentSelector("body div")[0][0][0]);
      assert.equals("div", dom.fragmentSelector("body div")[0][1][0]);
      assert.equals("div", dom.fragmentSelector("body div:nth-child(1)")[0][1][0]);
      assert.equals(":nth-child(1)", dom.fragmentSelector("body div:nth-child(1)")[0][1][1]);
      assert.equals("div", dom.fragmentSelector("hello,body div")[1][1][0]);
      assert.equals("div", dom.fragmentSelector("  hello , body div       ")[1][1][0]);

      assert.equals("c", dom.fragmentSelector("a b c.d:e :f")[0][2][0]);
      assert.equals(".d", dom.fragmentSelector("a b c.d:e :f")[0][2][1]);
      assert.equals(":e", dom.fragmentSelector("a b c.d:e :f")[0][2][2]);
      assert.equals(":f", dom.fragmentSelector("a b c.d:e :f")[0][3][0]);
    },
    
    testWouldLeaveFreeFloatingNthChild: function () {
      var dom = new DomPredictionHelper();
      assert(dom.wouldLeaveFreeFloatingNthChild(["a", ":nth-child(0)", " ", "div"], 0));
      refute(dom.wouldLeaveFreeFloatingNthChild(["a", ":nth-child(0)", " ", "div"], 1));
      refute(dom.wouldLeaveFreeFloatingNthChild(["a", ":nth-child(0)", " ", "div"], 2));
      refute(dom.wouldLeaveFreeFloatingNthChild(["a", ":nth-child(0)", " ", "div"], 3));
      
      refute(dom.wouldLeaveFreeFloatingNthChild(["div", ".hi", " ", "a", ":nth-child(0)", " ", "div"], 0));
      refute(dom.wouldLeaveFreeFloatingNthChild(["div", ".hi", " ", "a", ":nth-child(0)", " ", "div"], 1));
      refute(dom.wouldLeaveFreeFloatingNthChild(["div", ".hi", " ", "a", ":nth-child(0)", " ", "div"], 2));
      assert(dom.wouldLeaveFreeFloatingNthChild(["div", ".hi", " ", "a", ":nth-child(0)", " ", "div"], 3));
      refute(dom.wouldLeaveFreeFloatingNthChild(["div", ".hi", " ", "a", ":nth-child(0)", " ", "div"], 4));
      refute(dom.wouldLeaveFreeFloatingNthChild(["div", ".hi", " ", "a", ":nth-child(0)", " ", "div"], 5));
      
      assert(dom.wouldLeaveFreeFloatingNthChild(["div", ".hi", " ", "a", ":nth-child(0)"], 3));
      refute(dom.wouldLeaveFreeFloatingNthChild(["div", ".hi", " ", "a", ":nth-child(0)"], 4));
      
      assert(dom.wouldLeaveFreeFloatingNthChild(["a", ":nth-child(0)"], 0));
      refute(dom.wouldLeaveFreeFloatingNthChild(["a", ":nth-child(0)"], 1));
      
      refute(dom.wouldLeaveFreeFloatingNthChild(["a"], 0));
      refute(dom.wouldLeaveFreeFloatingNthChild([":nth-child(0)"], 0));
    }
    
    // testCssToXPath: function () {
    //   var dom = new DomPredictionHelper();
      
    //   var expressions = ['a', '#leaf1', 'body #leaf1', 'span.sibling.something.else', 'a , b , #leaf1', 
    //                      'span.sibling', '.else.something', ':nth-child(2) i#leaf1', 'span.something.else:nth-child(2) i#leaf1'];
      
    //   for (var i = 0; i < expressions.length; i++) {
    //     var css = expressions[i];
    //     var xpath = dom.cssToXPath(css);
    //     if (!cssAndXPathMatch(css, dom.cssToXPath(css))) {
    //       console.log(css + ' LIKE ' + xpath);
    //     }
    //   }
    // }
    
    // cssAndXPathMatch: function (css, xpath) {
    //   var css_matches = jQuery(css);
    //   var elements = [];
    //   for (var i = 0; i < css_matches.length; i++) {
    //     elements.push(css_matches.get(i));
    //   }
      
    //   var elems = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
    //   var elem = elems.iterateNext();
    //   var pos = -1;
    //   while (elem){
    //     pos = jQuery.inArray(elem, elements);
    //     if (pos == -1) {
    //       return false;
    //     } else {
    //       elements.splice(pos, 1);
    //     }
    //     var elem = elems.iterateNext();
    //   }
    //   if (elements.length == 0) return true;
    //   return false;
    // }

  });

});