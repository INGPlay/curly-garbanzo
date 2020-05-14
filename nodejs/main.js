const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer(function(request,response){
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    let title = queryData.id;
    let description = 'Hello Node.Js';
    if(pathname === '/'){
      if (title === undefined){
          title = 'Welcome';
      }

      let list = '';
      fs.readdir(`./data`, function(error, fileList){
        // 목록 만들기
        list += '<ul>'
        for (let i = 0; i < fileList.length; i++){
          const file = fileList[i];
          if (file === 'Welcome'){
            continue;
          }

          list += `<li><a href="/?id=${file}">${file}</a></li>`;
        }
        list += '</ul>';
        // 페이지 형식
        let template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
        `;

        response.writeHead(200);
        response.end(template);
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});

app.listen(3000);
