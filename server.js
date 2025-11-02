// Import modul
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();
const PORT = 3000;

// Set EJS sebagai view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/admin_dashboard", (req, res) => {
  res.render("admin_dashboard");
});

app.get("/add_booking", (req, res) => {
  res.render("add_booking");
});
app.post("/signup", async (req, res) => {
  const { fullname, email, password, confirmPassword, phone_number, birth_date } = req.body;

  if (password !== confirmPassword) {
    return res.render("signup", { message: "⚠️ Password dan konfirmasi password tidak sama." });
  }

  try {
    // Cek apakah email sudah terdaftar
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.render("signup", { message: "❌ Terjadi kesalahan server." });
      }
      if (results.length > 0) {
        return res.render("signup", { message: "⚠️ Email sudah terdaftar." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan user baru
      const insertQuery = `
        INSERT INTO users (full_name, email, password, phone_number, birth_date, created_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(insertQuery, [fullname, email, hashedPassword, phone_number, birth_date, fullname], (err2) => {
        if (err2) {
          console.error("Error insert:", err2);
          return res.render("signup", { message: "❌ Gagal menyimpan data user." });
        }

        // ✅ Redirect ke login dengan pesan sukses
        res.redirect("/login?success=1");
      });
    });
  } catch (error) {
    console.error(error);
    res.render("signup", { message: "❌ Terjadi kesalahan internal." });
  }
});



// Halaman login
app.get("/login", (req, res) => {
  const success = req.query.success;
  let message = null;

  if (success === "1") {
    message = "✅ Pendaftaran berhasil! Silakan login.";
  }

  res.render("login", { error: null, message });
});

// Proses login (POST)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.render("login", { error: "Email dan password wajib diisi." });
  }

  // Cari user berdasarkan email
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("❌ Error query:", err);
      return res.render("login", { error: "Terjadi kesalahan server." });
    }

    // Jika email tidak ditemukan
    if (results.length === 0) {
      return res.render("login", { error: "Email tidak ditemukan." });
    }

    const user = results[0];

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", { error: "Password salah." });
    }

    // Jika login sukses
    console.log(`✅ User ${user.full_name} berhasil login!`);
    res.send(`Selamat datang, ${user.full_name}!`);
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
