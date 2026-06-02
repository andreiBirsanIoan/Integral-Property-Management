const db=require('../database');//importam conexiunea la baza de date
const getTickets=async(req,res)=>{ //functia care se executa cand cineva face un request
    try{
        const[rows]=await db.query('SELECT tickets.id,tickets.titlu,tickets.descriere,tickets.status,tickets.creat_de,users.nume,apartament.adresa  FROM tickets JOIN users ON tickets.creat_de=users.id JOIN apartamente ON tickets.apartament_id = apartamente.id');
        res.json(rows); //Trimiţi datele înapoi ca JSON.
    }
    catch(err)
    {
        res.status(500).json({error:err.message});
    }
};
const putTickets=async(req,res)=>{
    const{id}=req.params;
    const{status}=req.body;
    try{
        const [result]=await db.query('UPDATE tickets SET status=? where id=?',[status,id]);
       if(result.affectedRows==0){
        return res.status(404).json({message:"Tichetul nu a fost gasit"});
       }
        res.status(201).json({message:"Tichet actualizat cu succes"});   
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}
module.exports={getTickets,putTickets}; //Exporti funcţia ca să o poţi folosi în fişierul de rute.