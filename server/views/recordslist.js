const utils = require('../app/utils/utils.js');

module.exports = function({recordings, domenname}) {
	return `

            <table>
            <tr>
              <th class="record_name">Recordings</th>
              <th class="record_date">Date</th>
              <th class="record_sub">Size</th>
              <th class="record_sub">Download</th>
              <th class="record_sub">Delete</th>
            </tr>
        
            ${recordings.reverse()
            .filter( item => utils.getExt( item.recording ) !== '.zip' )
            .map( item => {
              let zipFiles = recordings.filter( i => i.recording === item.recording + '.zip');
            return `
              <tr>
                <td><a href="javascript:window.curPlayback=window.open('http://${domenname}/recordingsparts/${item.recording}?1', '_blank', 'width=300,height=100,left=403')">${item.recording}</a></td>
                <td><span>${new Date(item.mtime).toLocaleString()}</span></td>
                <td>${zipFiles.length ? `${Math.round(zipFiles[0].size / 1024 / 1024)} Mb` : '-'}</td>
                <td>${zipFiles.length ? `<a href="http://${domenname}/pdf/${item.recording}.zip">PDF</a>` : '-'}</td>
                <td><a href="http://${domenname}/delete/${item.recording}">X</a></td>
              </tr>`
            }).join('\n')}
            </table>` 
}