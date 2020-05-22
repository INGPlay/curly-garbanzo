const database = require('./database.js');
const queryString = require('querystring');
const sanitizeHtml = require('sanitize-html');

const process = {
    create(request, response) {
        let body = '';
        request.on('data', function(data){
            body += data;
        }).on('end', function(){
            const post = queryString.parse(body);

            const title = sanitizeHtml(post.title);
            const description = sanitizeHtml(post.description);
            const authorID = post.author;

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
    },
    update(request, response) {
        let body = '';
        request.on('data', function(data){
            body += data;
        }).on('end', function(){
            const post = queryString.parse(body);

            const title = sanitizeHtml(post.title);
            const description = sanitizeHtml(post.description);
            const id = post.id;
            const authorID = post.author;

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
    },
    delete(request, response) {
        let body = '';
        request.on('data', function(data){
            body += data;
        }).on('end', function(){
            let post = queryString.parse(body);

            const id = post.id;

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
    }
}
module.exports = process;