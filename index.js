const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

// Connect to MongoD
/* mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    //'mongodb://localhost:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err)); */


  let connectWithRetry = function() {
    return mongoose.connect('mongodb://mongo:27017/docker-node-mongo', { useNewUrlParser: true },
     function(err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 1 sec', err);
            setTimeout(connectWithRetry, 1000);
        }
    });
};
connectWithRetry();



const Item = require('./models/Item');

app.get('/', (req, res) => {
  Item.find()
    .then(items => res.render('index', { items }))
    .catch(err => res.status(404).json({ msg: 'No items found' }));
});

app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });

  newItem.save().then(item => res.redirect('/'));
});

const port = 3000;

app.listen(port, () => console.log('Server running...'));
