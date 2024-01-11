import Eta from "../models/eta.model";

export function findAll(req,res){
  Eta.getAll((err, data) => {
      if (err)
          res.status(500).send({
              message:
              err.message || "Some error occurred while retrieving eta."
          });
      else res.send(data);
  });

}
