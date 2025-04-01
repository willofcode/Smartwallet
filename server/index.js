require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');
const routes = require('./routes/routes');
const FinancialAdvisorChatbot = require('./chatbot/aichatwrapper');

const app = express();

const chatbot = new FinancialAdvisorChatbot();
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

// chatbot endpoint test
app.post('/chat', async (req, res) => {
    const { message, userId } = req.body;
    try {
        const response = await chatbot.chat(message, userId);
        res.json({ response });
    } catch (error) {
        console.error('Error in /chat route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

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