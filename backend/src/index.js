require('dotenv').config(); //require este echivalent cu import
//rutele sunt adrese. cand frontendul face un request, serverul stie sa trimita datele de la chiriasi
const authRoutes=require('./routes/auth'); // .=ramai unde esti; ..=urca un nivel in ierarhie; ./=ramai in acelasi folder
const chiriasRoutes=require('./routes/chirias');
const apartamenteRoutes=require('./routes/apartamente');
const facturiRoutes=require('./routes/facturi');
const ticketsRoutes=require('./routes/tickets');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // portul Vite/React
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use('/api/auth',authRoutes); 
app.use('/api/chirias',chiriasRoutes); 
app.use('/api/apartamente',apartamenteRoutes);
app.use('/api/facturi',facturiRoutes);
app.use('/api/tickets',ticketsRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'RentFlow API functioneaza!' });
});
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ 
    eroare: err.message || 'Eroare internă server.' 
  });
});
app.listen(PORT, () => {
  console.log(`Server pornit pe portul ${PORT}`);
});