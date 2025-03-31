require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');
const routes = require('./routes/routes');
const aichatWrapper = require('./chatbot/aichatwrapper');


const app = express();
const chatbot = new aichatWrapper(); // Initialize the chatbot
/*
const corsOptions = {
    origin: "https://sd2smartwallet.netlify.app",
    methods: "GET,POST,PATCH,DELETE",
    credentials: true
  };
*/

app.use(express.json());
app.use(cors());
//app.use(cors(corsOptions));
app.use(bodyparser.json());

// Endpoint for chatbot interaction
app.post('/api/chat', async (req, res) => { 
    // Extract the message from the request body
    const { message } = req.body;
    try {
        const response = await chatbot.chat(message);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const APP_PORT = process.env.APP_PORT || 8000;

app.listen(APP_PORT, () => {
    console.log(`Server started @ http://localhost:${APP_PORT}`);
});

const database = mongoose.connection;
mongoose.connect(process.env.DB_URL);

database.on('error', (error) => {
    console.log(`Issue: ${error}`)
});

database.once('connected', () => {
    console.log('Database on!')
});

app.use('/api', routes);