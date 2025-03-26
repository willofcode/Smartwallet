const express = require('express');
const router = express.Router();
const User = require("../models/User"); 
const { plaidClient, Products } = require('../config/plaidConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleware = require("../middleware/authMiddleware");
const SECRET_KEY = process.env.JWT_SECRET_KEY

// stole this from plaid quickstart
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || Products.Transactions).split(
  ',',
);

const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
  ',',
);

// 400 needs to be fixed, authorization token is missing
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: "You have accessed a protected route!", userId: req.user.id });
});

//200
router.post("/signup", async (req, res) => {
  let { name,
        email, 
        password 
      } = req.body;
  
  // check if the name, email and password are not all inputted
  if (!name || !email || !password) {
    return res.status(400).send({ message: "please input all required field" });
  }

  try {

    // if the user exist --> send message "user already exist"
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User exists" });
    };

    //hashing --> bcrypt 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = new User({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    console.log("User created with ID:", user.userId);
    res.status(200).send({ message: `User created with ID: ${user.userId}`, userId: user.userId, token });
  } catch (error) {
    res.status(500).send({ message: `Error creating user: ${error.message}` });
  }
});

//200  
router.post("/login", async (req, res) => {
  let { 
        email, 
        password 
      } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

    console.log("Login successful for user ID:", user.userId);
    res.status(200).send({ message: "Login successful", userId: user.userId, token });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ message: `Error during login: ${error.message}` });
  }
});

/// get a user by it's Id I've done this before!!!!!
router.get('/getUser/:id',  async (req, res) => {
  //const user = await User.findById(req.params.id);

  try{
    const user = await User.findOne({ userId: req.params.id });

    if(!user) {

      return res.status(404).send({ message: "user not found" });
    }

    res.json({ name: user.name });

  } catch(error){
      res.status(500).json({
          message: error.message
      });
  }
});

router.post('/logout',  (req, res) => {
  res.send({ messeage: "Logout successful" });
});

// (ISSUE #2: we need a user logout endpoint) the frontend!!!!!! should handle the logout
  /*try { await req.logout();
              req.session.destroy();
              
    res.redirect('/login');
    res.send({ id: user.userId });

  } catch(error) {
    res.status(500).send ({ message: `Error logging user out: ${error.message}` });
  }*/

//400 error Authorization token is missing
router.post("/create_link_token", authMiddleware, async (req, res) => {
  const { uid } = req.body;

  if (!uid && !req.user?.userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const userId = req.user?.userId || uid;

    console.log("Received UID:", userId);

    const response = await plaidClient.linkTokenCreate({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      user: {
        client_user_id: userId,
      },
      client_name: "SmartWallet",
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: "en",
    });

    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Create Token Error:', error.response?.data || error);
    res.status(500).json({ error: "Can't Create Public Token" });
  }
});


// 200 (For testing REQUIRES public token, no real reason to save this in a db, public tokens expire in about 30 mins.)
// works client-side
router.post('/get_access_token', async (req, res) => {
  const { public_token } = req.body;
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });
    const { access_token, item_id } = response.data;

    console.log("Access token received:", access_token);
    console.log("Item ID received:", item_id);

    res.send({ access_token, item_id });
  } catch (error) {
    console.error('Error exchanging token:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Can't Get Access Token" });
  }
});

// 200 (For testing needs access token, check access token endpoint)
// works, client-side
router.post('/get_transactions', async (req, res) => {
  const { access_token } = req.body;

  try {
    let cursor = null;
    let hasMore = true;
    let allTransactions = [];

    while (hasMore) {
      const transactionResponse = await plaidClient.transactionsSync({
        access_token,
        cursor,
      });

      const { added, modified, removed, next_cursor } = transactionResponse.data;
      allTransactions = allTransactions.concat(added);
      cursor = next_cursor;
      hasMore = transactionResponse.data.has_more;
    }

    const accountsResponse = await plaidClient.accountsGet({ access_token });
    const accounts = accountsResponse.data.accounts;

    console.log("Transactions fetched:", allTransactions);
    console.log("Accounts fetched:", accounts);

    res.json({ transactions: allTransactions, accounts });
  } catch (error) {
    console.error('Error fetching transactions:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Can't Get Transaction history" });
  }
});

/* 
for yared to review - Will
4 endpoint implementations for the following:
1. get_transactions_recurring
2. get_account
3. get_balance
4. get_categories

// Will: I need to test (For testing needs access token, check access token endpoint)
// implementation for billing page for recurring transactions whether its expenses or income
router.post('/get_transactions_recurring', async (req, res) => {
  const { access_token, frequency_filter } = req.body;

  try {
    // Fetch recurring transaction streams from Plaid
    const recurringResponse = await plaidClient.transactionsRecurringGet({
      access_token
    });

    const { inflows, outflows } = recurringResponse.data;

    // Filter only outflow streams (expenses)
    let filteredOutflowStreams = outflows;

    // Optionally filter by frequency if provided
    if (frequency_filter) {
      filteredOutflowStreams = outflows.filter(stream =>
        stream.frequency === frequency_filter
      );
    }

    console.log("Recurring outflow streams:", filteredOutflowStreams);

    res.json({ outflows: filteredOutflowStreams });
  } catch (error) {
    console.error('Error fetching recurring transactions:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Can't Get Recurring Transaction Streams" });
  }
});

// Will: I need to test (For testing needs access token, check access token endpoint)
// implementation to get accounts to be display via client side on wallets
router.get('/get_account', async (req, res) => {
  const access_token = req.headers.authorization?.split("Bearer ")[1]; // implementation in authorization header for a secure protocol

  if (!access_token) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    // Fetch accounts from Plaid API
    const accountsResponse = await plaidClient.accountsGet({ access_token });
    const accounts = accountsResponse.data.accounts;

    console.log("Accounts fetched:", accounts);
    res.json({ accounts });
  } catch (error) {
    console.error('Error fetching account information:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Can't Get Account Information" });
  }
});

// Endpoint to fetch account balance from Plaid API
// Will: I need to test (For testing needs access token, check access token endpoint)
router.get('/get_balance', async (req, res) => {
  const access_token = req.headers.authorization?.split("Bearer ")[1]; // implementation in authorization header for a secure protocol

  if (!access_token) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    // Fetch balance from Plaid API
    const balanceResponse = await plaidClient.accountsBalanceGet({ access_token });
    const accounts = balanceResponse.data.accounts;

    console.log("Balance fetched:", accounts);
    res.json({ accounts });
  } catch (error) {
    console.error('Error fetching account balance:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Can't Get Account Balance" });
  }
}
);

// Endpoint to fetch categories from Plaid API
// Will: I need to test (For testing needs access token, check access token endpoint)
router.get('/get_categories', async (req, res) => {
  try {
    const response = await plaidClient.categoriesGet();
    const categories = response.data.categories;

    console.log("Categories fetched:", categories);
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Can't Get Categories" });
  }
}
);  
*/

module.exports = router;