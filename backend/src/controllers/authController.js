const db = require('../database');//importa conexiunea la baza de date
const jwt = require('jsonwebtoken');//importa biblioteca pentru crearea token-urilor JWT
const bcrypt = require('bcryptjs');//importa biblioteca pentru hash-uirea parolelor si compararea acestora

const login = async (req, res) => {
  try {
    const { email, parola } = req.body; //extrage mail si parola trimise din frontend
   if (!email || typeof email !== 'string' || email.trim() === "" || 
        !parola || typeof parola !== 'string' || parola.trim() === "") {
        return res.status(400).json({ 
            error: "Emailul și parola sunt obligatorii!", 
            eroare: "Emailul și parola sunt obligatorii!" 
        });
      }
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);//cauta in baza de date userul cu mailul respectiv, daca exista, si returneaza toate datele lui (inclusiv parola hashuita)

    if (rows.length === 0)//daca nu exista niciun user cu mailul respectiv, returneaza eroare
      return res.status(401).json({ error: 'Email sau parolă greşită.', eroare: 'Email sau parolă greşită.' });

    const user = rows[0];//ia primul user gasit
    const valid = await bcrypt.compare(parola, user.parola);//compara parola trimisa de frontend cu parola hashuita din baza de date, folosind bcrypt

    if (!valid)//daca parolele nu se potrivesc atunci arunca eroare de autentificare, pentru a nu oferi informatii despre care dintre cele doua (email sau parola) este gresit
      return res.status(401).json({ error: 'Email sau parolă greşită.', eroare: 'Email sau parolă greşită.' });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },//creeaza un token JWT care contine id-ul si rolul user-ului, folosind secretul definit in variabila de mediu JWT_SECRET si setand o expirare de 8 ore
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, rol: user.rol, nume: user.nume });//daca autentificarea a fost cu succes, returneaza token-ul JWT, rolul si numele user-ului catre frontend
  } catch (err) {
    res.status(500).json({ error: 'Email sau parolă greşită.', eroare: 'Email sau parolă greşită.' });
  }
};
const register = async (req, res) => {
  try {
    const { nume, email, parola, telefon, rol } = req.body;

    // VALIDARE ROBUSTĂ la Înregistrare (Să nu fie goale, nedefinite sau alte tipuri de date)
    if (!nume || typeof nume !== 'string' || nume.trim() === "" ||
        !email || typeof email !== 'string' || email.trim() === "" ||
        !parola || typeof parola !== 'string' || parola.trim() === "") {
        return res.status(400).json({ 
            error: "Câmpurile nume, email și parolă sunt obligatorii!", 
            eroare: "Câmpurile nume, email și parolă sunt obligatorii!" 
        });
    }

    const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length > 0)
      return res.status(400).json({ error: 'Email-ul este deja folosit.', eroare: 'Email-ul este deja folosit.' });

    const hash = await bcrypt.hash(parola, 10);
    
    await db.query(
      'INSERT INTO users (nume, email, parola, telefon, rol) VALUES (?, ?, ?, ?, ?)',
      [nume, email, hash, telefon || null, rol || 'chirias']
    );

    res.status(201).json({ mesaj: 'Cont creat cu succes.' });
  } catch (err) {
    res.status(500).json({ error: err.message, eroare: err.message });
  }
};
module.exports = { login,register };//exporta functia login pentru a putea fi folosita in alte fisiere, cum ar fi rutele de autentificare din auth.js
