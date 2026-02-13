import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config(); 

//GET ALL CONTACTS
export const getCloverCustomers = async(req, res) => {
  try {
    const response = await axios.get(
      `https://apisandbox.dev.clover.com/v3/merchants/${process.env.MERCHANT_ID}/customers`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOVER_TOKEN}`,
          Accept: 'application/json',
        },
      }
    );

    // Optional: just map the important fields
    const customers = response.data.elements.map(c => {
      const customer = {
        id: c.id,
        firstName: c.firstName || '',
        lastName: c.lastName || '',
      };
      if (c.email) customer.email = c.email;
      if (c.phone) customer.phone = c.phone;
      return customer;
    });

    res.json(customers);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}


//GET ALL PAYMENTS
export const getCloverPayments = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.CLOVER_BASE}/v3/merchants/${process.env.MERCHANT_ID}/payments`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOVER_TOKEN}`,
          Accept: 'application/json',
        },
      }
    );

    const payments = response.data.elements.map(p => ({
      id: p.id,
      amount: p.amount,
      createdTime: p.createdTime,
      employeeId: p.employee?.id,
      orderId: p.order?.id,
    }));

    res.json(payments);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};