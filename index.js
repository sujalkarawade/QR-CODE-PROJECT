import express from "express";
import qr from "qr-image";
import fs from "fs";
import path from "path";
import open from "open";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Generate QR
app.post("/generate", (req, res) => {
  const url = req.body.url;

  const qr_svg = qr.image(url);
  const qrPath = "public/qr_img.png";
  qr_svg.pipe(fs.createWriteStream(qrPath));

  fs.writeFile("URL.txt", url, (err) => {
    if (err) throw err;
  });

  res.send(`
    <h2>QR Code Generated</h2>
    <img src="/qr_img.png" />
    <br><br>
    <a href="/">Generate Another</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});
