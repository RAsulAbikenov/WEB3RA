const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/blog', (req, res) => {
    const postsFilePath = path.join(__dirname, 'posts.json');
    const postsData = JSON.parse(fs.readFileSync(postsFilePath));
    postsData.sort((a, b) => b.date - a.date);

    res.render('posts', { posts: postsData });
});

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/add-post', (req, res) => {
    res.render('add_post');
});

app.post('/add-post', (req, res) => {
    const { title, content } = req.body;

    const postsFilePath = path.join(__dirname, 'posts.json');
    const postsData = JSON.parse(fs.readFileSync(postsFilePath));

    const newPost = { title, content, date: new Date() };
    postsData.push(newPost);

    fs.writeFileSync(postsFilePath, JSON.stringify(postsData, null, 2));

    res.redirect('/blog');
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
