import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const sendToHighLevel = async (req, res) => {
  try {
    //Fetch Clover customers
    const cloverResp = await axios.get(
      `https://apisandbox.dev.clover.com/v3/merchants/${process.env.MERCHANT_ID}/customers`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOVER_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const customers = cloverResp.data.elements;

    //Map to GHL format
    const hlCustomers = customers.map(c => {
      const customer = {
        firstName: c.firstName || '',
        lastName: c.lastName || '',
        name: `${c.firstName || ''} ${c.lastName || ''}`,
        locationId: process.env.LOCATION_ID
      };
      if (c.email) customer.email = c.email;
      if (c.phone) customer.phone = c.phone;
      return customer;
    });

    console.log('Clover customers:', customers);
    console.log('HL customers to send:', hlCustomers);

    //Send each customer to HighLevel
    const promises = hlCustomers.map(customer =>
      axios.post(
        'https://services.leadconnectorhq.com/contacts/',
        customer,
        {
          headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )
    );

    const results = await Promise.all(promises);

    res.json({
      message: `Successfully sent ${results.length} customers to HighLevel.`,
      results: results.map(r => r.data),
    });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to send customers to HighLevel' });
  }
};