const listMaker = {
    thread(threadList){
        let list = '<ul>';
        for (let i = 0; i < threadList.length; i++){
            const topic = threadList[i];
            const title = topic.title;
            const id = topic.id;
    
            list += `<li><a href="/page/${id}">${title}</a></li>`;
        }
        list += '</ul>';
    
        return list;
    },
    author(authorList){
        let list = `
        <a href = '/createAuthor'>create</a>
        <table border = "1">
            <tr>
                <td>name</td>
                <td>profile</td>
                <td>update</td>
                <td>delete</td>
            </tr>
        `;
        for (let i = 0; i < authorList.length; i++){
            const author = authorList[i];
    
            const name = author.name;
            const profile = author.profile;
            const authorID = author.id;
            list += `
                <tr>
                    <td>${name}</td>
                    <td>${profile}</td>
                    <td><a href = "/updateAuthor/${authorID}">update<a><td>
                    <form action="/deleteAuthor_process" method="post">
                        <input type="hidden" name="authorID" value="${authorID}">
                        <input type="submit" value="delete">
                    </form>
            `;
        }
        list += `
            </table>
        `;
    
        return list;
    }
}
module.exports = listMaker;