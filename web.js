require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`<h1>SPARX</h1><a href="/login">Login with Discord</a>`);
});

app.get("/login", (req, res) => {
  const url =
   `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&scope=identify guilds.join&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`;
  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("❌ No code in request");

  const tokenData = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.REDIRECT_URI
  });

  const tokenRes = await axios.post("https://discord.com/api/oauth2/token", tokenData);
  const access_token = tokenRes.data.access_token;

  res.send("✔️ Authorized! You can now be added to servers you approve.");
});

app.listen(PORT, () => {
  console.log(`🌐 Website running on port ${PORT}`);
});

// Start bot (same process)
require("./index.js");

