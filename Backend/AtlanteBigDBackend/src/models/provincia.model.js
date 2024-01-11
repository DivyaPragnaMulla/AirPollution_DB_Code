import sql from "./db";

// constructor
class Provincia {
    constructor() {
    }

	static getAll(result) {
        sql.query("SELECT sigla, nome FROM provincia", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("provincie: ", res);
            result(null, res);
        });
    }
}
module.exports = Provincia;