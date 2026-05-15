const jwt = require('jsonwebtoken');//importa biblioteca jsonwebtoken pentru a lucra cu token-urile JWT
//tokenul este un string care contine informatii despre utilizator, cum ar fi id-ul sau, si este semnat cu o cheie secreta pentru a preveni falsificarea. Cand un utilizator se autentifica, serverul genereaza un token care contine aceste informatii si il trimite inapoi clientului. Clientul stocheaza acest token (de obicei in localStorage sau cookies) si il include in header-ul Authorization al fiecarui request ulterior catre server. Serverul verifica tokenul pentru a se asigura ca este valid si pentru a extrage informatiile despre utilizator, permitand astfel accesul la resursele protejate.
module.exports = (req, res, next) => {  //functie middleware, decide daca un request poate continua catre ruta sau daca trebuie blocat din cauza lipsei unui token valid
  const authHeader = req.headers['authorization'];//extrage header-ul Authorization din request
  const token = authHeader && authHeader.split(' ')[1];//daca header-ul exista, imparte-l in doua parti folosind spatiul ca separator si ia a doua parte (tokenul propriu-zis). Daca header-ul nu exista, token va fi undefined

  if (!token) {//daca tokenul nu exista, returneaza eroare de autentificare
    return res.status(401).json({ eroare: 'Token lipsă.' });
  }

  try { //daca token-ul exista, verifica-l folosind secretul definit in variabila de mediu JWT_SECRET. Daca token-ul e valid, decodeaza-l pentru a extrage informatiile despre utilizator si le ataseaza la obiectul req.user pentru a fi accesibile in rutele protejate. Apoi apeleaza next() pentru a permite request-ului sa continue catre ruta.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ eroare: 'Token invalid sau expirat.' });
  }
};