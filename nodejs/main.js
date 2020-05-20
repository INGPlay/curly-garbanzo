const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./module/template.js');
const path = require('path');
const database = require('./module/database.js');

const app = http.createServer(function(request,response){
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    let filteredId;
    if (queryData.id !== undefined){
      filteredId = path.parse(queryData.id).base;
    }

    let title = '';
    let description = '';
    let button = '';
    let page = '';
    let nickname = '';
    //process 변수
    let body = '';
    let id = '';
    let authorID = '';

    switch(pathname){
      case '/':

        database.query('SELECT * FROM topic', function(error, topics){
          if (error){
            throw error;
          }

          database.query(`SELECT title, description, name FROM topic LEFT JOIN author ON topic.authorID = author.id WHERE topic.id = ?`, 
          [filteredId], 
          function(error2, topic){
            if (error2){
              throw error2;
            }

            if (filteredId === undefined){
              title = 'Welcome';
              description = 'Home';
              button = "reader";
            } else {
              title = topic[0].title;
              description = topic[0].description;
              button = 'writer';
              nickname = topic[0].name;
            }
            page = template.html(title, description, topics, button, filteredId, "read", nickname);

            response.writeHead(200);
            response.end(page);
          })
        });
        break;

        case '/create':

          database.query('SELECT * FROM topic', function(error, topics){
            if (error){
              throw error;
            }
            database.query('SELECT name FROM author', function(error2, authorList){
              if (error2){
                throw error2;
              }

              title = 'WEB - Create';
              button = "none";
  
              page = template.html(title, description, topics, button, filteredId, "create", authorList);
  
              response.writeHead(200);
              response.end(page);
            })
          });
          break;

        case '/create_process':

          request.on('data', function(data){
            body += data;
          }).on('end', function(){
            const post = qs.parse(body);

            title = post.title;
            description = post.description;
            authorID = post.author;
            database.query('INSERT INTO topic (title, description, created, authorID) VALUES(?, ?, NOW(), ?)', 
            [title, description, authorID], 
            function(error, data){
              if (error){
                throw error;
              }

              response.writeHead(302, {Location: `/?id=${data.insertId}`});
              response.end();
            })
          });

          break;

        case '/update':

          button = "none";

          database.query(`SELECT * FROM topic`, function(error, topicList){
            if (error){
              throw error;
            }
            database.query(`SELECT title, description FROM topic WHERE id = ?`, [filteredId], function(error2, topic){
              if (error2){
                throw error2;
              }
              database.query(`SELECT name FROM author`, function(error3, authorList){
                if (error3){
                  throw error3;
                }
                database.query(`SELECT authorID FROM topic WHERE id = ?`, 
                [filteredId], 
                function(error4, authorID){

                  title = topic[0].title;
                  description = topic[0].description;
                  authorIDNum = authorID[0].authorID;
    
                  page = template.html(title, description, topicList, button, filteredId, "update", authorList, authorIDNum);
    
                  response.writeHead(200);
                  response.end(page);
                })
              })
            })
          });

          break;

        case '/update_process':
          request.on('data', function(data){
            body += data;
          }).on('end', function(){
            const post = qs.parse(body);

            title = post.title;
            description = post.description;
            id = post.id;
            authorID = post.author;

            database.query(`UPDATE topic SET title = ?, description = ?, created = NOW(), authorID = ? WHERE id = ?`,
            [title, description, authorID, id],
            function(error, data){
              if (error){
                throw error;
              }
              response.writeHead(302, {Location: `/?id=${id}`});
              response.end();
            })
          })

          break;

        case '/delete_process':
          request.on('data', function(data){
            body += data;
          }).on('end', function(){
            let post = qs.parse(body);

            id = post.id;

            database.query(`DELETE FROM topic WHERE id = ?`, 
            [id],
            function(error, data){
              if (error){
                throw error;
              }
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
