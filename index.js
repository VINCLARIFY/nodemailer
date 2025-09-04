import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("VIN Report Backend is running!");
});

// Route to fetch VIN report
app.post("/api/vin-report", async (req, res) => {
  const { vin } = req.body;

  if (!vin) return res.status(400).json({ error: "VIN is required" });

  try {
    const response = await fetch(`https://api.carxe.com/vin/${vin}`, {
      headers: {
        "Authorization": `Bearer ${process.env.CARXE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Error fetching VIN data" });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
