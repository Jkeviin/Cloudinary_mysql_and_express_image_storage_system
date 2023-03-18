const cloudinary = require('cloudinary').v2;
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'dma9ouzwf',
  api_key: '613731451848539',
  api_secret: 'RaOglZL1K3XiItWXtmzZH0ENte4'
});

// Configuración de multer y CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'imagenes',
    format: async (req, file) => 'jpg',
    public_id: (req, file) => file.fieldname + '-' + Date.now(),
  }
});
const upload = multer({ storage: storage });

// Configuración de MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lavasoft2'
});

// Conexión a la base de datos
connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log('Conexión exitosa a la base de datos!');
});

// Configuración de CORS
app.use(cors());

// Configuración de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para subir una imagen a Cloudinary y guardar su URL en la base de datos
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    // Guardar la URL de la imagen en la base de datos
    const imageUrl = req.file.path;
    const sql = 'INSERT INTO imagenes (url) VALUES (?)';
    connection.query(sql, [imageUrl], (error, result) => {
      if (error) {
        res.status(500).send('Hubo un error al guardar la imagen en la base de datos');
      } else {
        res.status(200).send(result);
      }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Endpoint para subir varias imágenes a Cloudinary y guardar sus URLs en la base de datos
app.post('/api/upload-multiple', upload.array('images'), async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path);
    const sql = 'INSERT INTO imagenes (url) VALUES ?';
    const values = imageUrls.map((url) => [url]);
    connection.query(sql, [values], (error, result) => {
      if (error) {
        res.status(500).send('Hubo un error al guardar las imágenes en la base de datos');
      } else {
        res.status(200).send(result);
      }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Endpoint para obtener todas las imágenes de la base de datos
app.get('/api/imagenes', (req, res) => {
  const sql = 'SELECT * FROM imagenes';
  connection.query(sql, (error, result) => {
    if (error) {
      res.status(500).send('Hubo un error al obtener las imágenes de la base de datos:');
    } else {
      res.status(200).send(result);
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});