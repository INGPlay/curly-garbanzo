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

module.exports = authorSelector;