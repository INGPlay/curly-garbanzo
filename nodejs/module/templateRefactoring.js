// object
const database = require('./database.js');
const buttonSelector = require('./buttonSelector.js');
const listMaker = require('./listMaker.js');
// function
const authorSelector = require('./authorSelector.js');
const form = require('./form.js');


const template = {
    home(response){

        database.query(`SELECT topic.id, title, authorID, name FROM topic LEFT JOIN author ON topic.authorID = author.id`,
        (error2, threadList) => {
            if (error2){
                throw error2;
            }
            const list = listMaker.thread(threadList);
    
            const title = 'Home';
            const description = 'Welcome';
            const button = buttonSelector.oneButton();
            const pageTitle = title;
        
            const content = `
                <h2>${title}</h2>
                <p>${description}</p>
            `;
    
            // 페이지 결합
            const template = form(pageTitle, list, button, content)
            response.send(template);
        });
    },
    read(request, response){

        const param = request.params.pageID;

        database.query(`SELECT topic.id, title, authorID, name FROM topic LEFT JOIN author ON topic.authorID = author.id`,
        function(error, threadList){
            if (error){
                throw error;
            }
    
            database.query(`SELECT * FROM topic LEFT JOIN author ON topic.authorID = author.id WHERE topic.id = ?`,
            [param],
            function(error2, thread){
                if (error2){
                    throw error2;
                }
    
                const title = thread[0].title;
                const description = thread[0].description;
                const byAuthor = `by ${thread[0].name}`;
    
                const content = `
                    <h2>${title}</h2>
                    <p>${description}</p>
                    ${byAuthor}
                `;
    
                const pageTitle = title;
                const list = listMaker.thread(threadList);
                const button = buttonSelector.threeButton(param);
        
                // 페이지 결합
                const template = form(pageTitle, list, button, content)
                response.send(template);
            });
        });
    },
    create(response){

        database.query(`SELECT topic.id, title, authorID, name FROM topic LEFT JOIN author ON topic.authorID = author.id`,
        function(error, threadList){
            if (error){
                throw error;
            }
    
            database.query(`SELECT * FROM author`,
            function(error2, authorList){
                if (error2){
                    throw error2;
                }
    
                const selector = authorSelector(authorList);
    
                const linkTo = '/create_process';
                const titleStr = 'title';
                const descriptionStr = 'description';
    
                const content = `
                    <p>
                        <form action = "${linkTo}" method ="post">
                            <p>
                                <input type="text" name = "${titleStr}" placeholder = "${titleStr}">
                            </p>
                            <p>
                                <textarea name = "${descriptionStr}" placeholder = "${descriptionStr}"></textarea>
                            </p>
                            <p>
                                ${selector}
                            </p>
                            <p>
                                <input type="submit">
                            </p>
                        </form>
                    </p>
                `;
    
                const button = buttonSelector.none();
                const list = listMaker.thread(threadList);
                const pageTitle = 'Create';
            
                // 페이지 결합
                const template = form(pageTitle, list, button, content);
    
                response.send(template);
            });
        });
    },
    update(request, response){

        const pageID = request.params.pageID;

        database.query(`SELECT topic.id, title, authorID, name FROM topic LEFT JOIN author ON topic.authorID = author.id`,
        function(error, threadList){
            if (error){
                throw error;
            }
    
            database.query(`SELECT * FROM author`,
            function(error2, authorList){
                if (error2){
                    throw error2;
                }
    
                database.query(`SELECT * FROM topic LEFT JOIN author ON topic.authorID = author.id WHERE topic.id = ?`,
                [pageID],
                function(error3, thread){
                    if (error3){
                        throw error3;
                    }
    
                    const id = pageID;
    
                    const selector = authorSelector(authorList, thread[0].authorID);
                    const title = thread[0].title;
                    const description = thread[0].description;
                    
                    const linkTo = '/update_process';
                    const titleStr = 'title';
                    const descriptionStr = 'description';
                    const idStr = 'id';
                
                    const content = `
                        <form action = "${linkTo}" method ="post">
                            <input type = "hidden" name = "${idStr}" value = "${id}">
                            <p>
                                <input type="text" name = "${titleStr}" value = "${title}" placeholder = "${titleStr}">
                            </p>
                            <p>
                                <textarea name = "${descriptionStr}" placeholder = "${descriptionStr}">${description}</textarea>
                            </p>
                            ${selector}
                            <p>
                                <input type="submit">
                            </p>
                        </form>
                    `;
                
                    const pageTitle = 'Update';
                    const list = listMaker.thread(threadList);
                    const button = buttonSelector.none();
    
                    // 페이지 결합
                    const template = form(pageTitle, list, button, content);
    
                    response.send(template);
                });
            });
        });
    },
    author(response){

        database.query(`SELECT * FROM author`,
        function(error, authorList){
            if (error){
                throw error;
            }
            const pageTitle = "Author";
            const list = listMaker.author(authorList);
            const button = buttonSelector.none();
            const content = '';
    
            const template = form(pageTitle, list, button, content);
    
            response.send(template);
        });
    },
    createAuthor(response){

        database.query(`SELECT * FROM author`,
        function(error, authorList){
            if (error){
                throw error;
            }
            const pageTitle = "CreateAuthor";
            const list = listMaker.author(authorList);
            const button = buttonSelector.none();

            const linkTo = '/createAuthor_process';
            const nameStr = 'name';
            const profileStr = 'profile';

            const content =`
                <p>
                <form action = "${linkTo}" method ="post">
                    <p>
                        <input type="text" name = "${nameStr}" placeholder = "${nameStr}">
                    </p>
                    <p>
                        <textarea name = "${profileStr}" placeholder = "${profileStr}"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                </p>
            `;
    
            const template = form(pageTitle, list, button, content);
        
            response.send(template);
        });
    },
    updateAuthor(request, response){

        const param = request.params.pageID;

        database.query(`SELECT * FROM author`,
        function(error, authorList){
            if (error){
                throw error;
            }
            
            database.query(`SELECT * FROM author WHERE id = ?`,
            [param],
            function(error2, author){
                if (error2){
                    throw error2;
                }
                const linkTo = '/updateAuthor_process';
                const idStr = 'id';
                const nameStr = 'name';
                const profileStr = 'profile';
        
                const authorID = author[0].id;
                const name = author[0].name;
                const profile = author[0].profile;
                const content = `
                    <form action = "${linkTo}" method ="post">
                        <input type = "hidden" name = "${idStr}" value = "${authorID}">
                        <p>
                            <input type="text" name = "${nameStr}" value = "${name}" placeholder = "${nameStr}">
                        </p>
                        <p>
                            <textarea name = "${profileStr}" placeholder = "${profileStr}">${profile}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                `;
        
                const pageTitle = "UpdateAuthor";
                const list = listMaker.author(authorList);
                const button = buttonSelector.none();
        
                const template = form(pageTitle, list, button, content);
                
                response.send(template);
            });
        });
    }
}
module.exports = template;