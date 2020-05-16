const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./module/template.js');
const path = require('path');

const app = http.createServer(function(request,response){
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    let filteredId;
    if (queryData.id !== undefined){
      filteredId = path.parse(queryData.id).base;
    }


    let title = queryData.id;
    let list = '';
    let description = '';
    let button = '';
    let body = '';

    switch(pathname){
      case '/':
        button = "writer";
        if (title === undefined){
            title = 'Welcome';
            button = "reader";
            filteredId = "Welcome";
        }

        fs.readdir(`./data`, function(error, fileList){

          fs.readFile(`./data/${filteredId}`, function(error, data){
            description = data;

            let page = template.html(title, description, fileList, button);

            response.writeHead(200);
            response.end(page);
          })
        });
        break;

        case '/create':
          title = 'WEB - Create';
          button = "none";

          fs.readdir(`./data`, function(error, fileList){

            let page = template.html(title,  description, fileList, button, "create")

            response.writeHead(200);
            response.end(page);
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
          button = "none";

          fs.readdir(`./data`, function(error, fileList){

            fs.readFile(`./data/${filteredId}`, function(error, data){
              description = data;

              let page = template.html(title, description, fileList, button, "update");

              response.writeHead(200);
              response.end(page);
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
