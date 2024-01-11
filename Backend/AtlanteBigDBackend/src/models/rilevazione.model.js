import sql from "./db";

// constructor
class Rilevazione {
    constructor(rilevazione) {
        this.datiRilevazione = {};
        this.datiRilevazione.idRilevazione = rilevazione.idRilevazione;
        this.datiRilevazione.valore = rilevazione.valore;
        if(rilevazione.FKcentralina != "null"){
            this.datiRilevazione.FKcentralina = rilevazione.FKcentralina;
        }
        if(rilevazione.FKinquinante != "null"){
            this.datiRilevazione.FKinquinante = rilevazione.FKinquinante;
        }
        if(rilevazione.dataRilevazione != "null"){
            this.datiRilevazione.dataRilevazione = rilevazione.dataRilevazione;
        }
        if(rilevazione.dataModifica != "null"){
            this.datiRilevazione.dataModifica = rilevazione.dataModifica;
        }
        if(rilevazione.anno != "null"){
            this.datiRilevazione.anno = rilevazione.anno;
        }
     
        this.inquinante={};
        if(rilevazione.sigla != "null"){
            this.inquinante.sigla=rilevazione.sigla;
        }
        if(rilevazione.valoreLimite != "null"){
            this.inquinante.valoreLimite=rilevazione.valoreLimite;
        }
        this.centralina={};
        if(rilevazione.nomeCentralina != "null"){
            this.centralina.nomeCentralina=rilevazione.nomeCentralina;
        }
        this.posizione={};
        if(rilevazione.indirizzo != "null"){
            this.posizione.indirizzo=rilevazione.indirizzo;
        }
        if(rilevazione.latitudine != "null"){
            this.posizione.latitudine=rilevazione.latitudine;
        }
        if(rilevazione.longitudine != "null"){
            this.posizione.longitudine=rilevazione.longitudine;
        }
    }

    static create(newRilevazione, result) {
        createNewRilevazione(newRilevazione).then((res)=>{
            result(null,res);
        }).catch((err)=>{
            result(err,null);
        });
    }

    static getAll_withPolluntant(inquinanti, result) {
        var str='';
        for(var i in inquinanti) {
            if((i==0) && (inquinanti!=undefined))   
                str = "i.sigla=\""+inquinanti[i] + "\" "
            else {
                str = str + "OR i.sigla=\""+inquinanti[i] + "\" "
            }
        }
        console.log(str)
        sql.query(`SELECT 
                    YEAR(r.dataRilevazione) AS anno,
                    prov.sigla AS provincia,
                    i.sigla AS sigla,
                    i.valoreLimite AS valoreLimite,
                    AVG(r.valore) AS valore_medio,
                    MAX(r.valore) AS valore_max,
                    MIN(r.valore) AS valore_min,
                    ((MAX(r.valore) + MIN(r.valore)) / 2) AS valore_pond_max_min,
                    ((((MAX(r.valore) + MIN(r.valore)) / 2) + AVG(r.valore)) / 2) AS valore_pond
                FROM
                    ((((rilevazione r
                    JOIN centralina c ON ((c.idCentralina= r.FKcentralina)))
                    JOIN inquinante i ON ((i.idinquinante = r.FKinquinante)))
                    JOIN comune com ON ((c.FKcomune = com.istat_code)))
                    JOIN provincia prov ON ((com.FKprovincia = prov.sigla)))
                WHERE
                    ((YEAR(r.dataRilevazione) = 2010)
                        AND (${str}))
                GROUP BY anno , provincia , i.sigla , i.valoreLimite`, (err, res) => {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                            return;
                        }

                        console.log("rilevazioni PM : ", res);
                        result(null, res);
        });
    } 
    static getAll(result) {
        sql.query("SELECT * FROM valori_annuali_all_centraline", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("rilevazioni: ", res);
            result(null, res);
        });
    }
    static getAllOnlyPM(result) {
        sql.query("SELECT * FROM valori_annuali_all_centraline_only_pm", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            console.log("rilevazioni PM10 e PM2.5: ", res);
            result(null, res);
        });
    }
    static getAllOnlyPM_withYear(anno, result) {
        sql.query(`SELECT 
        YEAR(r.dataRilevazione) AS anno,
        c.nomeCentralina AS nomeCentralina,
        p.indirizzo AS indirizzo,
        com.istat_code AS istat_comune,
        com.nome AS comune,
        prov.sigla AS provincia,
        p.latitudine AS latitudine,
        p.longitudine AS longitudine,
        i.sigla AS sigla,
        i.valoreLimite AS valoreLimite,
        AVG(r.valore) AS valore_medio,
        MAX(r.valore) AS valore_max,
        MIN(r.valore) AS valore_min,
        ((MAX(r.valore) + MIN(r.valore)) / 2) AS valore_pond_max_min,
        ((((MAX(r.valore) + MIN(r.valore)) / 2) + AVG(r.valore)) / 2) AS valore_pond
    FROM
        ((((((rilevazione r
        JOIN centralina c ON ((c.idCentralina = r.FKcentralina)))
        JOIN sitrova st ON ((c.idCentralina = st.FKcentralina)))
        JOIN posizione p ON ((p.idPosizione = st.FKposizione)))
        JOIN inquinante i ON ((i.idinquinante = r.FKinquinante)))
        JOIN comune com ON ((c.FKcomune = com.istat_code)))
        JOIN provincia prov ON ((com.FKprovincia = prov.sigla)))
    WHERE
        ((c.FKcomune = p.FKcomune)
            AND (i.sigla = "PM10")
            AND (YEAR(r.dataRilevazione) =  '${anno}'))
    GROUP BY anno , c.nomeCentralina , p.indirizzo , com.istat_code , comune , provincia , p.latitudine , p.longitudine , i.sigla , i.valoreLimite
    ORDER BY anno`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("rilevazioni PM10 e PM2.5: ", res);
            result(null, res);
        });
    }
    static getAllPerProvinciaOnlyPM10(result) {
        sql.query("SELECT * FROM valori_annuali_province_pm", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("rilevazioni PM : ", res);
            result(null, res);
        });
    }
    static getAllPerProvinciaOnlyPM10_withYear(anno, result) {
        sql.query(`SELECT 
        YEAR(r.dataRilevazione) AS anno,
        prov.sigla AS provincia,
        i.sigla AS sigla,
        i.valoreLimite AS valoreLimite,
        AVG(r.valore) AS valore_medio,
        MAX(r.valore) AS valore_max,
        MIN(r.valore) AS valore_min,
        ((MAX(r.valore) + MIN(r.valore)) / 2) AS valore_pond_max_min,
        ((((MAX(r.valore) + MIN(r.valore)) / 2) + AVG(r.valore)) / 2) AS valore_pond
    FROM
        ((((rilevazione r
        JOIN centralina c ON ((c.idCentralina= r.FKcentralina)))
        JOIN inquinante i ON ((i.idinquinante = r.FKinquinante)))
        JOIN comune com ON ((c.FKcomune = com.istat_code)))
        JOIN provincia prov ON ((com.FKprovincia = prov.sigla)))
    WHERE
        ((YEAR(r.dataRilevazione) = '${anno}')
            AND (i.sigla = 'PM10'))
    GROUP BY anno , provincia , i.sigla , i.valoreLimite`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("rilevazioni PM : ", res);
            result(null, res);
        });
    }
    static getAllPerProvincia_withYear(inquinanti, anno, result) {
        var str='';
        for(var i in inquinanti) {
            if((i==0) && (inquinanti!=undefined))   
                str = "i.sigla=\""+inquinanti[i] + "\" "
            else {
                str = str + "OR i.sigla=\""+inquinanti[i] + "\" "
            }
        }
        sql.query(`SELECT 
                    YEAR(r.dataRilevazione) AS anno,
                    prov.sigla AS provincia,
                    i.sigla AS sigla,
                    i.valoreLimite AS valoreLimite,
                    AVG(r.valore) AS valore_medio,
                    MAX(r.valore) AS valore_max,
                    MIN(r.valore) AS valore_min,
                    ((MAX(r.valore) + MIN(r.valore)) / 2) AS valore_pond_max_min,
                    ((((MAX(r.valore) + MIN(r.valore)) / 2) + AVG(r.valore)) / 2) AS valore_pond
                FROM
                    ((((rilevazione r
                    JOIN centralina c ON ((c.idCentralina= r.FKcentralina)))
                    JOIN inquinante i ON ((i.idinquinante = r.FKinquinante)))
                    JOIN comune com ON ((c.FKcomune = com.istat_code)))
                    JOIN provincia prov ON ((com.FKprovincia = prov.sigla)))
                WHERE
                    ((YEAR(r.dataRilevazione) = '${anno}')
                        AND (${str}))
                GROUP BY anno , provincia , i.sigla , i.valoreLimite`, (err, res) => {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                            return;
                        }

                        console.log("rilevazioni PM : ", res);
                        result(null, res);
        });
      
    } 
	static getByProvincia_allYears(inquinanti, provincia, result) {
        var str='';
        for(var i in inquinanti) {
            if((i==0) && (inquinanti!=undefined))   
                str = "i.sigla=\""+inquinanti[i] + "\" "
            else {
                str = str + "OR i.sigla=\""+inquinanti[i] + "\" "
            }
        }
        sql.query(`SELECT 
                            YEAR(r.dataRilevazione) AS anno,
                            prov.sigla AS provincia,
                            i.sigla AS sigla,
                            i.valoreLimite AS valoreLimite,
                            round(AVG(r.valore)) AS valore_medio,
                            MAX(r.valore) AS valore_max,
                            MIN(r.valore) AS valore_min,
                            round((MAX(r.valore) + MIN(r.valore)) / 2) AS valore_pond_max_min,
                            round((((MAX(r.valore) + MIN(r.valore)) / 2) + AVG(r.valore)) / 2) AS valore_pond
                        FROM
                            ((((rilevazione r
                            JOIN centralina c ON ((c.idCentralina= r.FKcentralina)))
                            JOIN inquinante i ON ((i.idinquinante = r.FKinquinante)))
                            JOIN comune com ON ((c.FKcomune = com.istat_code)))
                            JOIN provincia prov ON ((com.FKprovincia = prov.sigla)))
                        WHERE
                            ((YEAR(r.dataRilevazione) >= 2010)
                                AND (${str}) AND prov.sigla="${provincia}")
                        GROUP BY anno , provincia , i.sigla , i.valoreLimite`,
         (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
            console.log("rilevazioni di provincia : ", res);
            result(null, res);
        });
      
    } 
	static getByProvincia(inquinanti, anno, provincia, result) {
        var str='';
        for(var i in inquinanti) {
            if((i==0) && (inquinanti!=undefined))   
                str = "i.sigla=\""+inquinanti[i] + "\" "
            else {
                str = str + "OR i.sigla=\""+inquinanti[i] + "\" "
            }
        }
        console.log(str)
        sql.query(`SELECT 
                    YEAR(r.dataRilevazione) AS anno,
                    prov.sigla AS provincia,
                    i.sigla AS sigla,
                    i.valoreLimite AS valoreLimite,
                    AVG(r.valore) AS valore_medio,
                    MAX(r.valore) AS valore_max,
                    MIN(r.valore) AS valore_min,
                    ((MAX(r.valore) + MIN(r.valore)) / 2) AS valore_pond_max_min,
                    ((((MAX(r.valore) + MIN(r.valore)) / 2) + AVG(r.valore)) / 2) AS valore_pond
                FROM
                    ((((rilevazione r
                    JOIN centralina c ON ((c.idCentralina= r.FKcentralina)))
                    JOIN inquinante i ON ((i.idinquinante = r.FKinquinante)))
                    JOIN comune com ON ((c.FKcomune = com.istat_code)))
                    JOIN provincia prov ON ((com.FKprovincia = prov.sigla)))
                WHERE
                    ((YEAR(r.dataRilevazione) = '${anno}')
                        AND (${str}) AND prov.sigla = '${provincia}' )
                GROUP BY anno , provincia , i.sigla , i.valoreLimite`, (err, res) => {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);

                            return;
                        }
                        console.log("rilevazioni PM : ", res);
                        result(null, res);
        });
      
    } 
    static getAll_withYear(inquinanti, anno, result) {
        var str='';
        for(var i in inquinanti) {
            if((i==0) && (inquinanti!=undefined))   
                str = "i.sigla=\""+inquinanti[i] + "\" "
            else {
                str = str + "OR i.sigla=\""+inquinanti[i] + "\" "
            }
        }
        sql.query(`SELECT 
                    YEAR(r.dataRilevazione) AS anno,
                    c.nomeCentralina AS nomeCentralina,
                    p.indirizzo AS indirizzo,
                    com.istat_code AS istat_comune,
                    com.nome AS comune,
                    prov.sigla AS provincia,
                    p.latitudine AS latitudine,
                    p.longitudine AS longitudine,
                    i.sigla AS sigla,
                    i.valoreLimite AS valoreLimite,
                    AVG(r.valore) AS valore_medio,
                    MAX(r.valore) AS valore_max,
                    MIN(r.valore) AS valore_min,
                    ((MAX(r.valore) + MIN(r.valore)) / 2) AS valore_pond_max_min,
                    ((((MAX(r.valore) + MIN(r.valore)) / 2) + AVG(r.valore)) / 2) AS valore_pond
                FROM
                    ((((((rilevazione r
                    JOIN centralina c ON ((c.idCentralina = r.FKcentralina)))
                    JOIN sitrova st ON ((c.idCentralina = st.FKcentralina)))
                    JOIN posizione p ON ((p.idPosizione = st.FKposizione)))
                    JOIN inquinante i ON ((i.idinquinante = r.FKinquinante)))
                    JOIN comune com ON ((c.FKcomune = com.istat_code)))
                    JOIN provincia prov ON ((com.FKprovincia = prov.sigla)))
                WHERE
                    ((c.FKcomune = p.FKcomune)
                        AND (${str})
                        AND (YEAR(r.dataRilevazione) =  '${anno}'))
                GROUP BY anno , c.nomeCentralina , p.indirizzo , com.istat_code , comune , provincia , p.latitudine , p.longitudine , i.sigla , i.valoreLimite`, (err, res) => {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);

                            return;
                        }

                        console.log("rilevazioni PM : ", res);
                        result(null, res);
        });
      
    } 

//funzione richiamata nel burden of disease
    static getMeanConcentrationByYearProvincia_OnlyPM25(provincia,year,result){
        getMeanConcentrationByYearProvinciaOnlyPM25(provincia,year).then((res)=>{
            result(null,res);
        }).catch((err)=>{
            result(err,null);
        });
    }
    
//funzione richiamata nel burden of disease
    static getMeanConcentrationAndPopulationByYear_OnlyPM25_AllProvince(year,min_eta,max_eta,result){
        getMeanConcentrationANDPopulationByYearAllProvinceOnlyPM25(year,min_eta,max_eta).then((res)=>{
            result(null,res);
        }).catch((err)=>{
            result(err,null);
        });
    }
}
//Funzione che restituisce una promise
//si occupa di creare una nuova Rilevazione
function createNewRilevazione(rilevazione){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO rilevazione SET ?",rilevazione,(err, res)=>{
            if(err){
                console.log("error: ",err);
                reject(err);
            }
            else
            {
                rilevazione.idRilevazione=res.insertId;
                console.log("success created rilevazione \n",rilevazione);
                resolve(rilevazione);
            }
        });
    });
}

//funzione per trovare la media delle rilevazioni di PM2.5 in una certa provincia 
//e in un certo anno (utilizzata nel burden of disease)
function getMeanConcentrationByYearProvinciaOnlyPM25(provincia,year){
    return new Promise((resolve,reject)=>{
        var query = `SELECT avg(r.valore) media
        FROM rilevazione as r
        join centralina as c on r.FKcentralina=c.idCentralina
        join comune as cm on cm.istat_code=c.FKcomune
        join inquinante as i on i.idinquinante=r.FKinquinante
        where i.sigla="PM2.5" and
        year(r.dataRilevazione)=${year}
        and cm.FKprovincia="${provincia}"`;
        console.log(query);
        sql.query(query,(err,res)=>{
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                if(res.length){
                    console.log("media ",res[0]);
                    if(res[0].media==null){
                        console.log("null1");
                        reject({kind:"Media non trovata!"});
                    }
                    else{
                        resolve(res[0]);
                    }
                }
                else{
                    console.log("Media non trovata");
                    reject({kind:"Media non trovata!"});
                }
            }
        });

    });
}

//funzione che restituisce la concentrazione media dell'inquinante in un anno
//e la popolazione di ciascuna provincia per la fascia d'età indicata
//utilizzata per i calcoli di BoD e IE
function getMeanConcentrationANDPopulationByYearAllProvinceOnlyPM25(year,min_eta,max_eta){
    return new Promise((resolve,reject)=>{
        var query = `SELECT avg(r.valore) media, cm.FKprovincia, popolazione
        FROM rilevazione as r
        join centralina as c on r.FKcentralina=c.idCentralina
        join comune as cm on cm.istat_code=c.FKcomune
        join inquinante as i on i.idinquinante=r.FKinquinante
        join totale_popolazione as p on p.provincia=cm.FKprovincia
        where i.sigla="PM2.5" and
        year(r.dataRilevazione)=${year}
        and p.anno=${year} and p.eta_max=${max_eta} AND p.eta_min=${min_eta}
        group by cm.FKprovincia, popolazione`;
        console.log(query);
        sql.query(query,(err,res)=>{
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                if(res.length){
                    console.log(res);
                    resolve(res);
                }
                else{
                    console.log("Media non trovata");
                    reject({kind:"Media non trovata!"});
                }
            }
        });
    });
}

module.exports = Rilevazione;