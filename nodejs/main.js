const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const app = http.createServer(function(request,response){
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    let title = queryData.id;
    let description = '';
    let list = '';
    let body = '';
    let createOrUpdate =`
    <a href = "/create">create</a>
    <a href = '/update?id=${title}'>update</a>
    <form action="delete_process" method="post">
      <input type="hidden" name="id" value="${title}">
      <input type="submit" value="delete">
    </form>`;
    switch(pathname){
      case '/':
        if (title === undefined){
            title = 'Welcome';
            createOrUpdate = '<a href = "/create">create</a>';
        }

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

          fs.readFile(`./data/${title}`, function(error, data){
            description = data;

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
                ${createOrUpdate}
                <h2>${title}</h2>
                <p>${description}</p>
              </body>
              </html>
            `;

            response.writeHead(200);
            response.end(template);
          })
        });
        break;

        case '/create':
          title = 'WEB - Create';
          createOrUpdate = '';

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
                ${createOrUpdate}
                <h2>${title}</h2>
                <p>
                  <form action = "/create_process" method ="post">
                    <p>
                      <input type="text" name = "title" placeholder = "title">
                    </p>
                    <p>
                      <textarea name = "description" placeholder = "description"></textarea>
                    </p>
                    <p>
                      <input type="submit">
                    </p>
                  </form>
                </p>
              </body>
              </html>
            `;

            response.writeHead(200);
            response.end(template);
          });
          break;

        case '/create_process':
          request.on('data', function(data){
            body += data;
          }).on('end', function(){
            let post = qs.parse(body);
            title = post.title;
            description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf-8', function(error){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });

          break;

        case '/update':
          createOrUpdate = '';

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

            fs.readFile(`./data/${title}`, function(error, data){
              description = data;

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
                  ${createOrUpdate}
                    <form action = "/update_process" method ="post">
                      <input type = "hidden" name = "id" value = "${title}">
                      <p>
                        <input type="text" name = "title" value = "${title}" placeholder = "title">
                      </p>
                      <p>
                        <textarea name = "description" placeholder = "description">${description}</textarea>
                      </p>
                      <p>
                        <input type="submit">
                      </p>
                    </form>
                </body>
                </html>
              `;

              response.writeHead(200);
              response.end(template);
            })
          });
          break;

        case '/update_process':
          request.on('data', function(data){
            body += data;
          }).on('end', function(){
            let post = qs.parse(body);
            title = post.title;
            description = post.description;
            const id = post.id;

            fs.rename(`data/${id}`, `data/${title}`, function(error){
              fs.writeFile(`data/${title}`, description, 'utf-8', function(error){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
              })
            })
          });
          break;

        case '/delete_process':
          request.on('data', function(data){
            body += data;
          }).on('end', function(){
            let post = qs.parse(body);
            const id = post.id;

            fs.unlink(`./Data/${id}`, function(error){
              response.writeHead(302, {Location: `/`});
              response.end();
            })
          });
          break;

        default:
          response.writeHead(404);
          response.end('Not found');
          break;
    }
});

app.listen(3000);
