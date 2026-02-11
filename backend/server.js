import express from 'express';
import axios from 'axios';
import cors from "cors";
import dotenv from 'dotenv';
import qs from 'qs';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));

const CLOVER_TOKEN = process.env.CLOVER_TOKEN;
const MERCHANT_ID = process.env.MERCHANT_ID;

// app.get('/oauth/callback', async (req, res) => {
//   const code = req.query.code; //from HighLevel
//   if (!code) return res.status(400).send('No code provided');

//   try {
//     const response = await axios.post(
//       'https://services.leadconnectorhq.com/oauth/token',
//       qs.stringify({
//         grant_type: 'authorization_code',
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//         redirect_uri: process.env.REDIRECT_URI,
//         code: code
//       }),
//       { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//     );

//     const { access_token } = response.data;
//     console.log('Access token:', access_token);
//     console.log(response.data);

//     res.json(response.data);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).send('Error exchanging code for token');
//   }
// });


app.get("/", (req, res) => res.send("Backend is running wewewe"));

app.listen(port, () => {
  // db.connect();
  console.log(`✅ Backend running at http://localhost:${port} (ykrjm2025)`);
});