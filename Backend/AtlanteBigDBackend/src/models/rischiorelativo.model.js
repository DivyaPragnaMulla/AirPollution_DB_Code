import sql from "./db";

// constructor
class RischioRelativo {
    constructor() {
    }

    //trova i rischi relativi memorizzati nel database
    //relativi all'Integrated Exposure Response Function
    //concentrazioneINTinf = concentrazione inq. approssimata per difetto a numero intero
    static findRischioIER(calculation_method,min_eta,max_eta,effetto,concentrazioneINTinf,result){
        findRischioRelativoIER(calculation_method,min_eta,max_eta,effetto,concentrazioneINTinf).then((res)=>{
            console.log("rischio relativo ",res);
            result(null,res);
        }).catch((err)=>{
            console.log("errore",err);
            result(err,null);
        });
    }
}

//funzione che estrae dal database il rischio relativo per una certa concentrazione
//(intero inferiore e superiore) su un certo effetto sulla salute dovuto all'esposizione
//i possibili effetti sono IHD, STROKE, COPD, LC
//calculation method for Burden of disease IER2016_GBD2015-2016
function findRischioRelativoIER(calculation_method,min_eta,max_eta,effetto,concentrazioneINTinf){
    return new Promise((resolve,reject)=>{
        var query = `SELECT rr_mean,rr_lower,rr_upper FROM ier_function
                where (concentrazione=${concentrazioneINTinf} OR concentrazione=${concentrazioneINTinf+1})
                and effetto="${effetto}"
                and calculation_method="${calculation_method}"
                and min_eta=${min_eta} 
                and max_eta=${max_eta}
                order by concentrazione`;
        console.log(query);
        sql.query(query,(err, res)=>{
            if(err){
                reject(err);
            }
            else{
                if(res.length){
                    resolve(res);//resituisce due valori se va tutto bene
                }
                else{
                    reject({kind:"Rischio Relativo non trovato"});
                }
            }
        });
    });
}

module.exports = RischioRelativo;