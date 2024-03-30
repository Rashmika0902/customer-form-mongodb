const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Customer = require('./models/customer'); // Assuming you have a Customer model
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/customersDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Get all customers
app.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.render('index', { customers }); // Assuming you have an 'index.ejs' template
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Add customer form
app.get('/add', (req, res) => {
    res.render('form'); // Assuming you have a 'form.ejs' template for adding customers
});

// Add a new customer
app.post('/add', async (req, res) => {
    const { name, email, phone, address } = req.body;
    const customer = new Customer({ name, email, phone, address });
    try {
        await customer.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
