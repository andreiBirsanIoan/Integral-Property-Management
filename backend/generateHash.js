const bcrypt = require('bcryptjs');

async function gen() {
  console.log('admin:', await bcrypt.hash('admin123', 10));
  console.log('proprietar:', await bcrypt.hash('proprietar123', 10));
  console.log('chirias1:', await bcrypt.hash('chirias123', 10));
  console.log('chirias2:', await bcrypt.hash('chirias123', 10));
}

gen();