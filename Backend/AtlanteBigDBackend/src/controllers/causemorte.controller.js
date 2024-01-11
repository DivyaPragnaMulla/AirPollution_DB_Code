import CausaMorte from "../models/causamorte.model";

//Crea e Salva un nuova causa morte
export function create(req, res) {
  // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }
    
    // Crea nuovo Causa Morte
    const causamorte = new CausaMorte({
        listaCategorie:req.body.List
    });
    // Salva Causa Morte nel database
    CausaMorte.create(causamorte, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Causa Morte.",
            kind: err.kind || err
        });
        else res.send(data);
    });
}
//aggiunge a una causa di morte la categoria airq+ corrispondente
export function addCategoryAirqplus(req, res) {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
      
    const causamorte = new CausaMorte({
        FKairqplus:req.body.categoriaAirQplus,
        FKcausa:req.body.idCausa
    });
      
    CausaMorte.addCategoryAirqplus(causamorte, (err, data) => {
        if (err)
        {
            res.status(500).send({
                message:
                err.message || "Some error occurred.",
                kind: err.kind || err
            });
        }
        else 
            res.send(data);
    });
}

export function findAll_airqplus(req,res){
    CausaMorte.getAll_airqplus((err, data) => {
        if (err)
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving causa morte airqplus."
            });
        else res.send(data);
    });
}