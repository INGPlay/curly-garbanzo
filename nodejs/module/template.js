const sanitizeHtml = require('sanitize-html');

const template = {
  // createUpdateDelete = { "none", "writer", "reader" }
  // formStr = { "read", "create", "update" }
  html(title, description, topics, createUpdateDelete, id, formStr, nameOrList, authorID = undefined){

    // 텍스트 정화
    const sanitizedTitle = sanitizeHtml(title,{
      allowedTags: [],
      allowedAttributes: {},
      allowedIframeHostnames: []
    });
    const sanitizedDescription = sanitizeHtml(description);

    // 버튼 선택
    let button;
    switch (createUpdateDelete) {
      case "none":
        button = '';
        break;

      case "writer":
        button = `
          <a href = '/create'>create</a>
          <a href = '/update?id=${id}'>update</a>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${id}">
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

    // 페이지 양식
    let content;
    switch(formStr){
      case "read":
        let readForm = `by ${nameOrList}`;
        if (nameOrList === undefined || nameOrList === ''){
          readForm = ''; 
        }

        content = `
          <h2>${sanitizedTitle}</h2>
            <p>${sanitizedDescription}</p>
            ${readForm}`;
        break;

      case "create":
        nameForm = '<select name = "author">';
        for (let i = 0; i < nameOrList.length; i++){
          nameForm += `<option value = '${i + 1}'>${nameOrList[i].name}</option>`;
        }
        nameForm += '</select>'

        content = `
          <h2>${sanitizedTitle}</h2>
          <p>
            <form action = "/create_process" method ="post">
              <p>
                <input type="text" name = "title" placeholder = "title">
              </p>
              <p>
                <textarea name = "description" placeholder = "description"></textarea>
              </p>
              <p>
                ${nameForm}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
          </p>
        `;
        break;

      case "update":
        let formName = '<select name = "author">';
        for (let i = 0; i < nameOrList.length; i++){
          if (authorID === i + 1){
            formName += `<option value = '${i + 1}' selected>${nameOrList[i].name}</option>`;

            continue;
          }
          formName += `<option value = '${i + 1}'>${nameOrList[i].name}</option>`;
        }
        formName += '</select>'

        content = `
          <form action = "/update_process" method ="post">
            <input type = "hidden" name = "id" value = "${id}">
            <p>
              <input type="text" name = "title" value = "${sanitizedTitle}" placeholder = "title">
            </p>
            <p>
              <textarea name = "description" placeholder = "description">${sanitizedDescription}</textarea>
            </p>
            ${formName}
            <p>
              <input type="submit">
            </p>
          </form>
        `;
        break;

        default:
          console.assert(false);
          break;
    }

    // 리스트 생성
    let list = '<ul>'
    for (let i = 0; i < topics.length; i++){
      const topic = topics[i];
      const file = topic.title;
      const id = topic.id;
      if (file === 'Welcome'){
        continue;
      }

      list += `<li><a href="/?id=${id}">${file}</a></li>`;
    }
    list += '</ul>';

    // 페이지 결합
    let template = `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${sanitizedTitle}</title>
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

    return template;
  }
}

module.exports = template;
