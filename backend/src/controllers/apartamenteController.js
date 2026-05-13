const db=require('../database');//importam conexiunea la baza de date
const getApartamente=async(req,res)=>{ //functia care se executa cand cineva face un request
    try{
        const[rows]=await db.query('SELECT apartamente.id, apartamente.adresa, apartamente.etaj, users.nume FROM apartamente JOIN users ON apartamente.proprietar_id = users.id');
        res.json(rows);
    }
    catch(err)
    {
        res.status(500).json({error:err.message});
    }
};
module.exports={getApartamente}; //Exporti funcţia ca să o poţi folosi în fişierul de rute.