const buttonSelector = {
    none(){
        return '';
    },
    oneButton(){
        button = `
            <a href = '/create'>create</a>
        `;

        return button;
    },
    threeButton(queryID){
        button = `
        <a href = '/create'>create</a>
        <a href = '/update?id=${queryID}'>update</a>
        <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${queryID}">
            <input type="submit" value="delete">
        </form>
        `;

        return button;
    }
}
module.exports = buttonSelector;