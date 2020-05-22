const http = require('http');
const url = require('url');
const path = require('path');
const template = require('./module/templateRefactoring.js');
const process = require('./module/process.js');


const app = http.createServer(function(request,response){
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    let queryID;
    if (queryData.id !== undefined){
      queryID = path.parse(queryData.id).base;
    }
    
    const pathname = url.parse(_url, true).pathname;
    switch(pathname){
        case '/':
            if (queryID === undefined){
                template.html(response, "home", queryID);
            } else {
                template.html(response, "read", queryID);
            }

            break;

        case '/create':
            template.html(response, "create", queryID);

            break;

        case '/create_process':
            process.create(request, response);

            break;

        case '/update':
            template.html(response, "update", queryID);

            break;

        case '/update_process':
            process.update(request, response);

            break;

        case '/delete_process':
            process.delete(request, response);

            break;

        default:
            response.writeHead(404);
            response.end('Not found');

            break;
    }
});

app.listen(3000);
