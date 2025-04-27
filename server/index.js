import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";


import bodyParser from "body-parser"; // ✅ Add this

dotenv.config({});
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;
import { stripeWebhook } from "./controllers/coursePurchase.controller.js";

//setup for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// This MUST come before app.use(express.json())
app.post(
  "/api/v1/purchase/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);
/*// ⚠️ Webhook route must go BEFORE express.json()
app.post(
  "/api/v1/purchase/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    // 🔁 Import your webhook controller here
    const { stripeWebhook } = await import("./controllers/coursePurchase.controller.js");
    return stripeWebhook(req, res);
  }
);*/

// Standard middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// Normal API routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute); // keep this AFTER webhook
app.use("/api/v1/progress", courseProgressRoute);
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`);
});