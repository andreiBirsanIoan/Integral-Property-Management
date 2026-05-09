const jwt = require('jsonwebtoken');
//tokenul este un string care contine informatii despre utilizator, cum ar fi id-ul sau, si este semnat cu o cheie secreta pentru a preveni falsificarea. Cand un utilizator se autentifica, serverul genereaza un token care contine aceste informatii si il trimite inapoi clientului. Clientul stocheaza acest token (de obicei in localStorage sau cookies) si il include in header-ul Authorization al fiecarui request ulterior catre server. Serverul verifica tokenul pentru a se asigura ca este valid si pentru a extrage informatiile despre utilizator, permitand astfel accesul la resursele protejate.
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ eroare: 'Token lipsă.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ eroare: 'Token invalid sau expirat.' });
  }
};