const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "wedding_planner"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Gagal konek database:", err);
  } else {
    console.log("✅ Terhubung ke database MySQL");
  }
});

module.exports = db;
