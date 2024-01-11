import Mortalita from "../models/mortalita.model";

// Crea e salva Mortalità
export function create(req, res) {
  // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }
    
    // Create new Mortalita
    const mortalita = new Mortalita({
        causa:req.body.causa,
        anno:req.body.anno,
        valore:req.body.valore,
        provincia:req.body.provincia,
        sesso:req.body.sesso,
        min_eta:req.params.min,
        max_eta:req.params.max
    });
    // Save Mortalita in the database
    Mortalita.create(mortalita, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Mortalita.",
            kind: err.kind || err
        });
        else res.send(data);
    });
}

export function findAll_withYear(req,res){
    Mortalita.getAll_withYear(req.params.anno, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                  message: `Not found Mortalita with id ${req.params.anno}.`
              });
            } else {
              res.status(500).send({
                message: "Error retrieving Mortalita with year " + req.params.anno
              });
            }
          } else res.send(data);
        });
}

export function findByProvincia(req,res){
  Mortalita.getByProvincia(req.params.anno, req.params.provincia, (err, data) => {
      if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
                message: `Not found Mortalita with year ${req.params.anno} and prov name ${req.params.provincia}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Mortalita with year " + req.params.anno + "and prov name" + req.params.provincia
            });
          }
        } else res.send(data);
      });
}
export function findByProvincia_allYears(req,res){
  Mortalita.getByProvincia_allYears(req.params.provincia, (err, data) => {
      if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
                message: `Not found Mortalita with prov name ${req.params.provincia}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Mortalita with prov name" + req.params.provincia
            });
          }
        } else res.send(data);
      });

}
export function findMorti_allProvince_ByMalattia(req,res){
  Mortalita.getMorti_allProvince_ByMalattia(req.params.effetto, req.params.min_eta, req.params.max_eta, (err, data) => {
      if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
                message: `Not found Mortalita with  ${req.params.effetto}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Mortalita with disease " + req.params.effetto
            });
          }
        } else res.send(data);
      });
}
export function findMorti_allProvince_ByMalattiaAnno(req,res){
  Mortalita.getMorti_allProvince_ByMalattiaAnno(req.params.anno, req.params.effetto, req.params.min_eta, req.params.max_eta, (err, data) => {
      if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
                message: `Not found Mortalita with  ${req.params.effetto}.`
            });
          }
          else {
            res.status(500).send({
              message: "Error retrieving Mortalita with disease " + req.params.effetto
            });
          }
        } 
        else 
          res.send(data);
      });

}
export function findMorti_ByMalattiaAnno(req,res){
  
  Mortalita.findMortiByMalattiaAnnoProvinciaSessoEta(req.params.effetto, req.params.anno, req.params.provincia, "T", req.params.min_eta, req.params.max_eta, (err, data) => {
      if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
                message: `Not found Mortalita with  ${req.params.effetto}.`
            });
          } 
          else {
            res.status(500).send({
              message: "Error retrieving Mortalita with disease " + req.params.effetto
            });
          }
        } 
        else 
          res.send(data);
      });
}