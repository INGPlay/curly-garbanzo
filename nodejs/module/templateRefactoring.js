const database = require('./database.js');

const template = {
    // formStr = {"home", "read", "create", "update"}
    html(response, formStr, queryID){

        database.query(`SELECT * FROM topic LEFT JOIN author ON topic.authorID = author.id WHERE topic.id = ?`,
        [queryID],
        function(error, target){
            if (error){
                throw error;
            }

            database.query(`SELECT topic.id, title, authorID, name FROM topic LEFT JOIN author ON topic.authorID = author.id`,
            function(error2, all){
                if (error2){
                    throw error2;
                }

                database.query(`SELECT name, id FROM author`,
                function(error3, authorList){
                    if (error3){
                        throw error3;
                    }

                    // 리스트 생성
                    const list = listMaker(all);

                    // 페이지별 양식, 버튼 할당
                    let content = '';
                    let button = '';
                    let pageTitle = '';
                    switch(formStr){
                        case "home":
                            {
                                const title = 'Home';
                                const description = 'Welcome';

                                content = `
                                    <h2>${title}</h2>
                                    <p>${description}</p>
                                `;

                                button = buttonSelector("reader");
                                pageTitle = title;
                            }
                            break;
                        case "read":
                            {
                                const title = target[0].title;
                                const description = target[0].description;
                                const byAuthor = `by ${target[0].name}`;
                
                                content = `
                                    <h2>${title}</h2>
                                    <p>${description}</p>
                                    ${byAuthor}
                                `;

                                button = buttonSelector("writer", queryID);
                                pageTitle = title;
                            }
            
                            break;
            
                        case "create":
                            {
                                const selector = authorSelector(authorList);
            
                                content = `
                                <p>
                                <form action = "/create_process" method ="post">
                                    <p>
                                        <input type="text" name = "title" placeholder = "title">
                                    </p>
                                    <p>
                                        <textarea name = "description" placeholder = "description"></textarea>
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

                            button = buttonSelector("none");
                            pageTitle = 'Create';
                            }
            
                            break;
            
                        case "update":
                            {
                                const title = target[0].title;
                                const description = target[0].description;
                                const selector = authorSelector(authorList, target[0].authorID);
                                const id = queryID;
            
                                content = `
                                    <form action = "/update_process" method ="post">
                                    <input type = "hidden" name = "id" value = "${id}">
                                    <p>
                                        <input type="text" name = "title" value = "${title}" placeholder = "title">
                                    </p>
                                    <p>
                                        <textarea name = "description" placeholder = "description">${description}</textarea>
                                    </p>
                                    ${selector}
                                    <p>
                                        <input type="submit">
                                    </p>
                                    </form>
                                `;

                                button = buttonSelector("none");
                                pageTitle = 'Update';
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
    }
}
module.exports = template;

function listMaker(all){
    let list = '<ul>'
    for (let i = 0; i < all.length; i++){
        const topic = all[i];
        const title = topic.title;
        const id = topic.id;

        list += `<li><a href="/?id=${id}">${title}</a></li>`;
    }
    list += '</ul>';

    return list;
}

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

// buttonStr = {"none", "writer", "reader"}
// buttonStr이 "writer"라면 queryID가 필요
function buttonSelector(buttonStr, queryID){
    let button;
    switch (buttonStr) {
        case "none":
            button = '';
            break;

        case "writer":
            button = `
            <a href = '/create'>create</a>
            <a href = '/update?id=${queryID}'>update</a>
            <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryID}">
                <input type="submit" value="delete">
            </form>
            `;
            break;

        case "reader":
            button = `
                <a href = '/create'>create</a>
            `;
            break;

        default:
            console.assert(false);
            break;
    }

    return button;
}