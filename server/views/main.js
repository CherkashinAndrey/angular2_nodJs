module.exports = function(o) {
	return `
    <!doctype html>
    <title>Browser Capture${o.section ? ' - ' + o.section : ''}</title>
    <style>
      body {
        padding: 15px;
        padding-top: 0;
        font-family: 'helvetica';
        color: #355;
        line-height: 1.5em;
        background-color: #eaeaea;
      }
      .container {
        <!--width: 300px;-->
      }
      h3 {
        clear: both;
        font-size: 18px;
        font-weight: 100;
      }
      a {
        font-size: 13px;
      }
      ul {
        list-style-type: none;
        padding-left: 10px;
      }
      ul.controls {
        height: 30px;
        margin-left: -10px;
      }
      ul.controls li {
        float: left;
        width: 30px;
        height: 30px;
        text-align: center;
        margin-right: 10px;
      }
      ul.controls li a.play {
        font-size: 18px;
        line-height: 28px;
      }
      ul.controls a.pause {
        font-size: 20px;
        line-height: 28px;
      }
      ul.controls a.next, ul.controls a.prev {
        line-height: 28px;
      }
      ul.controls li a {
        color: #6a3;
        text-decoration: none;
        font-size: 25px;
        line-height: 30px;
        vertical-align: middle;
      }
      ul.controls li a:hover {
        color: #8b1;
      }
      ul.controls li a:active {
        color: #481;
      }
      p {
        font-size: 12px;
        line-height: 1.4em;
      }
      .record_name {
        width: 500px;
        overflow: hidden;
        text-align: left;
      }
      .record_sub {
        width: 100px;
        text-align: left;
      }
      .record_date {
        width: 200px;
        text-align: left;
      }
    </style>
    <script>
      document.addEventListener('keypress', (e) => {
        if (e.ctrlKey && e.altKey && e.keyCode == 16)
          window.curPlayback && window.curPlayback.self && window.curPlayback.focus();
      });
    </script>
    <body>
      <div class="container">
        ${o.content}
      </div>
    </body>
  `
}