// Import modul
const express = require("express");
const path = require("path");
const app = express();

// Set EJS sebagai view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware untuk parsing data form dan file statis
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.get("/", (req, res) => {
  res.render("index"); // Halaman utama
});

app.get("/login", (req, res) => {
  res.render("login"); // Halaman login seperti yang kamu mau
});

app.get("/admin_dashboard", (req, res) => {
  res.render("admin_dashboard");
});

app.get("/client_dashboard", (req, res) => {
  res.render("client_dashboard");
});

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
