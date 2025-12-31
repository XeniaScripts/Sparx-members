require("dotenv").config();
const express = require("express");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// --- SQLite setup ---
const DB_FILE = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(DB_FILE);
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS authorized_users (
      id TEXT PRIMARY KEY,
      access_token TEXT,
      refresh_token TEXT,
      token_expiry INTEGER
    )
  `);
});

// --- Home Page ---
app.get("/", (req, res) => {
  res.send(`
  <html>
    <head>
      <title>Sparx Members</title>
      <style>
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg,#6b73ff,#000dff); color: white; text-align:center; padding:50px;}
        h1 { font-size: 60px; margin-bottom: 20px; }
        a { display:inline-block; padding:15px 30px; background:#ff5f6d; color:white; border-radius:10px; text-decoration:none; font-size:20px; }
        a:hover { background:#ffc371; color:black; }
      </style>
    </head>
    <body>
      <h1>Sparx Members</h1>
      <p>Authorize to join servers automatically!</p>
      <a href="/login">Login With Discord</a>
    </body>
  </html>
  `);
});

// --- Login Route ---
app.get("/login", (req, res) => {
  const url = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&scope=identify%20guilds.join&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`;
  res.redirect(url);
});

// --- OAuth Callback ---
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("❌ No code provided");

  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.REDIRECT_URI
  });

  try {
    const tokenRes = await axios.post("https://discord.com/api/oauth2/token", params);
    const { access_token, refresh_token, expires_in } = tokenRes.data;
    const expiry = Math.floor(Date.now() / 1000) + expires_in;

    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const userId = userRes.data.id;

    // Save user in SQLite
    db.run(
      `INSERT INTO authorized_users (id, access_token, refresh_token, token_expiry)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         access_token=excluded.access_token,
         refresh_token=excluded.refresh_token,
         token_expiry=excluded.token_expiry`,
      [userId, access_token, refresh_token, expiry],
      function(err) {
        if (err) console.error("DB Error:", err);
      }
    );

    res.send(`<h1>✔️ Authorized!</h1><a href="/">Back to homepage</a>`);
  } catch (err) {
    console.log(err);
    res.send("❌ Something went wrong during authorization.");
  }
});

app.listen(PORT, () => console.log(`🌐 Website running on port ${PORT}`));
