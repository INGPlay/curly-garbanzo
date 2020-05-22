const database = require('./database.js');
const buttonSelector = require('./buttonSelector.js');
const listMaker = require('./listMaker.js');

const template = {
    // formStr = {"home", "read", "create", "update", "author", "createAuthor", "updateAuthor"}
    html(response, formStr, queryID){

        database.query(`SELECT * FROM topic LEFT JOIN author ON topic.authorID = author.id WHERE topic.id = ?`,
        [queryID],
        function(error, thread){
            if (error){
                throw error;
            }

            database.query(`SELECT topic.id, title, authorID, name FROM topic LEFT JOIN author ON topic.authorID = author.id`,
            function(error2, threadList){
                if (error2){
                    throw error2;
                }

                database.query(`SELECT * FROM author`,
                function(error3, authorList){
                    if (error3){
                        throw error3;
                    }
                    
                    database.query(`SELECT * FROM author WHERE id = ?`,
                    [queryID],
                    function(error4, author){
                        if (error4){
                            throw error4;
                        }

                        // 페이지별 양식 (content), button 할당, pageTitle 할당, list 할당
                        let content = '';
                        let button = '';
                        let pageTitle = '';
                        let list = '';
                        switch(formStr){
                            case "home":
                                {
                                    const title = 'Home';
                                    const description = 'Welcome';

                                    content = `
                                        <h2>${title}</h2>
                                        <p>${description}</p>
                                    `;

                                    button = buttonSelector.oneButton();
                                    pageTitle = title;
                                    list = listMaker.thread(threadList);
                                }
                                break;
                            case "read":
                                {
                                    const title = thread[0].title;
                                    const description = thread[0].description;
                                    const byAuthor = `by ${thread[0].name}`;
                    
                                    content = `
                                        <h2>${title}</h2>
                                        <p>${description}</p>
                                        ${byAuthor}
                                    `;

                                    button = buttonSelector.threeButton(queryID);
                                    pageTitle = title;
                                    list = listMaker.thread(threadList);
                                }
                
                                break;
                
                            case "create":
                                {
                                    const linkTo = '/create_process';
                                    const titleStr = 'title';
                                    const descriptionStr = 'description';

                                    const selector = authorSelector(authorList);
                
                                    content = `
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

                                    button = buttonSelector.none();
                                    pageTitle = 'Create';
                                    list = listMaker.thread(threadList);
                                }
                
                                break;
                
                            case "update":
                                {
                                    const linkTo = '/update_process';
                                    const titleStr = 'title';
                                    const descriptionStr = 'description';
                                    const idStr = 'id';

                                    const id = queryID;
                                    const title = thread[0].title;
                                    const description = thread[0].description;
                                    const selector = authorSelector(authorList, thread[0].authorID);
                
                                    content = `
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

                                    button = buttonSelector.none();
                                    pageTitle = 'Update';
                                    list = listMaker.thread(threadList);
                                }
                                break;
                            
                            case "author":
                                {
                                    button = buttonSelector.none();
                                    pageTitle = "Author";
                                    list = listMaker.author(authorList);
                                }
                                break;

                            case "createAuthor":
                                {
                                    const linkTo = '/createAuthor_process';
                                    const nameStr = 'name';
                                    const profileStr = 'profile';
                                    content +=`
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

                                    list = listMaker.author(authorList);
                                }
                                break;
                            
                            case "updateAuthor":
                                {
                                    const linkTo = '/updateAuthor_process';
                                    const idStr = 'id';
                                    const nameStr = 'name';
                                    const profileStr = 'profile';

                                    const authorID = author[0].id;
                                    const name = author[0].name;
                                    const profile = author[0].profile;
                                    content += `
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

                                    button = buttonSelector.none();
                                    pageTitle = "UpdateAuthor";
                                    list = listMaker.author(authorList);
                                }
                                break;
                            
                            default:
                                throw new Error();

                                break;
                        }


                        // 페이지 결합
                        const template = `
                        <!doctype html>
                        <html>
                            <head>
                                <title>WEB1 - ${pageTitle}</title>
                                <meta charset="utf-8">
                            </head>
                            <body>
                                <h1><a href="/">WEB</a></h1>
                                <a href = "/author">author<a>
                                ${list}
                                ${button}
                                ${content}
                            </body>
                        </html>
                        `;

                        response.writeHead(200);
                        response.end(template);
                    })
                })
            })
        })
    }
}
module.exports = template;

//처음에 선택하고 싶은 옵션이 있는 경우 queryID를 넣는다
function authorSelector(authorList, targetAuthorID){
    let selector = '<select name = "author">';
    for (let i = 0; i < authorList.length; i++){
        const authorID = authorList[i].id;
        const selected = 'selected';
        if (targetAuthorID === authorID){
            selector += `<option value = '${authorID}' ${selected}>${authorList[i].name}</option>`;
            
            continue;
        }
        selector += `<option value = '${authorID}'>${authorList[i].name}</option>`;
    }
    selector += '</select>'

    return selector;
}