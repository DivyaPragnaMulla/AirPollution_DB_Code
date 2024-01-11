import Comune from "../models/comune.model";

// Create and Save a new Comune
export function create(req, res) {
  // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }
    
    // Create new Comune
    const comune = new Comune({
        istat_code:req.body.istat_code,
        nome:req.body.nome,
        latitudine:req.body.latitudine,
        longitudine:req.body.longitudine,
        nomeProvincia:req.body.nomeProvincia,
        vecchioCodiceIstat:req.body.vecchioCodiceIstat,
        annoCambiamento:req.body.annoCambiamento
    });
    // Save Comune in the database
    Comune.create(comune, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Comune.",
            kind: err.kind || err
        });
        else res.send(data);
    });
}