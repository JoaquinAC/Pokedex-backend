const {
    createPokemon,
    getPokemonDetailID,
    getPokemonDetailName,
    getAllPokemonsAPI,
    deletePokemon,
    updatePokemon
} = require("../controllers/pokemonController")

//GET | /pokemons/search
const getPokemonsSearchHandler = async(req,res) => {
    try {
      const start = 1
      const end = 60
      const allPokemons = await getAllPokemonsAPI(start,end)

      res.status(200).json(allPokemons)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener la lista de Pokémones.' });
    }
}


//GET | /pokemons/:page

const getPokemonsHandler =  async(req,res) => {
    try {
        // Obtener todos los Pokémon desde la API
        const { page } = req.params;
        const pageSize = 12;

        const pokemons = await getAllPokemonsAPI(page , pageSize);
    
        // Enviar la respuesta con la lista de Pokémon
        res.status(200).json(pokemons);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la lista de Pokémon.' });
      }
};

// GET | /pokemons/:idPokemon
const getPokemonsIDHandler = async(req,res) => {
    try {
        const { id } = req.params;
        const byID = await getPokemonDetailID(id)

        res.status(200).json(byID)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el pokemon mediante ID.' });
    }
}


//  GET | /pokemons/name?="..."
const getPokemonsNameHandler = async(req,res) => {
    try {
        const { name } = req.query;
    
        // Verificar si se proporcionó el parámetro obligatorio 'name'
        if (!name || typeof name !== 'string') {
          return res.status(400).json({ error: 'El parámetro "name" es obligatorio y debe ser un string.' });
        }
    
        const pokemonDetail = await getPokemonDetailName(name);
    
        res.status(200).json(pokemonDetail);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles del Pokémon por nombre.' });
      }
};

//POST /pokemons

const postPokemonsHandler = async (req, res) => {
    try {
      const {
        name,
        image,
        hp,
        attack,
        defense,
        speed,
        height,
        weight,
        types
      } = req.body;
  
      if (!Array.isArray(types)) {
        throw new Error('El campo "types" debe ser un array.');
      }
  
      const createdPokemon = await createPokemon(
        name,
        image,
        hp,
        attack,
        defense,
        speed,
        height,
        weight,
        types.map((type) => type.toLowerCase()),
      );
  
      res.status(201).json(createdPokemon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el Pokémon.' });
    }
};

// DELETE /pokemons/:id
const deletePokemonHandler = async (req, res) => {
    try {
      const { id } = req.params;
  
      const pokemonId = parseInt(id, 10);
      
      const isDeleted = await deletePokemon(pokemonId);
  
      if (isDeleted) {
        res.status(200).json({ message: 'Pokémon eliminado exitosamente.' });
      } else {
        res.status(404).json({ error: 'No se encontró el Pokémon especificado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el Pokémon.' });
    }
  };


//PUT /pokemons/:id
const updatePokemonHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const pokemonId = parseInt(id, 10);
      const updatedData = req.body;
  
      // Verificar que el primer parámetro sea un número y el segundo un objeto JSON
      if (isNaN(pokemonId) || typeof updatedData !== 'object' || Array.isArray(updatedData)) {
        res.status(400).json({ error: 'Parámetros inválidos. El ID debe ser un número y los datos deben ser un objeto JSON.' });
        return;
      }
  
      const isUpdated = await updatePokemon(pokemonId, updatedData);
  
      if (isUpdated) {
        res.status(200).json({ message: 'Pokémon actualizado exitosamente.' });
      } else {
        res.status(404).json({ error: 'No se encontró el Pokémon especificado.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el Pokémon.' });
    }
};

module.exports = {
    getPokemonsHandler,
    getPokemonsIDHandler,
    getPokemonsNameHandler,
    postPokemonsHandler,
    deletePokemonHandler,
    updatePokemonHandler,
    getPokemonsSearchHandler
 }
 