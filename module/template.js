const sanitizeHtml = require('sanitize-html');

const template = {
  // createUpdateDelete = { "none", "writer", "reader" }
  // formStr = { "read", "create", "update" }
  html(title, description, fileList, createUpdateDelete, formStr = "read"){

    const sanitizedTitle = sanitizeHtml(title,{
      allowedTags: [],
      allowedAttributes: {},
      allowedIframeHostnames: []
    });
    const sanitizedDescription = sanitizeHtml(description);

    let button;
    switch (createUpdateDelete) {
      case "none":
        button = '';
        break;

      case "writer":
        button = `
          <a href = '/create'>create</a>
          <a href = '/update?id=${title}'>update</a>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${title}">
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

    let content;
    switch(formStr){
      case "read":
        content = `
          <h2>${title}</h2>
            <p>${sanitizedDescription}</p>`;
        break;

      case "create":
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
                <input type="submit">
              </p>
            </form>
          </p>
        `;
        break;

      case "update":
        content = `
          <form action = "/update_process" method ="post">
            <input type = "hidden" name = "id" value = "${title}">
            <p>
              <input type="text" name = "title" value = "${title}" placeholder = "title">
            </p>
            <p>
              <textarea name = "description" placeholder = "description">${sanitizedDescription}</textarea>
            </p>
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

    let list = '<ul>'
    for (let i = 0; i < fileList.length; i++){
      const file = fileList[i];
      if (file === 'Welcome'){
        continue;
      }

      list += `<li><a href="/?id=${file}">${file}</a></li>`;
    }
    list += '</ul>';



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
        ${button}
        ${content}
      </body>
      </html>
    `;

    return template;
  }
}

module.exports = template;
