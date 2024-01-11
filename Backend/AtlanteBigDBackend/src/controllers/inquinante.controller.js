import Inquinante from "../models/inquinante.model";

//Crea e Salva un nuovo Inquinante
export function create(req, res) {
  // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }
    
    // Crea nuovo Inquinante
    const inquinante = new Inquinante({
        idinquinante:req.body.idinquinante,
        nome:req.body.nome,
        sigla:req.body.sigla,
        descrizione:req.body.descrizione,
        valoreLimite:req.body.valoreLimite,
        sogliaAllarme:req.body.sogliaAllarme,
        unitaMisura:req.body.unitaMisura,
        parametroDiValutazione:req.body.parametroDiValutazione,
        principioDiFunzionamento:req.body.principioDiFunzionamento
    });
    // Salva inquinante nel database
    Inquinante.create(inquinante, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Inquinante.",
            kind: err.kind || err
        });
        else res.send(data);
    });
}
export function findAll(req,res){
    Inquinante.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving polluntants."
            });
        else res.send(data);
    });
}