import express from "express";
import shopifyRoutes from "./routes/shopify.routes.js";

const app = express();
app.use(express.json());

app.use("/shopify", shopifyRoutes);

app.listen(6000, () => {
  console.log("Server running on http://localhost:6000");
});
