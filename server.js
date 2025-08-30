const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json()); // Để xử lý dữ liệu JSON
app.use(cors()); // Cho phép kết nối từ frontend

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

// API để thêm bệnh nhân mới
app.post('/api/patients', (req, res) => {
    try {
        const { FullName, Phone } = req.body;
        const stmt = db.prepare('INSERT INTO Patients (FullName, Phone) VALUES (?, ?)');
        const info = stmt.run(FullName, Phone);
        res.json({ id: info.lastInsertRowid, message: 'Patient added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});