// controllers/shopify.controller.js
import axios from "axios";

const API_KEY = "YOUR_API_KEY";
const API_SECRET = "YOUR_API_SECRET";
const REDIRECT_URI = "https://yourdomain.com/shopify/callback";

// 🔁 Step 1: Redirect user to install
export const startOAuth = (req, res) => {
  const { shop } = req.query;
  if (!shop) return res.status(400).send("Missing shop param");

  const redirectUrl = `https://${shop}/admin/oauth/authorize?client_id=${API_KEY}&scope=read_orders&redirect_uri=${REDIRECT_URI}`;
  res.redirect(redirectUrl);
};

// 🔑 Step 2: Callback handler to get token
export const handleOAuthCallback = async (req, res) => {
  const { code, shop } = req.query;
  if (!code || !shop) return res.status(400).send("Missing params");

  try {
    const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: API_KEY,
      client_secret: API_SECRET,
      code,
    });

    const { access_token } = response.data;

    // ✅ Store this access_token and shop in DB if needed
    console.log("Access Token for", shop, "==>", access_token);

    res.send("App installed! You can now fetch orders.");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("OAuth failed");
  }
};

// 📦 Step 3: Fetch paginated orders
export const fetchOrders = async (req, res) => {
  const { shop, token, page = 1 } = req.query;
  const limit = 10;
  const sinceId = req.query.since_id || 0;

  if (!shop || !token) return res.status(400).send("Shop and token are required");

  try {
    const response = await axios.get(`https://${shop}/admin/api/2023-10/orders.json`, {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      params: {
        limit,
        page_info: req.query.page_info, // Optional if you use Link header for next page
        status: "any",
        order: "id desc"
      },
    });

    res.json({
      orders: response.data.orders,
      pagination: {
        next: response.headers.link,
        currentPage: page,
      },
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Error fetching orders");
  }
};
