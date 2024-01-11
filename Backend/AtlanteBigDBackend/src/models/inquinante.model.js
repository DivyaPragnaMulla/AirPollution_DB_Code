import sql from "./db";

// constructor
class Inquinante {
    constructor(inquinante) {
        this.idinquinante=inquinante.idinquinante;
        this.nome=inquinante.nome;
        this.sigla=inquinante.sigla;
        this.descrizione=inquinante.descrizione;
        this.valoreLimite=inquinante.valoreLimite;
        this.sogliaAllarme=inquinante.sogliaAllarme;
        this.unitaMisura=inquinante.unitaMisura;
        this.parametroDiValutazione=inquinante.parametroDiValutazione;
        this.principioDiFunzionamento=inquinante.principioDiFunzionamento;
    }

    static create(newInquinante, result) {
        createNewInquinante(newInquinante).then((res)=>{
            result(null,res);
        }).catch((err)=>{
            result(err,null);
        });
    }
	static getAll(result) {
        sql.query("SELECT inq.sigla as name, inq.valoreLimite, inq.unitaMisura FROM inquinante as inq WHERE inq.valoreLimite IS NOT NULL", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            console.log("inquinanti: ", res);
            result(null, res);
        });
    }
}

//Funzione che restituisce una promise
//si occupa di creare il nuovo inquinante
function createNewInquinante(inquinante){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO inquinante SET ?",inquinante,(err, res)=>{
            if(err){
                if(err.errno==1062){
                    reject({kind:"Un inquinante con tale codice è già presente nel database."});
                }
                else{
                    console.log("error: ",err);
                    reject(err);
                }
            }
            else
            {
                console.log("success created inquinante \n",inquinante);
                resolve(inquinante);
            }
        });
    });
}
module.exports = Inquinante;