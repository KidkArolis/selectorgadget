# SelectorGadget

This is a fork of [SelectorGadget bookmarklet](https://github.com/iterationlabs/selectorgadget).

This version can currently only be used in other projects as a library. The bookmarklet build version might be added later.

## Usage

It can be installed in your project using [volo](https://github.com/volojs/volo)

    volo add KidkArolis/selectorgadget

And then used in your code like so

    define(["selectorgadget"], function (SelectorGadget) {

      var sg = new SelectorGadget();
      sg.setSelector("#menu li");
      sg.setSelector();
      sg.onChangeSelector = function (selector) {
        console.log("the new selector is", selector);
      };
      sg.destroy();

    });

## Development

To run the tests make sure you have buster and buster-amd

    npm install -g buster # to install buster globally (you could also install it locally)    
    npm install # to install buster-amd locally
    
Then simply run

    buster server

Open localhost:1111 in your browsers and capture them and run

    buster test

or

    buster autotest

## Release Notes

### 0.5.2

  - setSelector() now takes an options object, where silent: true can be used to supress onChangeSelector function call

### 0.5.1

  - ignore children of elements with class .sg_ignore

### 0.5.0

  - this is where the forked version branches off
  - convert all the files to AMD
  - convert all tests to buster.js tests
  - add tests for library's public interface
  - onChangeSelector() is called every time the selector changes
  - add setSelector()
  - rename unbind() to destroy()
  - remove analytics()
  - use jQuery event delegation instead of binding to all elements
  - uncomment removeEventHandlers function
  - use diff_match_patch library as a local dependency for now
  - create a package.json file
  - configure jquery and require.js as dependencies in package.json/volo
  - add .jshintrc file

### 0.4.1

  - All copyright holders need to agree to license, temporarily in license limbo.

### 0.4.0

  - By default, once you have something selected, rejection is preferred - change with the shift key.
  - Bug fix with item rejection

### 0.3.9

  - Released under the MIT License (see 0.4.1, this was premature as all copyright holders did not agree)

### 0.3.8

  - Help change

### 0.3.7

  - Pushed to stable
  - Couple of bug fixes

### 0.3.6
  - moved to jQuery 1.3.1 which fixed SelectorGadget loading bugs on certain sites

### 0.3.5

  - use new selector engine
  - few UI changes and bug fixes

### 0.3.4

  - bug fixes

### 0.3.3

  - block highlighting of the ancestors of selected elements
  - better blocking of click events
  - Pretty loading message if you update your bookmarklet

### 0.3.2 (12/04/08)

  - better tag naming
  - removal of interface clutter

### 0.3.1 (11/23/08)

  - jQuery non-conflict mode

### 0.3.0 (11/22/08)

  - Enable / disable
  - Show highlighted tag name

### 0.2.2 (11/19/08)

  - Internal refractor, won't clobber namespaces now
