app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Sparx Members</title>
    <style>
      body {
        background: linear-gradient(135deg, #1e3c72, #2a5298, #ff0066);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: white;
        text-align: center;
        padding: 100px 20px;
      }
      h1 {
        font-size: 70px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 5px;
        text-shadow: 4px 4px rgba(0,0,0,0.4);
      }
      h2 {
        font-size: 28px;
        opacity: 0.9;
        margin-bottom: 50px;
      }
      .btn {
        display: inline-block;
        background: #ffffff;
        color: #1e3c72;
        padding: 20px 50px;
        font-size: 24px;
        font-weight: bold;
        border-radius: 15px;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      }
      .btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.4);
      }
      .section {
        background: rgba(0,0,0,0.4);
        padding: 25px;
        width: 70%;
        margin: 50px auto;
        border-radius: 15px;
        font-size: 20px;
        line-height: 1.6;
      }
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
