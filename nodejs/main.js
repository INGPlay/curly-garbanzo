// object
const express = require('express')
const app = express()
const process = require('./module/process.js');
const template = require('./module/templateRefactoring.js');
// variable
const port = 3000


// - thread -
app.get('/', (request, response) => {
    template.home(response);
});

app.get('/page/:pageID', (request, response) => {
    template.read(request, response);
});

// create
app.get('/create', (request, response) => {
    template.create(response);
});

app.post('/create_process', (request, response) => {
    process.create(request, response);
})

// update
app.get('/update/:pageID', (request, response) => {
    template.update(request, response);
});

app.post('/update_process', (request, response) => {
    process.update(request, response);
})

// delete
app.post('/delete_process', (request, response) => {
    process.delete(request, response);
})


// - author -
app.get('/author', (request, response) => {
    template.author(response);
})

// create
app.get('/createAuthor', (request, response) => {
    template.createAuthor(response);
})

app.post('/createAuthor_process', (request, response) => {
    process.createAuthor(request, response);
})

// update
app.get('/updateAuthor/:pageID', (request, response) => {
    template.updateAuthor(request, response);
})

app.post('/updateAuthor_process', (request, response) => {
    process.updateAuthor(request, response);
})

// delete
app.post('/deleteAuthor_process', (request, response) => {
    process.deleteAuthor(request, response);
})


// listen
app.listen(port, function(){
    console.log(`Example app listening at http://localhost:${port}`)
});