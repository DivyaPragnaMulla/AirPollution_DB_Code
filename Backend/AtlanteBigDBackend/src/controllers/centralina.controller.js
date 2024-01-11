import Centralina from "../models/centralina.model";

// Create and Save a new Centralina Fissa con relativa posizione
export function create(req, res) {
  // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }

    // Create a Centralina Fissa
    const centralina = new Centralina({
        idCentralina: req.body.idCentralina,
        nomeCentralina: req.body.nomeCentralina,
        note: req.body.note,
        dataInizio:req.body.dataInizio,
        dataModifica:req.body.dataModifica,
        dataCessazione:req.body.dataCessazione,
        hasSoglie:req.body.hasSoglie,
        tipologia:"fissa",//nel nostro caso sono tutte centraline fisse
        //attributi propri di posizione
        indirizzo:req.body.indirizzo,
        latitudine:req.body.latitudine,
        longitudine:req.body.longitudine,
        //foreign key del comune (codice istat)
        FKcomune:req.body.FKcomune,
    });
    // Save Centralina fissa in the database
    Centralina.create(centralina, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Centralina.",
            kind: err.kind || err
        });
        else res.send(data);
    });
}

export function createInquinanteCentralina(req,res){
  if (!req.body) {
    res.status(400).send({
    message: "Content can not be empty!"
    });
  }
  // crea puomisurare che collega inquinante a centralina
  const puomisurare = {
    FKcentralina: req.body.FKcentralina,
    FKinquinante: req.body.FKinquinante,
  };
  Centralina.insertInquinanteCentralina(puomisurare,(err,data)=>{
    if(err){
      res.status(500).send({
        message: err.message || "Some error occurred while inserting inquinante for Centralina"
      });
    }
    else{
      res.send(data);
    }
  })
}
