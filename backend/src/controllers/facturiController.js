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
const addFacturi=async(req,res)=>{
    try{
        const{chirias_id,suma,data_emitere,scadenta,descriere}=req.body;
        const dataEmitere = data_emitere || new Date().toISOString().split('T')[0];
const dataScadenta = scadenta || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        if (!chirias_id || !suma ) {
    return res.status(400).json({ 
        error: "ID si suma sunt obligatorii!",
        eroare: "ID si suma sunt obligatorii!"
    });
    }

if (isNaN(suma) || Number(suma) <= 0) {
    return res.status(400).json({ 
        error: "Suma trebuie sa fie un numar pozitiv!",
        eroare: "Suma trebuie sa fie un numar pozitiv!"
    });
    } 
     const [result]=await db.query('INSERT INTO facturi (chirias_id, suma, data_emitere, scadenta, descriere) VALUES (?,?,?,?,?)',[chirias_id,suma,dataEmitere,dataScadenta,descriere]); 
     res.status(201).json({message:"Factura adaugata cu succes",mesaj:"Factura adaugata cu succes"});
    }
    catch(err){
        res.status(400).json({error:err.message,eroare:err.message});
    }
}
const putFacturi=async(req,res)=>{
    const{id}=req.params;
    try{
        const[result]=await db.query('UPDATE facturi SET platita=1 WHERE id=?',[id]);
        if(result.affectedRows==0){
            return res.status(404).json({message:"Factura nu a fost gasita"});
        }
        res.status(201).json({message:"Factura a fost platita cu succes"});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}
module.exports={getFacturi,addFacturi,putFacturi}; //Exporti funcţia ca să o poţi folosi în fişierul de rute.
        