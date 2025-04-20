const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const firebaseAdmin = require('firebase-admin');
const app = express();
const port = 3000;


app.use(cors({
  origin:'*' , // Ya da * tüm kaynaklara izin verir.
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 

const serviceAccount = require('./dietapph-firebase-adminsdk.json'); 

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://dietapph-default-rtdb.firebaseio.com/'
});

const db = firebaseAdmin.database(); 


const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyalarına izin verilir'), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});


app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`; 
  

  const newUserRef = db.ref('users').push(); 
  newUserRef.set({
    username: req.body.username,
    photoUrl: fileUrl
  })
    .then(() => res.status(200).json({ url: fileUrl }))
    .catch((err) => res.status(500).json({ error: 'Database error' }));
});


app.get('/user/:username/photo', (req, res) => {
  const usersRef = db.ref('users');
  usersRef.orderByChild('username').equalTo(req.params.username).once('value', snapshot => {
    if (!snapshot.exists()) {
      return res.status(404).send('No photo found for this user');
    }
    const userData = snapshot.val();
    const user = Object.values(userData)[0]; 
    res.status(200).json({ photoUrl: user.photoUrl });
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
