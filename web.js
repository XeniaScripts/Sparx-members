require("dotenv").config();
const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Home Page ---
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Sparx Members</title>
    <style>
      body {
        background: linear-gradient(135deg, #1e3c72, #2a5298, #ff0066);
        font-family: Arial, sans-serif;
        color: white;
        text-align: center;
        padding: 100px 20px;
      }
      h1 { font-size: 70px; font-weight: 900; text-transform: uppercase; letter-spacing: 5px; text-shadow: 4px 4px rgba(0,0,0,0.4); }
      h2 { font-size: 28px; opacity: 0.9; margin-bottom: 50px; }
      .btn { display:inline-block; background:#fff; color:#1e3c72; padding:20px 50px; font-size:24px; font-weight:bold; border-radius:15px; text-decoration:none; transition: all 0.3s ease; box-shadow:0 5px 15px rgba(0,0,0,0.3);}
      .btn:hover { transform:translateY(-5px); box-shadow:0 10px 20px rgba(0,0,0,0.4);}
      .section { background: rgba(0,0,0,0.4); padding: 25px; width:70%; margin:50px auto; border-radius:15px; font-size:20px; line-height:1.6; }
    </style>
  </head>
  <body>
    <h1>Sparx Members</h1>
    <h2>Authorize once. Added automatically when /join is used.</h2>
    <a href="/login" class="btn">🔑 Login With Discord</a>

    <div class="section">
      <p>• Permanently authorized until you revoke access.</p>
      <p>• Bot must be in the server you want to add members to.</p>
      <p>• Only adds users who agreed to join.</p>
      <p>• Safe • OAuth-based • Legal</p>
    </div>
  </body>
  </html>
  `);
});

// --- Login Route ---
app.get("/login", (req, res) => {
  const url = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&scope=identify guilds.join&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`;
  res.redirect(url);
});

// --- OAuth Callback ---
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("❌ No code provided");

  const tokenData = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.REDIRECT_URI
  });

  const tokenRes = await axios.post("https://discord.com/api/oauth2/token", tokenData);
  const access_token = tokenRes.data.access_token;

  const userRes = await axios.get("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  const user = { id: userRes.data.id, token: access_token };
  let db = JSON.parse(fs.readFileSync("authorized.json", "utf-8"));
  if (!db.find(u => u.id === user.id)) db.push(user);
  fs.writeFileSync("authorized.json", JSON.stringify(db, null, 2));

  res.send("✔️ You are now permanently authorized for Sparx Members!");
});

// --- Start Server ---
app.listen(PORT, () => console.log(`🌐 Sparx Members Website running on port ${PORT}`));
