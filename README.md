# Integral Property Management

Aplicație web pentru managementul apartamentelor, chiriașilor, facturilor și tichetelor de mentenanță.

---

## Tech Stack

| Componentă | Tehnologie |
|------------|------------|
| Backend | Node.js + Express |
| Frontend | React |
| Baza de date | MySQL |
| Autentificare | JWT (JSON Web Tokens) |

---

## Structura proiectului

```
Integral-Property-Management/
├── backend/          # API REST (Node.js + Express)
│   └── src/
│       ├── routes/       # Definițiile rutelor
│       ├── controllers/  # Logica de business
│       ├── middleware/   # Autentificare JWT
│       └── utils/        # Funcții utilitare
├── frontend/         # Interfața utilizator (React)
├── database/         # Schema SQL
│   └── schema.sql
└── README.md
```

---

## Instalare și rulare locală

### Cerințe
- Node.js v18+
- MySQL 8+
- Git

### Pași

**1. Clonează repository-ul**
```bash
git clone https://github.com/andreiBirsanIoan/Integral-Property-Management.git
cd Integral-Property-Management
```

**2. Instalează dependențele backend**
```bash
cd backend
npm install
```

**3. Configurează variabilele de mediu**

Creează un fișier `.env` în folderul `backend/` cu următorul conținut:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=parola_ta
DB_NAME=apartamente
JWT_SECRET=un_string_lung_si_random_de_cel_putin_32_caractere
```

**4. Creează baza de date**

Rulează fișierul `database/schema.sql` în MySQL Workbench sau din terminal:
```bash
mysql -u root -p < database/schema.sql
```

**5. Pornește serverul**
```bash
npm run dev
```

Serverul pornește pe `http://localhost:5000`.

---

## Reguli Git

### Branch-uri
| Branch | Scop |
|--------|------|
| `main` | Cod stabil, producție — nu se lucrează direct pe el |
| `dev` | Branch principal de dezvoltare |
| `feature/*` | Branch nou pentru fiecare feature |

### Fluxul de lucru
```
dev → git checkout -b feature/nume-feature → lucrezi → commit → push → Pull Request spre dev → merge
```

### Înainte să începi să lucrezi
```bash
git checkout dev
git pull
git checkout -b feature/numele-feature-tau
```

### Format commit messages
```
feat: descriere scurtă        # feature nou
fix: descriere scurtă         # rezolvare bug
refactor: descriere scurtă    # restructurare cod
docs: descriere scurtă        # documentație
```

### Reguli importante
- Nu se face push direct pe `main`
- Nu se face merge fără Pull Request aprobat
- Fiecare feature are branch-ul lui separat
- Mesajele de commit trebuie să fie descriptive

---

## API Endpoints

| Metodă | Endpoint | Descriere |
|--------|----------|-----------|
| POST | `/api/auth/login` | Autentificare |
| GET | `/api/chiriasi` | Listă chiriași |
| POST | `/api/chiriasi` | Adaugă chiriaș |
| GET | `/api/apartamente` | Listă apartamente |
| GET | `/api/facturi` | Listă facturi |
| GET | `/api/tickets` | Listă tichete |

Documentație completă API în `API_SPEC.md`.

---

## Variabile de mediu

| Variabilă | Descriere |
|-----------|-----------|
| `PORT` | Portul pe care rulează serverul |
| `DB_HOST` | Host-ul bazei de date |
| `DB_USER` | Utilizatorul MySQL |
| `DB_PASSWORD` | Parola MySQL |
| `DB_NAME` | Numele bazei de date |
| `JWT_SECRET` | Secretul pentru semnarea token-urilor JWT |

> Fișierul `.env` nu se urcă niciodată pe GitHub.