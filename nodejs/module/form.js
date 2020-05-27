const form = (pageTitle, list, button, content) => {
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

    return template;
}

module.exports = form;