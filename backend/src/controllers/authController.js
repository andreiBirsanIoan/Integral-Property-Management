const db = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  try {
    const { email, parola } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0)
      return res.status(401).json({ eroare: 'Email sau parolă greşită.' });

    const user = rows[0];
    const valid = await bcrypt.compare(parola, user.parola);

    if (!valid)
      return res.status(401).json({ eroare: 'Email sau parolă greşită.' });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, rol: user.rol, nume: user.nume });
  } catch (err) {
    res.status(500).json({ eroare: err.message });
  }
};

module.exports = { login };
