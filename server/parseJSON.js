(function() {

  const pathToRecording = `http://${captureHost}:${capturePort}/recordings/getpart/`;

  let folderName = captureObj.folderName;
  let initialStateIndex = 0;
  let timelineIndex = 0;
  let initialStateMaxIndex;
  let timelineMaxIndex;
  let chunkSize = 300;
  let promiseArr = [];
  let recording = {};
  let tempTimelineData = null;
  let tempInitialStateData = null;

  getInitialState()
  .then( parseData )
  .then( createBrowserPlayback )
  .catch( error => console.log(error) );

  //getInitialData( 0 );
  
  /*Promise.all( promiseArr )
  .then( parseData )
  .then( createBrowserPlayback )
  .catch( err => {
    console.log( 'ERROR', err );
  })*/

  function sendRequest( url, method, data ) {
    return new Promise( ( res, rej ) => {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.addEventListener( 'readystatechange', () => {
        if ( xhr.readyState != 4 )
          return;

        if ( xhr.status != 200 ) {
          var msg;
          if ( xhr.status >= 500 < 600 ) {
            msg = 'Playback server error saving recording.';
          } else 
          if ( xhr.status >= 400 < 500 ) {
            msg = 'Error saving recording.';
          } else {
            msg = 'Error saving recording, ensure the playback server is running.'
          }
          if ( xhr.statusText ) {
            msg += xhr.statusText;
          }
          rej( msg );
        }

        res( xhr.responseText );
      });
      xhr.send( JSON.stringify( data ) );  
    })
  }

  function getInitialData( initialStateIndex ) {
    promiseArr = [
      sendRequest(`${pathToRecording}${folderName}/${folderName}-${initialStateIndex}.json`, 'GET', {}),
      sendRequest(`${pathToRecording}${folderName}/${folderName}-${initialStateIndex}-0.json`, 'GET', {}),
    ];
    if ( initialStateIndex === 0) {
      promiseArr.push(
        sendRequest(`${pathToRecording}${folderName}/${folderName}.json`, 'GET', {})
      );
    } 
  }

  function getData2( initialStateIndex, timelineIndex ) {
    return sendRequest(`${pathToRecording}${folderName}/${folderName}-${initialStateIndex}${timelineIndex !== undefined ? '-' + timelineIndex : ''}.json`, 'GET', {})
  }

  function parseData( dataArray ) {
    let tempObj = {};

    if (!Array.isArray( dataArray )) {
      dataArray = [dataArray];
    }

    dataArray.forEach( data => {
      var dataObj = JSON.parse( data );

      let { 
        _id, 
        _userID,
        _initialStateIndex, 
        _timelineIndex, 
        _chunkSize, 
        _timelineMaxIndex, 
        timeline, 
        initialState, 
        _initialStateMaxIndex } = dataObj;
      tempObj[_initialStateIndex] = tempObj[_initialStateIndex] || {};
      tempObj[_initialStateIndex]['timeline'] = tempObj[_initialStateIndex]['timeline'] || [];
      
      if ( !timeline ) {
        chunkSize = _chunkSize || chunkSize;
      }

      if ( _timelineMaxIndex !== undefined ) {
        timelineMaxIndex = Math.ceil(_timelineMaxIndex / _chunkSize);
      }

      if ( _initialStateMaxIndex !== undefined ) {
        initialStateMaxIndex = _initialStateMaxIndex;
      }

      if ( timeline ) {
        var startIndex = _timelineIndex * _chunkSize;
        tempObj[_initialStateIndex]['timeline'] = tempObj[_initialStateIndex]['timeline'] || new Array( _timelineMaxIndex );
        tempObj[_initialStateIndex]['timeline'].splice( startIndex, _chunkSize, ...timeline );
      }

      if ( initialState ) {
        Object.assign(tempObj[_initialStateIndex], {
          initialState
        });
      }

    });

    return tempObj;
  }

  function createBrowserPlayback(recording) {

    if (!recording[initialStateIndex]) {
      console.log('Error');
      return;
    }

    window.curPage = recording[initialStateIndex];

    if (!curPage) {
      console.log('Error');
      return
    }

    var initialHtml = curPage.initialState.html;

    var htmlTag = '<!DOCTYPE html><html';

    var setDisplayNone = false;

    Object.keys(curPage.initialState.htmlAttributes).forEach((attr) => {
      if (attr == 'style') {
        setDisplayNone = true;
        htmlTag += ' ' + attr + '="' + curPage.initialState.htmlAttributes[attr] + ';display:none;"';
      }
      else {
        htmlTag += ' ' + attr + '="' + curPage.initialState.htmlAttributes[attr] + '"';
      }
    });

    if (!setDisplayNone)
      htmlTag += ' style="display:none;"';
    htmlTag += '>';

    //document.querySelector('html').outerHTML = htmlTag + initialHtml + '</html>';
    document.write(htmlTag + initialHtml + '</html>');
    document.close();

    window.browserPlayback = new BrowserPlayback(curPage, true);
    document.documentElement.style.display = 'block';

    window.browserPlayback.createInitialState();
    window.browserPlayback.play();

    var title = document.title;
    document.title = title + ' (loading)';

    browserPlayback.on('play', () => {
      document.title = title + ' (playing)';
    });
    browserPlayback.on('pause', () => {
      document.title = title + ' (paused)';
    });
    browserPlayback.on('stop', () => {
      document.title = title + ' (stopped)';
    })
    browserPlayback.on('complete', () => {
      nextPage();
    });

    document.addEventListener('load', function() {
      document.documentElement.style.display = 'block';
      browserPlayback.createInitialState();
      browserPlayback.play();
    }, false);

    function nextPage() {

    }
    function prevPage() {

    }
  }

  function getInitialState(initialStateIndex = 0) {
    promiseArr = [
      sendRequest(`${pathToRecording}${folderName}/${folderName}-${initialStateIndex}.json`, 'GET', {}),
      //sendRequest(`${pathToRecording}${folderName}/${folderName}-${initialStateIndex}-0.json`, 'GET', {}),
    ];
    if ( initialStateIndex === 0) {
      promiseArr.push(
        sendRequest(`${pathToRecording}${folderName}/${folderName}.json`, 'GET', {})
      );
    } 
    return Promise.all(promiseArr);
  }

  BrowserPlayback.prototype.getNextData = function() {
    clearGarbage();

    if ( timelineMaxIndex && timelineIndex < timelineMaxIndex ) {
      return getData2(initialStateIndex, timelineIndex)
      .then( parseData )
      .then( data => {
        timelineIndex++;
        return data[initialStateIndex]
      })
    } else

    if ( initialStateIndex < initialStateMaxIndex ) {
      timelineIndex = 0;
      initialStateIndex++;
      window.scrollTo(0, 0);

      return getInitialState(initialStateIndex)
      .then( parseData )
      .then( data => {
        this.nextFrame = 0;
        timelineIndex = 0;
        this.setCapture({
          initialState: data[initialStateIndex].initialState,
          timeline: []
        });
        return getData2(initialStateIndex, timelineIndex)
        .then( parseData )
        .then( data => {
          timelineIndex++;
          return data[initialStateIndex]
        })
      })
    }

    return Promise.resolve();

  }

  BrowserPlayback.prototype.getTempData = function() {
    if ( timelineMaxIndex && timelineIndex < timelineMaxIndex && !tempTimelineData) {
      return this.isRequesting = getData2(initialStateIndex, timelineIndex)
      .then( parseData )
      .then( data => {
        this.tempTimelineData = data[initialStateIndex].timeline;
        this.isRequesting = null;
        timelineIndex++
        return data[initialStateIndex]
      })
    }

  }

BrowserPlayback.prototype.inc = function() {
  timelineIndex++;
}

  function clearGarbage() {
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
  }

})()