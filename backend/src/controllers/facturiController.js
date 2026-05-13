const db=require('../database');//importam conexiunea la baza de date
const getFacturi=async(req,res)=>{ //functia care se executa cand cineva face un request
    try{
            const [rows] = await db.query('SELECT facturi.id, facturi.suma, facturi.data_emitere, facturi.scadenta, facturi.platita, facturi.descriere,users.nume FROM facturi JOIN chiriasi ON facturi.chirias_id = chiriasi.id JOIN users ON chiriasi.user_id = users.id');
            res.json(rows); //Trimiţi datele înapoi ca JSON.
    }
    catch(err)
    {
        res.status(500).json({error:err.message});
    }
};
module.exports={getFacturi}; //Exporti funcţia ca să o poţi folosi în fişierul de rute.
        