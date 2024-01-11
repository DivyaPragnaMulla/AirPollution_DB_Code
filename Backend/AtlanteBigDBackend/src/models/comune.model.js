import sql from "./db";

// constructor
class Comune {
    constructor(comune) {
        if(comune.vecchioCodiceIstat)
        {
            if(comune.vecchioCodiceIstat!="null"){
                this.datiVecchioComune={};
                this.datiVecchioComune.istat_code_vecchio=parseInt(comune.vecchioCodiceIstat,10);
                this.datiVecchioComune.istat_code_nuovo=comune.istat_code;
                if(comune.annoCambiamento!="null"){
                    var data = new Date (comune.annoCambiamento);
                    this.datiVecchioComune.annoCambiamento=data.getFullYear();
                }
            }
        }
        this.datiComune = {};
        this.datiComune.istat_code = comune.istat_code;
        this.datiComune.nome = comune.nome;
        this.datiComune.latitudine = comune.latitudine;
        this.datiComune.longitudine = comune.longitudine;
        this.datiProvincia={};
        this.datiProvincia.nomeProvincia = comune.nomeProvincia;
    }

    static create(newComune, result) {
        findProvinciaByName(newComune.datiProvincia).then((res)=>{
            return createNewComune({...newComune.datiComune,FKprovincia:res.sigla},newComune.datiVecchioComune);
        }).then((res)=>{
            result(null,res);
        }).catch((err)=>{
            result(err,null);
        });
    }
}

//Funzione che restituisce una promise
//si occupa di cercare la provincia e restituire il risultato
function findProvinciaByName(provincia){
    return new Promise((resolve,reject)=>{
        sql.query(`SELECT * FROM provincia where nome='${provincia.nomeProvincia}'`,(err, res)=>{
            if(err){
                reject(err);
            }
            else{
                if(res.length){
                    resolve(res[0]);
                }
                else{
                    reject({kind:"Provincia non trovata. Inserire prima la provincia"});
                }
            }
        });
    })
}
//funzione che crea nuovo comune e restituisce una promise
function createNewComune(comune,vecchioComune){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO comune SET ?",comune,(err, res)=>{
            if(err){
                if(err.errno==1062){
                    reject({kind:"Un comune con tale codice è già presente nel database."});
                }
                else{
                    console.log("error: ",err);
                    reject(err);
                }
            }
            else
            {
                if(vecchioComune)//se non è null inseriamo il comune con il vecchio codice nel db
                {
                    console.log(vecchioComune);
                    var vecchioComuneDati = {...comune};
                    vecchioComuneDati.istat_code=vecchioComune.istat_code_vecchio;

                    sql.query("INSERT INTO comune SET ?",vecchioComuneDati,(err, res)=>{
                        if(err){
                            if(err.errno==1062){
                                //Un comune con il codice vecchio fornito è già presente nel database
                                //creiamo solo il collegamento tra i due comuni
                                console.log("Un comune con il codice vecchio fornito è già presente nel database");
                            }
                            else{
                                console.log("error: ",err);
                                reject({kind:"il comune nuovo è stato inserito ma quello vecchio no.",...err});
                            }
                        }
                        //se non ci sono errori o se c'è un errore ma è solo quello 1062 allora si deve eseguire il collegamento
                        sql.query("INSERT INTO diventa SET ?",vecchioComune,(err,res)=>{
                            if(err){
                                console.log("errore ",err);
                                reject({kind:"il comune nuovo e quello vecchio sono stati memorizzati ma il collegamento tra i due non è stato creato",...err});
                            }
                            else{
                                console.log("success created comune e comune vecchio");
                                resolve(comune);
                            }
                        })
                    });
                }
                else{
                    console.log("success created comune \n",comune);
                    resolve(comune);
                }
            }
        });
    });
}

module.exports = Comune;