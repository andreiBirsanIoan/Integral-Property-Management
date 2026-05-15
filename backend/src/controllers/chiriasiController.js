const db=require('../database');//importam conexiunea la baza de date
const getChiriasi=async(req,res)=>{ //functia care se executa cand cineva face un request
    try{
        const [rows] =await db.query('SELECT chiriasi.id,users.nume,users.email,users.telefon,apartamente.adresa,chiriasi.data_contract,chiriasi.data_expirare,chiriasi.activ FROM chiriasi JOIN users ON chiriasi.user_id=users.id JOIN apartamente ON chiriasi.apartament_id=apartamente.id WHERE chiriasi.activ=1;');//chiriasi atciv=1 returnezi doar chiriaşii activi, nu şi cei cu contracte vechi.
        //trimiti query-ul SQL la MySQL si astepti rezultatul.rows conţine datele returnate — o listă de chiriasi.

        res.json(rows); //Trimiţi datele înapoi ca JSON.
    }
    catch(err)
    {
        res.status(500).json({error:err.message});
    }
};
const addChirias=async(req,res)=>{
    try{
        const{user_id,apartament_id,data_contract,data_expirare}=req.body;//extragi datele necesare din corpul cererii
        await db.query('INSERT INTO chiriasi (user_id, apartament_id, data_contract, data_expirare, activ) VALUES (?, ?, ?, ?, 1)', [user_id, apartament_id, data_contract, data_expirare]);//executi un query SQL pentru a adauga un nou chirias in baza de date. Setezi activ la 1 pentru a marca chiriasul ca fiind activ.
        res.json({message:'Chirias adaugat cu succes'}); //Trimiţi un mesaj de succes înapoi ca JSON.IN cazul în care adăugarea a fost cu succes, returnezi un mesaj de confirmare către frontend.
    }
    catch(err)
    {
        res.status(500).json({error:err.message});
    }
}
module.exports={getChiriasi,addChirias}; //Exporti funcţia ca să o poţi folosi în fişierul de rute.