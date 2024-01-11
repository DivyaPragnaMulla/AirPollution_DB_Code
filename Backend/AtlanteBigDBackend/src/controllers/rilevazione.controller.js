import Rilevazione from "../models/rilevazione.model";

//Crea e Salva un nuova rilevazione
export function create(req, res) {
  // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }
    // Crea nuova rilevazione
    const rilevazione = new Rilevazione({
        idRilevazione:req.body.idRilevazione,
        dataRilevazione:req.body.dataRilevazione,
        dataModifica:req.body.dataModifica,
        anno:req.body.anno,

        valore:req.body.valore,
        valore_medio:req.body.valore_medio,
        valore_max:req.body.valore_max,
        valore_min:req.body.valore_min,
        valore_pond_min_max:req.body.valore_pond_min_max,
        valore_pond:req.body.valore_pond,

        FKcentralina:req.body.FKcentralina,
        FKinquinante:req.body.FKinquinante,
        sigla: req.body.sigla,
        valoreLimite: req.body.valoreLimite,
        nomeCentralina: req.body.nomeCentralina,
        indirizzo: req.body.indirizzo,
        latitudine: req.body.latitudine,
        longitudine: req.body.longitudine
    });
    // Salva rilevazione nel database
    Rilevazione.create(rilevazione, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Rilevazione.",
            kind: err.kind || err
        });
        else res.send(data);
    });
}

export function findAll(req,res){
    Rilevazione.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving rilevazioni."
            });
        else res.send(data);
    });
}

export function findAll_withYear(req,res){
    Rilevazione.getAll_withYear(req.body, req.params.anno, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                  message: `Not found Rilevazione with polluntant ${req.body} for year.`
              });
            } else {
              res.status(500).send({
                message: "Error retrieving Rilevazione with pollution " + req.body
              });
            }
          } else res.send(data);
        });
  
}
export function findByProvincia_allYears(req,res){
  Rilevazione.getByProvincia_allYears(req.body, req.params.provincia, (err, data) => {
      if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
                message: `Not found Rilevazione with polluntant ${req.body} and prov name.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Rilevazione with pollution " + req.body
            });
          }
        } else res.send(data);
      });

}
export function findByProvincia(req,res){
  Rilevazione.getByProvincia(req.body, req.params.anno, req.params.provincia, (err, data) => {
      if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
                message: `Not found Rilevazione with polluntant ${req.body} for year and prov name.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Rilevazione with pollution " + req.body
            });
          }
        } else res.send(data);
  });
}

export function findAllPerProvincia_withYear(req,res){
    Rilevazione.getAllPerProvincia_withYear(req.body, req.params.anno, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                  message: `Not found Rilevazione with polluntant ${req.body} for year.`
              });
            } else {
              res.status(500).send({
                message: "Error retrieving Rilevazione with pollution " + req.body
              });
            }
          } else res.send(data);
        });
}

export function findAll_withPolluntant(req,res){
    Rilevazione.getAll_withPolluntant(req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                  message: `Not found Rilevazione with polluntant ${req.body}.`
              });
            } else {
              res.status(500).send({
                message: "Error retrieving Rilevazione with pollution " + req.body
              });
            }
          } else res.send(data);
        });
}