// server.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/shopify/orders', async (req, res) => {
 
});

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
