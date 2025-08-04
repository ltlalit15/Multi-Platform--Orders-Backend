// routes/shopify.routes.js
import express from "express";
import {
  startOAuth,
  handleOAuthCallback,
  fetchOrders
} from "../controllers/shopify.controller.js";

const router = express.Router();

router.get("/auth", startOAuth);               // Step 1: Redirect to Shopify
router.get("/callback", handleOAuthCallback);  // Step 2: Handle code + get token
router.get("/orders", fetchOrders);            // Step 3: Fetch orders (paginated)

export default router;
