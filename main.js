/**
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 **/

 chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
  	id: "nyutubID",
    innerBounds: {
      height: 600,
      width: 1000,
      top: 100,
      left: 100
    },
    alwaysOnTop: false,
    frame: 'none'
  });
});
