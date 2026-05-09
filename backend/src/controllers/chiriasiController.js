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
module.exports={getChiriasi}; //Exporti funcţia ca să o poţi folosi în fişierul de rute.