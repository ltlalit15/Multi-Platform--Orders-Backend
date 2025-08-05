// server.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Shopify Orders API with cursor-based pagination
app.post('/shopify/orders', async (req, res) => {
  const { storeUrl, accessToken } = req.body;

  if (!storeUrl || !accessToken) {
    return res.status(400).json({
      success: false,
      message: 'Store URL and Access Token are required.',
    });
  }

  let endpoint = `https://${storeUrl}/admin/api/2023-10/orders.json`;
  

  try {
    const response = await axios.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
    });

    // Parse Link header for next/previous page_info
    const linkHeader = response.headers['link'] || '';
    const nextPageInfo = extractPageInfo(linkHeader, 'rel="next"');
    const prevPageInfo = extractPageInfo(linkHeader, 'rel="previous"');

    return res.status(200).json({
      success: true,
      orders: response.data.orders,
      nextPageInfo,
      prevPageInfo,
    });
  } catch (error) {
    console.error('Shopify API error:', error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Shopify orders',
      error: error?.response?.data || error.message,
    });
  }
});

// Helper: extract page_info from Link header
function extractPageInfo(linkHeader, relType) {
  const match = linkHeader.split(',').find(part => part.includes(relType));
  if (!match) return null;
  const urlMatch = match.match(/<([^>]+)>/);
  if (!urlMatch) return null;
  const url = new URL(urlMatch[1]);
  return url.searchParams.get('page_info');
}

app.get('/', (req, res) => {
  res.send('✅ Shopify API with cursor pagination is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
