const db=require('../database');//importam conexiunea la baza de date
const getTickets=async(req,res)=>{ //functia care se executa cand cineva face un request
    try{
        const[rows]=await db.query('SELECT tickets.id,tickets.titlu,tickets.descriere,tickets.status,tickets.creat_de,users.nume,apartamente.adresa  FROM tickets JOIN users ON tickets.creat_de=users.id JOIN apartamente ON tickets.apartament_id = apartamente.id');
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
        const statusuriPermise = ['open', 'in_progress', 'resolved'];

        // 2. VALIDARE ROBUSTĂ: Verificăm dacă statusul există, e string și se află în lista permisă
        if (!status || typeof status !== 'string' || !statusuriPermise.includes(status.trim())) {
            return res.status(400).json({ 
                error: "Status invalid! Valorile permise sunt: 'open', 'in_progress' sau 'resolved'.",
                eroare: "Status invalid! Valorile permise sunt: 'open', 'in_progress' sau 'resolved'."
            });
        }
        const [result]=await db.query('UPDATE tickets SET status=? where id=?',[status,id]);
       if (result.affectedRows == 0) {
            return res.status(404).json({ 
                error: "Tichetul nu a fost gasit", 
                eroare: "Tichetul nu a fost gasit",
                message: "Tichetul nu a fost gasit",
                mesaj: "Tichetul nu a fost gasit"
            });
        }
       res.status(200).json({ 
            message: "Tichet actualizat cu succes",
            mesaj: "Tichet actualizat cu succes"
        });  
    }
    catch(err){
        res.status(500).json({error:err.message,eroare:err.message});
    }
}
module.exports={getTickets,putTickets}; //Exporti funcţia ca să o poţi folosi în fişierul de rute.