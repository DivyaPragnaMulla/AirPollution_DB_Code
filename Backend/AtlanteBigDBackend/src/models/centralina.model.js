import sql from "./db";

// constructor
class Centralina {
    constructor(centralina) {
        this.datiCentralina = {};
        this.datiCentralina.idCentralina = centralina.idCentralina;
        this.datiCentralina.nomeCentralina = centralina.nomeCentralina;
        if(centralina.note != "null"){
            this.datiCentralina.note = centralina.note;
        }
        if(centralina.dataInizio != "null"){
            this.datiCentralina.dataInizio = new Date(centralina.dataInizio);
        }
        if(centralina.dataModifica != "null"){
            this.datiCentralina.dataModifica = new Date(centralina.dataModifica);
        }
        if(centralina.dataCessazione != "null"){
            this.datiCentralina.dataCessazione = new Date(centralina.dataCessazione);
        }
        if(centralina.hasSoglie==0){
            this.datiCentralina.hasSoglie = false;
        }
        else{
            this.datiCentralina.hasSoglie = true;
        }
        this.datiCentralina.tipologia=centralina.tipologia;
        this.posizione={};
        if(centralina.indirizzo != "null"){
            this.posizione.indirizzo=centralina.indirizzo;
        }
        this.posizione.latitudine=centralina.latitudine;
        this.posizione.longitudine=centralina.longitudine;
        this.posizione.FKcomune=centralina.FKcomune;
    }

    static create(newCentralina, result) {
        findCodiceComune(newCentralina.posizione.FKcomune).then((res)=>{
            newCentralina.posizione.FKcomune=res;
            createFindPosizioneCentralina(newCentralina.posizione).then((res1)=>{
                createCentralinaWithPosition(newCentralina,res1).then((res2)=>{
                    var risultato = {
                        centralina:{...newCentralina.datiCentralina, FKcomune:newCentralina.posizione.FKcomune},
                        posizione: {...res1}
                    }
                    result(null,risultato);
                }).catch((err2)=>{
                    result(err2,null);
                });
            }).catch((err)=>{
                result(err,null);
            });
        }).catch((err)=>{
            result(err,null);
        })
    }

    static insertInquinanteCentralina(puomisurare, result){
        saveInquinanteCentralina(puomisurare).then((res)=>{
            result(null,res)
        }).catch((err)=>{
            result(err,null)
        });
    }
}

function cercaCodiceComune(FKcomune){
    return new Promise((resolve,reject)=>{
        sql.query("select * from diventa where istat_code_vecchio="+FKcomune,(err,res)=>{
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                console.log(res);
                if(res.length){
                    //trovato un codice aggiornato
                    resolve(res[0].istat_code_nuovo)
                }
                else
                {
                    resolve(FKcomune);
                }
            }
        });
    });
}
//Funzione asincrona per trovare il codice del comune più aggiornato
async function findCodiceComune(FKcomune){
   var istat_code = FKcomune;
   var ripeti = true;
   var risultato;
   while(ripeti){
        risultato = await cercaCodiceComune(istat_code).then((res)=>{
            if(res===istat_code){
                console.log("istat code trovato");
                ripeti=false;
                return Promise.resolve(istat_code);
            }
            else
            {
                istat_code=res;
            }
        }).catch((err)=>{
            ripeti=false;
            return Promise.reject(err);
        });
   }
   return risultato;
}

//Funzione asincrona che restituisce una promise
//si occupa di cercare se la posizione indicata per inserire la nuova centralina è già presente
//se non la trova nel database la crea. Il risultato in caso di successo saranno in ogni caso
//tutti i dati relativi alla posizione compreso l'id che servirà in seguito
async function createFindPosizioneCentralina(posizione){
    var risultato = await searchPosizione(posizione).then(async(res)=>{
            if(res.kind === "not_found"){
                console.log("non ho trovato la posizione. La creo");
                //restituisce una promise con il risultato della creazione della posizione
                return createPosizione(posizione);
            }
            else
            {
                return Promise.resolve(res);
            }
        }).catch((error)=>{
        //se ci sono errori nella ricerca della posizione restituisce una promise rejected
        return Promise.reject(error);
    });
    return risultato;//restituisce la promise alla funzione principale che l'ha invocata
}
//crea una nuova posizione in cui si trovaerà l'antenna
function createPosizione(posizione){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO posizione SET ?", posizione,(err, res)=>{
            if(err){
                if(err.errno==1452){
                    console.log("Non posso inserire la posizione perchè il comune non è ancora presente nel DB");
                    reject({kind:"Comune non presente nel db. inserire prima il comune"});
                }
                else
                {
                    reject(err); 
                }
            }
            else
            {
                console.log("creata nuova posizione: ",{ id: res.insertId, ...posizione });
                resolve({ idPosizione: res.insertId, ...posizione });
            }
        });
    });
}
//vede se la posizione indicata per la nuova centralina è già presente nel db
function searchPosizione(posizione){
    return new Promise((resolve,reject)=>{
        sql.query(`SELECT * FROM posizione where indirizzo='${posizione.indirizzo}' AND latitudine=${posizione.latitudine} AND longitudine=${posizione.longitudine} AND fkComune=${posizione.FKcomune}`,(err, res)=>{
            if(err){
                reject(err);
            }
            else
            {
                if(res.length){
                    resolve(res[0]);
                }
                else{//posizione not found
                    resolve({kind:"not_found"});
                }
            }
        });
    });
}
//funzione asincrona che restituisce una promise. Prima crea una nuova centralina
//successivamente la collega alla posizione trovata precedentemente
async function createCentralinaWithPosition(newCentralina,posizione){
    var risultato = await createNewCentralina({...newCentralina.datiCentralina,FKcomune:newCentralina.posizione.FKcomune})
    .then(()=> {
        return connectWithPosition(newCentralina.datiCentralina.idCentralina, posizione.idPosizione, newCentralina.datiCentralina.dataInizio);
    })
    .catch((err)=>{
        return Promise.reject(err);
    });
    return risultato;
}

function createNewCentralina(centralina){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO centralina SET ?",centralina,(err, res)=>{
            if(err){
                if(err.errno==1062){
                    reject({kind:"Una centralina con tale codice è già presente nel database. Se non si tratta della stessa cambiare codice"});
                }
                else{
                    console.log("error: ",err);
                    reject(err);
                }
            }
            else
            {
                console.log("success created centralina \n",centralina);
                resolve(centralina);
            }
        });
    });
}

function connectWithPosition(idCentralina,idPosizione,dataOra){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO sitrova SET ?",{FKcentralina:idCentralina,FKposizione:idPosizione,dataOra},(err, res)=>{
            if(err){
                console.log("error nel sitrova inserimento: ",err);
                reject(err);
            }
            else
            {
                console.log("success created connection with position \n",idCentralina,idPosizione);
                resolve(res);
            }
        });
    });
}

function saveInquinanteCentralina(puomisurare){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO puomisurare SET ?",puomisurare,(err,res)=>{
            if(err){
                console.log("error: ",err);
                reject(err);
            }
            else{
                console.log("success ",res);
                resolve(res);
            }
        });
    })
}

module.exports = Centralina;