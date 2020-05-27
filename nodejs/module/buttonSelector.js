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
    threeButton(param){
        button = `
            <a href = '/create'>create</a>
            <a href = '/update/${param}'>update</a>
            <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${param}">
                <input type="submit" value="delete">
            </form>
        `;

        return button;
    }
}
module.exports = buttonSelector;