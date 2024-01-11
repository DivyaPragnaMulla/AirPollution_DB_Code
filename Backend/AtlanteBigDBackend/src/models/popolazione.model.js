import sql from "./db";

// constructor
class Popolazione {
    constructor() {
    }

    static findPopolazioneProvinciaAnno(anno,provincia,min_eta,max_eta,result){
        findPopolazioneByProvinciaANDAnno(anno,provincia,min_eta,max_eta).then((res)=>{
            console.log("popolazione",res);
            result(null,res);
        }).catch((err)=>{
            console.log("errore",err);
            result(err,null);
        });
    }
    static findPopolazioneByAnnoAllprovincie(anno,min_eta,max_eta,result){
        findPopolazioneByAnno(anno,min_eta,max_eta).then((res)=>{
            console.log("popolazione",res);
            result(null,res);
        }).catch((err)=>{
            console.log("errore",err);
            result(err,null);
        })
    }
}

//funzione per trovare il totale della popolazione di una certa fascia di età a inizio anno 
//in una provincia
function findPopolazioneByProvinciaANDAnno(anno,provincia,min_eta,max_eta){
    return new Promise((resolve,reject)=>{
        var query = `SELECT p.valore 
        FROM popolazione as p
        join fascia_eta AS f on f.idFasciaEta=p.FKfasciaeta
        where year(periodorilevazione)=${anno}
        AND FKprovincia="${provincia}"
        AND f.max=${max_eta}
        and f.min=${min_eta}`;
        console.log(query);
        sql.query(query,(err, res)=>{
            if(err){
                reject(err);
            }
            else{
                if(res){
                    if(res.length===0){
                        reject({message:"Non trovato"});
                    }
                    else
                    resolve({popolazione_totale:res[0].valore});
                }
                else{
                    resolve({message:"stai fuori"});
                }
            }
        });
    });
}

//funzione per trovare il totale della popolazione di una certa fascia di età a inizio anno 
//in tutte le provincie
function findPopolazioneByAnno(anno,min_eta,max_eta){
    return new Promise((resolve,reject)=>{
        var query = `SELECT p.valore, FKprovincia
        FROM popolazione as p
        join fascia_eta AS f on f.idFasciaEta=p.FKfasciaeta
        where year(periodorilevazione)=${anno}
        AND f.max=${max_eta}
        and f.min=${min_eta}
        order by FKprovincia`;
        console.log(query);
        sql.query(query,(err, res)=>{
            if(err){
                reject(err);
            }
            else{
                if(res.length===0){
                    reject({message:"Non trovato"});
                }
                else
                    resolve(res);
            }
        });
    });
}
module.exports = Popolazione;