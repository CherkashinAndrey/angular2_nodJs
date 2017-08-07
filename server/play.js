(function() {

var debugging = false;

/*
 * Main BrowserPlayback Class
 */
class BrowserPlayback {
  constructor(capture, hasInitialHtml) {
    this.hasInitialHtml = !!hasInitialHtml;
    this.hydratedInitialState = false;
    this.paused = false;
    this.nextFrame = 0;
    this.stopped = true;
    this.cursorSize = 11;
    this.displayCursor = true;
    this.allDataLoaded = false;

    this.idTable = {};

    this.events = {
      play: [],
      pause: [],
      stop: [],
      complete: [],
      time: []
    };

    if (capture)
      this.setCapture(capture);

    // simple keyboard shortcuts
    document.addEventListener('keypress', (e) => {
      if (e.ctrlKey) {
        // Ctrl + Alt + P = toggle play / pause
        if (e.keyCode == 32) {
          if (this.paused || this.stopped)
            this.play();
          else
            this.pause();
        }
      }
    });
  }
  play(hasInitialHtml) {
    if (this.paused) {
      this.paused = false;
      this.stopped = false;
      this.startTime = new Date().getTime() - this.runningTime;
      this.fireEvent('play');
      this.render();
    }
    else if (this.stopped) {
      this.createInitialState();
      this.nextFrame = 0;
      this.runningTime = 0;
      this.stopped = false;

//window.audio = document.createElement('audio');
//window.audio.src="http://localhost:8081/recorderTab.webm"
//window.audio.oncanplay = () => {
      this.startTime = new Date().getTime();
//window.audio.play();
      this.fireEvent('play');
      this.render();
//}


    }
  }
  pause() {
    if (this.paused)
      return;
    this.paused = true;
    this.fireEvent('pause');
  }
  stop() {
    if (this.stopped)
      return;
    this.stopped = true;
    this.paused = false;
    this.createInitialState();
    this.fireEvent('stop');
  }
  showCursor() {
    this.displayCursor = true;
  }
  hideCursor() {
    this.displayCursor() 
  }

  createInitialState() {
    // set state to initial state
    var initialState = this.initialState;

    // set the initial page HTML (bookmarklet only)
    // skip if already set
    if (!this.hasInitialHtml) {
      Object.keys(initialState.htmlAttributes).forEach(function(attr) {
        Array.prototype.forEach.call(document.documentElement.attributes, (attr) => {
          document.documentElement.removeAttribute(attr);
        });
        document.documentElement.setAttribute(attr, initialState.htmlAttributes[attr]);
      });
      document.documentElement.innerHTML = initialState.html;

      // populate the id table for the new DOM
      this.idTable = {};
      var child = document.documentElement.childNodes[0];
      while (child) {
        this.populateIdTable(child);
        child = child.nextSibling;
      }

      this.hasInitialHtml = true;
    }

    // hydrate server HTML with ids
    if (!this.hydratedInitialState) {
      var child = document.documentElement.childNodes[0];
      while (child) {
        this.populateIdTable(child);
        child = child.nextSibling;
      }
      this.hydratedInitialState = true;
    }

    // set the page screen size
    // this uses outer heights while what is captured is inner height
    // we have the 22px offset for the size of the titlebar in chrome (which will vary for other playback variations)
    var delta = document.scrollHeight === document.offsetHeight ? 0 : 16;
    window.resizeTo(initialState.screenWidth + delta, initialState.screenHeight + 22);

    window.scroll(0, 0);

    // set all scroll element positions
    Object.keys(initialState.scrolls).forEach((id) => {
      var el = this.getNode(id);
      if (!el)
        return //throwError('Unable to find element ' + id + ' to set scroll');
      el.scrollTop = initialState.scrolls[id].top;
      el.scrollLeft = initialState.scrolls[id].left;
    });

    // set the active element on the page (eg ensure search text box has cursor blinking etc)
    var activeNode = this.getNode(initialState.activeElement);
    if (!activeNode)
      throwError('Cant find active node');
    else
      activeNode.focus && activeNode.focus();
    
    // create the cursor
    if (!this.cursorEl || this.cursorEl.parentNode != document.body) {
      var cel = this.cursorEl = document.createElement('div');
      cel.setAttribute('record-id', '0');
      cel.style.height = this.cursorSize + 'px';
      cel.style.width = this.cursorSize + 'px';
      cel.style.position = 'fixed';
      cel.style.display = 'none';
      cel.style.backgroundColor = '#e11';
      cel.style.zIndex = '10000000';
      cel.style.borderRadius = '20px';
      cel.style.transition = 'background-color 0.2s';
      document.body.insertBefore(cel, document.body.firstChild);
    }
  }

  setCapture(capture) {
    this.timeline = capture.timeline;
    this.totalTime = capture.timeline.reduce((total, frame) => total + frame.time, 0);
    this.initialState = capture.initialState;

    this.hydratedInitialState = false;
    this.createInitialState();
  }

  /*
   * Simple eventing to bind to playback events
   */
  on(evt, callback) {
    this.addListener(evt, callback);
  }
  addListener(evt, callback) {
    if (!this.events[evt])
      return //throwError('Unknown event ' + evt);
    this.events[evt].push(callback);
  }
  removeListener(evt, callback) {
    if (!this.events[evt])
      return //throwError('Unknown event ' + evt);
    var index = this.events[evt].find(callback);
    if (index != -1)
      this.events[evt].splice(index, 1);
  }
  fireEvent(evt, arg) {
    if (!this.events[evt])
      return //throwError('Unknown event ' + evt);
    this.events[evt].forEach((evt) => evt.call(this, arg));
  }

  /*
   * Render function
   * Renders any new frames up to the current time
   */
  render() {
    // render all frames up to the current time
 
    var frame = this.timeline[this.nextFrame];
    var timestamp = new Date().getTime();

    // DOM frames batch, input frames wait on requestAnimationFrame to ensure render
    var batchFrames = true;
    this.hasInitialHtml = false;

    while (frame && batchFrames && this.runningTime + frame.time <= timestamp - this.startTime) (function() {
      if (frame.type != 'attributes' && frame.type != 'innerHTML' && frame.type != 'childList' && 
          frame.type != 'clearNodeMemory' && frame.type != 'characterData')
        batchFrames = false;
      // debugging
      if (debugging && batchFrames)
        console.log(frame);
      this.applyFrame(frame);
      this.runningTime += frame.time;
      this.fireEvent('time', this.runningTime);



      frame = this.timeline[++this.nextFrame];
    }).call(this);

    if (this.paused || this.stopped)
      return;

    // if there are still frames to render in future, return to the animation loop
    if (frame) {
      requestAnimationFrame(this.render.bind(this));
      return;
    } else 
    if (!this.allDataLoaded && this.nextFrame >= this.timeline.length) {

      this.pause();

      if (this.tempTimelineData) {
        this.timeline = this.tempTimelineData;
        this.tempTimelineData = null;
        this.nextFrame = 0;
        this.getTempData();
        this.stopped = false;
        this.play();
        requestAnimationFrame(this.render.bind(this));
        return
      } else 
      if (this.isRequesting) {
        this.isRequesting.then( data => {
          this.timeline = data.timeline;
          this.isRequesting = false;
          this.play();
        })
      } else {
        this.getNextData()
        .then( data => {
          if (!data) return
          if (data.timeline) {
            this.timeline = data.timeline;
            this.nextFrame = 0;
            this.stopped = false;
          }
          if (data.initialState) {
            this.setCapture({
              timeline: data.timeline,
              initialState: data.initialState
            });
          }
          this.getTempData();
          this.play();
          requestAnimationFrame(this.render.bind(this));
        });
      }
    }

    this.cursorEl.style.display = 'none';
    this.stopped = true;
    this.fireEvent('complete');
  }


  /*
   * Apply the given mutation frame to the page
   */
  applyFrame(frame) {
    var cel = this.cursorEl;
    switch (frame.type) {
      /*
       * Mouse events
       */
      case 'mousemove':
        cel.style.top = (frame.top - Math.ceil(this.cursorSize / 2)) + 'px';
        cel.style.left = (frame.left - Math.ceil(this.cursorSize / 2)) + 'px';
        if (this.displayCursor)
          cel.style.display = 'block';
        else
          cel.style.display = 'none';
      break;
      case 'mousedown':
        this.cursorSize += 4;
        cel.style.width = this.cursorSize + 'px';
        cel.style.height = this.cursorSize + 'px';
        cel.style.top = (parseInt(cel.style.top) - 2) + 'px';
        cel.style.left = (parseInt(cel.style.left) - 2) + 'px';
        cel.style.backgroundColor = '#611';
      break;
      case 'mouseup':
        this.cursorSize -= 4;
        cel.style.width = this.cursorSize + 'px';
        cel.style.height = this.cursorSize + 'px';
        cel.style.top = (parseInt(cel.style.top) + 2) + 'px';
        cel.style.left = (parseInt(cel.style.left) + 2) + 'px';
        cel.style.backgroundColor = '#e11';
      break;

      /*
       * Scroll events
       */
      case 'scroll':
        var el = frame.id && this.getNode(frame.id) || document.scrollingElement;
        if (!('scrollLeft' in el))
          return //throwError('Element does not support scrolling');
        el.scrollLeft = frame.left;
        el.scrollTop = frame.top;
      break;

      /*
       * DOM Input events
       */
      case 'input':
      case 'change':
        var node = this.getNode(frame.id);
        if (!node)
          return //throwError('Node ' + frame.id + ' not found for text input event');
        if (!('type' in node))
          return //throwError('Node ' + frame.id + ' is not a valid input control');
        if (node.type == 'radio' || node.type == 'checkbox')
          node.checked = frame.value;
        else
          node.value = frame.value;
      break;

      case 'focus':
        var node = this.getNode(frame.id);
        if (!node || !node.focus)
          return; //throwError('Node ' + frame.id + ' does not support focus');
        node.focus();
      break;

      case 'blur':
        var node = this.getNode(frame.id);
        if (!node || !node.blur)
          return; //throwError('Node ' + frame.id + ' does not support blur');
        node.blur();
      break;

      /*
       * Video tag events
       */
      case 'videoplay':
        var node = this.getNode(frame.id);
        if (!node)
          return //throwError('Node ' + frame.id + ' not found for video event');
        node.src = frame.src;
        node.currentTime = frame.timestamp;
        node.play();
      break;
      case 'videopause':
        var node = this.getNode(frame.id);
        if (!node)
          return //throwError('Node ' + frame.id + ' not found for video event');
        node.currentTime = frame.timestamp;
        node.pause();
      break;
      
      case 'webkitfullscreenchange':
        /*var node = this.getNode(frame.id);
        if (!node)
          return throwError('Node ' + frame.id + ' not found for video event');
        node.webkitRequestFullscreen();*/
      break;      

      /*
       * DOM Mutator Events
       */
      // attributes
      case 'attributes':
        var node = this.getNode(frame.id);
        if (!node)
          return //throwError('Node ' + frame.id + ' not found for attributes event');
        if (!node.setAttribute)
          return //throwError('Node ' + frame.id + ' does not support attributes');
        node.setAttribute(frame.name, frame.value);
      break;

      // text node content change event
      case 'characterData':
        var node = this.getNode(frame.id);
        if (!node)
          return //throwError('Node ' + frame.id + ' not found for characterData event');
        node.nodeValue = frame.text;
      break;

      case 'innerHTML':
        var node = this.getNode(frame.id);
        if (!node)
          return //throwError('Node ' + frame.id + ' not found for innerHTML event');
        node.innerHTML = frame.html;
      break;

      case 'childList':
        var parentNode = this.getNode(frame.id);

        if (!parentNode)
          return //throwError('Parent node ' + frame.id + ' not found for childList event');

        var prevNode;
        if (frame.previousId) {
          prevNode = this.getNode(frame.previousId);
          if (!prevNode)
            return //throwError('Previous node ' + frame.id + ' not found for childList event');
        }

        frame.remove && frame.remove.forEach((removeId) => {
          var node = this.getNode(removeId);

          if (!node)
            return //throwError('Remove node ' + removeId + ' not found');

          // for removal verify its where we want it
          if (node.parentNode != parentNode)
            return //throwError('Incorrect parent node for removal of ' + removeId);

          node.remove();
        });
        
        frame.add && frame.add.forEach((addObj) => {
          // add an existing element
          if (addObj.id) {
            var node = this.getNode(addObj.id);
            if (!node)
              return //throwError('Existing add node ' + addObj.id + ' not found');

            if (prevNode && prevNode.parentNode != parentNode)
              return //throwError('Previous node ' + frame.previousId + ' is not within the expected parent ' + frame.id);
            
            if (prevNode)
              parentNode.insertBefore(node, prevNode.nextSibling);
            else
              parentNode.insertBefore(node, parentNode.childNodes[0]);

            // update the previous node
            prevNode = node;
          }
          // add a new element via html injection
          else if (addObj.html) {
            var tpl = document.createElement('template');
            tpl.innerHTML = addObj.html;
            
            this.populateIdTable(tpl.content);

            var newPrevNode = tpl.content.childNodes[tpl.content.childNodes.length - 1];

            if (prevNode && prevNode.parentNode != parentNode)
              return //throwError('Previous node ' + frame.previousId + ' is not within the expected parent ' + frame.id);
            
            if (prevNode)
              parentNode.insertBefore(tpl.content, prevNode.nextSibling);
            else
              try {
                parentNode.insertBefore(tpl.content, parentNode.childNodes[0]);
              } catch(e) {
                console.log('error:', e);
              }

            // update the previous node
            prevNode = newPrevNode;
          }
          else {
            return //throwError('Invalid add item format');
          }
        });
      break;

      // a frame purely to allow memory sweeping of our id table
      case 'clearNodeMemory':
        frame.ids.forEach((id) => {
          this.idTable[id] = null;
        });
      break;

      case 'default':
        return //throwError('Unknwon frame ' + frame.type);
      break;
    }
  }

  /*
   * Retrieve a DOM Node by its assigned unique id
   */
  getNode(id) {
    return this.idTable[id];
  }

  /*
   * Trace a DOM tree populating the id table mapping ids to dom nodes
   */
  populateIdTable(el) {
    // skip record-id comments themselves
    if (el.nodeType == 8 && el.nodeValue.substr(0, 10) == 'record-id-')
      return;

    if (el.nodeType == 3 || el.nodeType == 8) {
      var id = el.previousSibling && el.previousSibling.nodeType == 8 && 
          el.previousSibling.nodeValue.substr(0, 10) == 'record-id-' && 
          el.previousSibling.nodeValue.substr(10);

      if (!id)
        return //throwError('No id present for text node');
      
      // remove the comment placeholder
      // el.previousSibling.remove();

      // el._recordid = id;

      if (!this.idTable[id]) //crutch for duplicate id
        this.idTable[id] = el;
    }
    else if (el.nodeType == 1) {
      var id = el.getAttribute('record-id');

      if (!id)
        return //throwError('No id present for element');

      // el.removeAttribute('record-id');

      // el._recordid = id;

      this.idTable[id] = el;
    }
    else if (el.nodeType != 11) {
      return //throwError('Unable to populate node of type ' + el.nodeType);
    }

    // child population for node and document fragment (to allow document fragment population)
    if (el.nodeType == 1 || el.nodeType == 11) {
      if (containerFilter.indexOf(el.tagName) == -1) {
        var child = el.childNodes[0];
        while (child) {
          this.populateIdTable(child);
          child = child.nextSibling;
        }
      }
    }
  }
}

var containerFilter = ['STYLE', 'NOSCRIPT', 'TITLE', 'SCRIPT'];

function throwError(msg) {
  if (debugging)
    throw new Error(msg);
  else
    setTimeout(() => {
      throw new Error(msg);
    });
}

/*
 * Init
 */
window.BrowserPlayback = BrowserPlayback;

// legacy bookmarklet support -> allow playback in same capture page
if (window.browserCapture) {
  browserCapture.stop();
  window.browserPlayback = new BrowserPlayback(browserCapture.getCapture(), false);

  // bind events for in-recording page playback
  window.browserPlayback.on('play', () => console.log('Playback started.'));
  window.browserPlayback.on('stop', () => console.log('Playback stopped.'));
  window.browserPlayback.on('pause', () => console.log('Playback paused.'));
  window.browserPlayback.on('complete', () => console.log('Playback complete.'));

  window.browserPlayback.play();

}
})();