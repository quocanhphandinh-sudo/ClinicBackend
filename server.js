const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
// Kết nối đến file database
// Bạn sẽ phải đặt file clinic.db ở cùng thư mục với server.js
const db = new Database(path.join(__dirname, 'clinic_backup_20250829_083142.db'));

// API để lấy danh sách bệnh nhân
app.get('/api/patients', (req, res) => {
    try {
        const patients = db.prepare('SELECT * FROM Patients').all();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API thêm bệnh nhân mới
app.post("/api/patients", (req, res) => {
  const { FullName, DateOfBirth, Gender, Allergies, Address, Phone } = req.body;

  if (!FullName || !DateOfBirth || !Gender || !Allergies || !Address || !Phone) {
    return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
  }

  const sql = `
    INSERT INTO Patients (FullName, DateOfBirth, Gender, Allergies, Address, Phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [FullName, DateOfBirth, Gender, Allergies, Address, Phone], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      PatientId: this.lastID,
      FullName,
      DateOfBirth,
      Gender,
      Allergies,
      Address,
      Phone
    });
  });
});

// API xóa bệnh nhân
app.delete("/api/patients/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Patients WHERE PatientId = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Không tìm thấy bệnh nhân" });
    }
    res.json({ message: "Xóa thành công", deletedId: id });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));