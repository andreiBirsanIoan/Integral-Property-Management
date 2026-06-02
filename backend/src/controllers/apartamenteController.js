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
const addApartamente=async(req,res)=>{
    const {adresa,etaj,numar_camere,proprietar_id,observatii}=req.body;
    try{
        const[result]=await db.query('INSERT INTO apartamente(adresa,etaj,numar_camere,proprietar_id,observatii) VALUES (?,?,?,?,?)',
            [adresa, etaj, numar_camere, proprietar_id || null, observatii]
        );
        res.status(201).json({message:"Apartament adaugat cu succes!", id:result.insertId});
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
};
const updateApartamente=async(req,res)=>{
    const {id}=req.params;
    const{adresa,etaj,numar_camere,proprietar_id,observatii}=req.body;
    try{
        const[result]=await db.query('UPDATE apartamente set adresa=?, etaj=?, numar_camere=?, proprietar_id=?, observatii=? WHERE id=?',
            [adresa, etaj, numar_camere, proprietar_id || null, observatii,id]
        );
        if(result.affectedRows==0)
        {
            return res.status(404).json({message:"Apartamentul nu a fost gasit."});
        }
        res.json({message:"Apartamentul modificat cu succes"});
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}
const deleteApartamente=async(req,res)=>{
    const {id}=req.params;
    try{
        const[result]=await db.query('DELETE FROM apartamente WHERE id=? ',[id]);
        if (result.affectedRows == 0) {
            return res.status(404).json({ message: "Apartamentul nu a fost gasit." });
        }
        res.json({ message: "Apartament sters cu succes!" });
    }
        catch (err) {
        res.status(500).json({ error: err.message });
        }
    
}
module.exports={getApartamente,addApartamente,updateApartamente,deleteApartamente}; //Exporti funcţia ca să o poţi folosi în fişierul de rute.