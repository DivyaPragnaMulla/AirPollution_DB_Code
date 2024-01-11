import sql from "./db";

// constructor
class Eta {
    constructor(eta) {
        this.datiEta = {};
        this.datiEta.idFasciaEta = eta.idFasciaEta;
        this.datiEta.min = eta.min;
        this.datiEta.max = eta.max;
        this.datiEta.categoria = eta.categoria;
    }

	static getAll(result) {
        sql.query(`SELECT * FROM fascia_eta`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            console.log("eta : ", res);
            result(null, res);
        });
    }
}
module.exports = Eta;