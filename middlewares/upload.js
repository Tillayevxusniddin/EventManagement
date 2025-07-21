// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'public/uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Faylni qanday va qayerga saqlashni sozlaymiz
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Xatolik: Faqat rasm fayllarni yuklash mumkin!'));
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB cheklov
    }
});

module.exports = upload;