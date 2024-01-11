import sql from "./db";

// constructor
class CausaMorte {
    constructor(causamorte) {
        this.listaCategorie=causamorte.listaCategorie;

        //nel caso in cui dobbiamo aggiungere una causa di morte a una categoria AirQ+
        //si usa questa parte
        this.airQplus={};
        this.airQplus.FKairqplus=causamorte.FKairqplus;
        this.airQplus.FKcausa=causamorte.FKcausa;
    }

    static create(newCausaMorte, result) {
        creaCauseMorte(newCausaMorte).then((res)=>{
            result(null,res);
        }).catch((err)=>{
            result(err,null);
        });
    }

	static getAll_airqplus(result) {
        sql.query("SELECT * FROM causamorteairqplus", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("cause airq_plus: ", res);
            result(null, res);
        });
    }

    static addCategoryAirqplus(newCausaMorte,result){
        addAirQplus(newCausaMorte.airQplus).then((res)=>{
            result(null,res);
        }).catch((err)=>{
            result(err,null);
        });
    }
}

async function creaCauseMorte(cause){
    //ciclo che guarda se le cause sono già nel db altrimenti le inserisce
    //alla fine del ciclo se tutto è andato bene vede se è una categoria airq+ e la memorizza
    var i = 0;
    var result=null;
    var id = null;
    var risultati=[];
    while(i<cause.listaCategorie.length){
        result=await findCausa(cause.listaCategorie[i]).then(async (res)=>{
            if(res.kind==="not_found"){
                return createCausa(cause.listaCategorie[i],id).then((res2)=>{
                    console.log("risultato create ",res2);
                    if(res2.affectedRows&&res2.affectedRows===1)
                    {
                        var idprec=id;
                        id=res2.insertId;
                        console.log("inserito elemento con id ",id);
                        return Promise.resolve({idCausa:id,descrizione:cause.listaCategorie[i],idCategoriaSuperiore:idprec}); 
                    }
                    else
                    {
                        //errore durante la creazione reject
                        console.log("errore");
                        i=cause.listaCategorie.lenght;
                        return Promise.reject({message:"Non è stata creata la causa di morte "+cause.listaCategorie[i]});
                    }
                }).catch((err)=>{
                    return Promise.reject(err);
                });
            }
            else{
                console.log("id è ",res.idCausa);
                id=res.idCausa;
                return Promise.resolve(res);
            }
        }).catch((errore)=>{
            console.log("errore durante operazione");
            i=cause.listaCategorie.lenght;
            return Promise.reject(errore);
        });
        i++;
        risultati.push(result);
    }
    return risultati;
}

//cerca la causa di morte nel database
function findCausa(causa){
    return new Promise((resolve,reject)=>{
        sql.query(`SELECT * FROM causa where descrizione='${causa}'`,(err, res)=>{
            if(err){
                reject(err);
            }
            else{
                if(res.length){
                    console.log("res",res);
                    resolve(res[0]);
                }
                else{//causa morte not found
                    console.log("res not found is ",res);
                    resolve({kind:"not_found"});
                }
            }
        });
    })
}

//Funzione che restituisce una promise
//si occupa di trovare o creare la causa di morte
function createCausa(causa,categoriaSup){
    var causaInsert={
        descrizione:causa,
        idCategoriaSuperiore:categoriaSup
    }
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO causa SET ?",causaInsert,(err, res)=>{
            if(err){
                console.log("error: ",err);
                reject(err);
            }
            else
            {
                console.log("success created causa \n",res);
                resolve(res);
            }
        });
    });
}

function addAirQplus(gruppo){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO raggruppa SET ?",gruppo,(err, res)=>{
            if(err){
                console.log("error: ",err);
                reject(err);
            }
            else
            {
                console.log("success created causa \n",res);
                resolve(res);
            }
        });
    });
}

module.exports = CausaMorte;