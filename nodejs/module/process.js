// fuction
const database = require('./database.js');
const queryString = require('querystring');
const sanitizeHtml = require('sanitize-html');

// 입력되어 들어오는 데이터는 다 sanitize 할 것!!!
const process = {
    create(request, response) {
        let body = '';
        request.on('data', function(data){
            body += data;
        }).on('end', 
        function(){
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

                response.redirect(302, `/page/${data.insertId}`);
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

                response.redirect(302, `/page/${id}`);
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

                response.redirect(302, `/`);
            })
        });
    },
    createAuthor(request, response){
        let body = '';
        request.on('data', function(data){
            body += data;
        }).on('end', function(){
            let post = queryString.parse(body);

            const name = sanitizeHtml(post.name);
            const profile = sanitizeHtml(post.profile);

            database.query('INSERT INTO author (name,profile) VALUES(?, ?)',
            [name, profile],
            function(error, data){
                if (error){
                    throw error;
                }

                response.redirect(302, `/author`);
            })
        })
    },
    updateAuthor(request, response) {
        let body = '';
        request.on('data', function(data){
            body += data;
        }).on('end', function(){
            let post = queryString.parse(body);

            const name = sanitizeHtml(post.name);
            const profile = sanitizeHtml(post.profile);
            const authorID = post.id;

            database.query(`UPDATE author SET name = ?, profile = ? WHERE id = ?`,
            [name, profile, authorID],
            function(error, data){
                if (error){
                    throw error;
                }

                response.redirect(302, `/author`);
            })
        })
    },
    deleteAuthor(request, response) {
        let body = '';
        request.on('data', function(data){
            body += data;
        }).on('end', function(){
            let post = queryString.parse(body);

            const authorID = post.authorID;

            database.query(`DELETE FROM author WHERE id = ?`,
            [authorID],
            function(error, data){
                if (error){
                    throw error;
                }
                
                database.query(`DELETE FROM topic WHERE authorID = ?`,
                [authorID],
                function(error2, data){
                    if (error2){
                        throw error2;
                    }

                    response.redirect(302, `/author`);
                })
            })
        })
    }
}
module.exports = process;