
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const articleRouter = require('./routes/articles');
const Article = require('./models/article');
const app = express();

const port = process.env.PORT || 3000;
const username = process.env.MONGODB_USERNAME;
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const dbName = process.env.MONGODB_DBNAME;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.pvlbsey.mongodb.net/${dbName}`, {});
const db = mongoose.connection;
db.on('error', () => console.log("Error connecting to the database"));
db.once('open', () => console.log("Connected to the database"));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('articles/index', { articles: articles });
    } catch (err) {
        console.error('Error fetching articles:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.use('/articles', articleRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
