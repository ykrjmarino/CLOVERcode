import express from 'express';
import axios from 'axios';
import cors from "cors";
import dotenv from 'dotenv';
import qs from 'qs';

import { getCloverCustomers, getCloverPayments } from './2_getClover.js';
import { sendToHighLevel } from './2_sentToGHL.js';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

//OATH: My first step in exploring GHL
app.get('/oauth/callback', async (req, res) => {
  const code = req.query.code; //from HighLevel
  if (!code) return res.status(400).send('No code provided');

  try {
    const response = await axios.post(
      'https://services.leadconnectorhq.com/oauth/token',
      qs.stringify({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code: code
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = response.data;
    console.log('Access token:', access_token);
    console.log(response.data);

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error exchanging code for token');
  }
});

//CLOVER
app.get('/clover/merchant', async (req, res) => { // http://localhost:3001/clover/merchant
  try {
    const response = await axios.get(
      `https://apisandbox.dev.clover.com/v3/merchants/${process.env.MERCHANT_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOVER_TOKEN}`,
          Accept: 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch merchant' });
  }
});

app.get('/clover/customers', getCloverCustomers); // https://apisandbox.dev.clover.com/v3/merchants/FPSBMV494SH51/customers
app.get('/clover/payments', getCloverPayments);

//CLOVER TO GHL
app.get('/sync/customers', sendToHighLevel); // http://localhost:3001/sync/customers








app.get("/", (req, res) => res.send("Backend is running wewewe"));

app.listen(port, () => {
  // db.connect();
  console.log(`✅ Backend running at http://localhost:${port} (ykrjm2025)`);
});