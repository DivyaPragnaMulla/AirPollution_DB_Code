import sql from "./db";
import { v4 as uuidv4 } from 'uuid';

// constructor
class Mortalita {
    constructor(mortalita) {
        this.datiMortalita = {};
        this.datiMortalita.idMortalita = uuidv4();
        this.datiMortalita.anno = mortalita.anno;
        this.datiMortalita.valore = mortalita.valore;
        this.datiMortalita.sesso = mortalita.sesso;

        this.min_eta = mortalita.min_eta;
        this.max_eta = mortalita.max_eta;
        this.causa = mortalita.causa;

        this.nomeProvincia = mortalita.provincia;
    }

    static create(newMortalita, result) {
        Promise.all([findProvinciaByName(newMortalita.nomeProvincia),
            findCausaMorteByName(newMortalita.causa),
            findFasciaEtaByValues(newMortalita.min_eta,newMortalita.max_eta)
        ]).then((risultati)=>{
            var mortalita = {
                ...newMortalita.datiMortalita,
                FK_provincia:risultati[0].sigla,
                FKcausa:risultati[1].idCausa,
                FKfasciaEta:risultati[2].idFasciaEta
            };
            return createNewMortalita(mortalita);
        }).then((res)=>{
            result(null,res);
        }).catch((err)=>{
            result(err,null);
        });
    }
	static getAll_withYear(anno, result) {
        sql.query(`SELECT m.idMortalita, m.anno, m.FK_provincia, m.sesso, m.valore as mortalita, pop.valore as popolazione,
        round((m.valore/pop.valore)*1000,2) as tasso_mortalita
        FROM ((mortalita as m JOIN fascia_eta as f ON m.FKfasciaEta=f.idFasciaEta) 
        JOIN causa as c ON c.idCausa=m.FKcausa)
        JOIN popolazione as pop ON pop.FKfasciaeta = m.FKfasciaEta
        where anno = '${anno}' and m.FKfasciaEta = 18 AND m.FK_provincia=pop.FKprovincia
        AND YEAR(pop.periodorilevazione)=m.anno-1  
        AND m.sesso="T" AND c.descrizione LIKE "totale"
        order by m.FK_provincia;`
        , (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("mortalita per anno: ", res);
            result(null, res);
        });
    }
	   
	static getByProvincia(anno, provincia, result) {
        sql.query(`SELECT m.idMortalita, m.anno, m.FK_provincia, m.sesso, m.valore as mortalita, pop.valore as popolazione,
        round((m.valore/pop.valore)*1000,2) as tasso_mortalita
        FROM ((mortalita as m JOIN fascia_eta as f ON m.FKfasciaEta=f.idFasciaEta) 
        JOIN causa as c ON c.idCausa=m.FKcausa)
        JOIN popolazione as pop ON pop.FKfasciaeta = m.FKfasciaEta
        where anno = '${anno}' and m.FKfasciaEta = 18 AND m.FK_provincia=pop.FKprovincia
        AND YEAR(pop.periodorilevazione)=m.anno-1 AND m.FK_provincia = '${provincia}'
        AND m.sesso="T" AND c.descrizione LIKE "totale"
        order by m.FK_provincia;`
        , (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("mortalita per anno: ", res);
            result(null, res);
        });
    }
    static getByProvincia_allYears(provincia, result) {
        sql.query(`SELECT m.anno, m.FK_provincia, m.sesso,
        SUM(m.valore) as mortalita, 
        round(AVG(pop.valore)) as popolazione,
        round((SUM(m.valore)/AVG(pop.valore))/2*1000,2) as tasso_mortalita
        FROM ((mortalita as m JOIN fascia_eta as f ON m.FKfasciaEta=f.idFasciaEta) 
        JOIN causa as c ON c.idCausa=m.FKcausa)
        JOIN popolazione as pop ON pop.FKfasciaeta = m.FKfasciaEta
        where m.FK_provincia='${provincia}' and anno>=2010 and m.FK_provincia=pop.FKprovincia
        AND YEAR(pop.periodorilevazione)=m.anno-1  
        AND m.sesso="T" 
        group by m.anno, m.FK_provincia, m.sesso
        order by m.anno, m.FK_provincia;`
        , (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("mortalita per provincia di tutti gli anni dal 2010 in poi: ", res);
            result(null, res);
        });
    }
    static findNaturaliByAnnoProvinciaSessoEta(anno,provincia,sesso,min_eta,max_eta,result){
        findMortiNaturaliByAnnoProvinciaSessoEta(anno,provincia,sesso,min_eta,max_eta).then((res)=>{
            console.log("morti",res);
            result(null,res);
        }).catch((err)=>{
            console.log("errore",err);
            result(err,null);
        });
    }
	
	static getMorti_allProvince_ByMalattiaAnno(anno,effetto,min_eta,max_eta, result){
        findMorti_allProvince_ByMalattiaAnno(anno, effetto,"T",min_eta,max_eta).then((res)=>{
            console.log("morti",res);
            result(null,res);
        }).catch((err)=>{
            console.log("errore",err);
            result(err,null);
        });
    }
    
    static getMorti_allProvince_ByMalattia(effetto,min_eta,max_eta, result){
        findMorti_allProvince_ByMalattiaAnno(effetto,"T",min_eta,max_eta).then((res)=>{
            console.log("morti",res);
            result(null,res);
        }).catch((err)=>{
            console.log("errore morti",err);
            result(err,null);
        });
    }
    
    static findMortiByMalattiaAnnoProvinciaSessoEta(effetto,anno,provincia,sesso,min_eta,max_eta,result){
        findMortiByMalattiaAnnoProvinciaSessoEta(effetto,anno,provincia,sesso,min_eta,max_eta).then((res)=>{
            console.log("morti",res);
            result(null,res);
        }).catch((err)=>{
            console.log("errore",err);
            result(err,null);
        });
    }
}

//Funzione che restituisce una promise
//si occupa di cercare la provincia e restituire il risultato
function findProvinciaByName(provincia){
    return new Promise((resolve,reject)=>{
        sql.query(`SELECT * FROM provincia where nome='${provincia}'`,(err, res)=>{
            if(err){
                reject(err);
            }
            else{
                if(res.length){
                    resolve(res[0]);
                }
                else{
                    reject({kind:"Provincia non trovata!"});
                }
            }
        });
    })
}
//cerca nel database la causa di morte indicata e la restituisce
function findCausaMorteByName(causa){
    return new Promise((resolve,reject)=>{
        sql.query(`SELECT * FROM causa where descrizione='${causa}'`,(err, res)=>{
            if(err){
                reject(err);
            }
            else{
                if(res.length){
                    resolve(res[0]);
                }
                else{
                    reject({kind:"Causa di morte non trovata!"});
                }
            }
        });
    })
}

//max può essere al più 120 ma deve essere sempre fornito
function findFasciaEtaByValues(min,max){
    var query1;
    query1=`SELECT * FROM fascia_eta where min='${min}' AND max='${max}'`;
    return new Promise((resolve,reject)=>{
        sql.query(query1,(err, res)=>{
            if(err){
                reject(err);
            }
            else{
                if(res.length){
                    resolve(res[0]);
                }
                else{
                    reject({kind:"Fascia eta non trovata!"});
                }
            }
        });
    })

}
//funzione che crea nuovo record in tabella mortalita e restituisce una promise
function createNewMortalita(mortalita){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO mortalita SET ?",mortalita,(err, res)=>{
            if(err){
                console.log("error: ",err);
                reject(err);
            }
            else
            {
                console.log("success created mortalita \n",mortalita);
                resolve(mortalita);
            }
        });
    });
}

//trova il totale delle morti per cause naturali avvenute in una certa provincia e in un certo
//anno e corrispondenti a una certa fascia di età
function findMortiNaturaliByAnnoProvinciaSessoEta(anno,provincia,sesso,min_eta,max_eta){
    var query1=`select m.valore-(select t.totale_causenonnaturali
        from totalecausenonnaturalimorte as t
        where t.anno=${anno}
        and t.FK_provincia = "${provincia}"
        and t.sesso="${sesso}"
        and t.min_eta=${min_eta}
        and t.max_eta=${max_eta}) morticausenaturali
        from mortalita as m join causa as c on c.idCausa=m.FKcausa
        join fascia_eta as f on m.FKfasciaEta=f.idFasciaEta
        where m.anno=${anno}
        and m.FK_provincia="${provincia}"
        and m.sesso="${sesso}"
        and f.min=${min_eta}
        and f.max=${max_eta}
        and c.descrizione="totale";`;
    console.log(query1);
    return new Promise((resolve,reject)=>{
        sql.query(query1,(err, res)=>{
            if(err){
                reject(err);
            }
            else{
                if(res.length){
                    resolve(res[0]);
                }
                else{
                    reject({kind:"Totale morti naturali non trovato!"});
                }
            }
        });
    })
}

//trova il totale di morti per una delle cause previste da AIRQ+ indicata in effetto
function findMortiByMalattiaAnnoProvinciaSessoEta(effetto,anno,provincia,sesso,min_eta,max_eta){
    var query1=`SELECT sum(valore) morticausa, FKairqplus as cause
    FROM causamorteairqplus as c
    join mortalita as m on m.FKcausa=c.idCausa
    join fascia_eta as f on f.idFasciaEta=m.FKfasciaEta
    where FKairqplus="${effetto}"
    and FK_provincia="${provincia}"
    and anno=${anno}
    and min=${min_eta}
    and max=${max_eta}
    and sesso="${sesso}"`;
    console.log(query1);
    return new Promise((resolve,reject)=>{
        sql.query(query1,(err, res)=>{
            if(err){
                reject(err);
            }
            else{
                if(res.length){
                    resolve(res[0]);
                }
                else{
                    reject({kind:"Totale morti per causa non trovato!"});
                }
            }
        });
    })
}

function findMorti_allProvince_ByMalattiaAnno(anno, effetto, sesso, min_eta, max_eta){
    var query1=`SELECT sum(valore) morticausa, anno, FK_provincia as provincia
    FROM causamorteairqplus as c
    join mortalita as m on m.FKcausa=c.idCausa
    join fascia_eta as f on f.idFasciaEta=m.FKfasciaEta
    where FKairqplus="${effetto}"    
    and min=${min_eta}
    and max=${max_eta}
    and sesso="${sesso}"   
    and anno="${anno}"
    group by anno, FK_provincia`;
    console.log(query1);
    return new Promise((resolve,reject)=>{
        sql.query(query1,(err, res)=>{
            if(err){
                reject(err);
            }
            else{
                if(res.length){
                    resolve(res);
                }
                else{
                    reject({kind:"Totale morti per causa non trovato!"});
                }
            }
        });
    })
}

module.exports = Mortalita;