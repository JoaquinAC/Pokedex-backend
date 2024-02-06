const {
    getTypesController
} = require("../controllers/typesController")


const getTypesHandler = async (req, res) => {
    try {
      const types = await getTypesController();
      res.status(200).json(types);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los tipos de Pokémon.' });
    }
};

module.exports = {
    getTypesHandler
 }
 