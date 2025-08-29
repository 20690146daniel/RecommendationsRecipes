const express = require('express');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/auth', require('./routes/auth'));

app.use('/recipes', require('./routes/recipes'));


app.get('/', (req, res) => {
  res.json({ message: 'API de recetas esta funcinado' });
});



module.exports = app;