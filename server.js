const express = require('express');
const app = express();
const port = process.env.port || 8000;
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json());

app.post('/users', (req, res) => {
    fs.readFile('./storage.json', (err, data) => {
        let fileData = JSON.parse(data);
        let userID = ++fileData.id_count;
        if(req.body.name !== undefined && req.body.email !== undefined &&
        req.body.state !== undefined) {
            fileData.users[userID] = req.body;
            fs.writeFile('./storage.json', JSON.stringify(fileData));
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });
})

app.get('/users', (req,res) => {
    fs.readFile('./storage.json', (err, data) => {
        let fileData = JSON.parse(data);
        res.send(fileData.users);
    });
})

app.get('/users/:name', (req,res) => {
    fs.readFile('./storage.json', (err, data) => {
        let fileData = JSON.parse(data);
        let keys = Object.keys(fileData.users);
        let user;
        for(let i = 0; i< keys.length; i++) {
            let u = fileData.users[keys[i]];
            if(u.name === req.params.name) {
                user = u;
                break;
            }
        }
        if(user !== undefined)
            res.send(user);
        else 
            res.sendStatus(404);
    });
})

app.put('/users/:name', (req,res) => {
    let name = req.body.name;
    let email = req.body.email;
    let state = req.body.state;

    fs.readFile('./storage.json', (err, data) => {
        let fileData = JSON.parse(data);
        let keys = Object.keys(fileData.users);
        let user;
        for(let i = 0; i< keys.length; i++) {
            let u = fileData.users[keys[i]];
            if(u.name === req.params.name) {
                user = u;
                break;
            }
        }
        if(user !== undefined) {
            if(name !== undefined) user.name = name;
            if(email !== undefined) user.email = email;
            if(state !== undefined) user.state = state;
            fs.writeFile('./storage.json', JSON.stringify(fileData));
            res.sendStatus(200);
        } else {
            res.send(404);
        }
    }) 
});

app.delete('./users/:name', (req, res) => {
    fs.readFile('./storage.json', (err, data) => {
        let fileData = JSON.parse(data);
        let keys = Object.keys(fileData.users);
        for(let i = 0; i< keys.length; i++) {
            let u = fileData.users[keys[i]];
            if(u.name === req.params.name) {
                fileData.users[keys[i]] = null;
                break;
            }
        }
        fs.writeFile('./storage.json', JSON.stringify(fileData));
    })
});

app.listen(port, () => {
    console.log("Listening at port ", port);
})