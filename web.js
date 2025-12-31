app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>SPARX Free Members</title>
    <style>
      body {
        background: linear-gradient(135deg, #ff0066, #5500ff);
        font-family: Arial, sans-serif;
        color: white;
        text-align: center;
        padding: 80px;
      }
      h1 {
        font-size: 64px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 4px;
        text-shadow: 3px 3px #00000050;
      }
      h2 {
        font-size: 28px;
        opacity: 0.9;
        margin-bottom: 40px;
      }
      .btn {
        background: #ffffff;
        color: #000;
        padding: 18px 40px;
        font-size: 22px;
        font-weight: bold;
        border-radius: 12px;
        text-decoration: none;
      }
      .section {
        background: #00000050;
        padding: 20px;
        width: 60%;
        margin: 40px auto;
        border-radius: 12px;
        font-size: 20px;
      }
    </style>
  </head>
  <body>
    <h1>SPARX FREE MEMBERS</h1>
    <h2>Authorize once. Added automatically when /join is used.</h2>
    <a href="/login" class="btn">🔑 Login With Discord</a>

    <div class="section">
      <p>• Permanent authorization until revoked.</p>
      <p>• Bot must be in the server to add members.</p>
      <p>• Only adds users who agreed to join.</p>
      <p>• Safe • OAuth Based • Legal</p>
    </div>
  </body>
  </html>
  `);
});
