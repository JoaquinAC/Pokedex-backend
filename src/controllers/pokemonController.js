const { Pokemon , Type} = require("../db");
const axios = require("axios")


//POST /pokemons
const createPokemon = async (name, image, hp, attack, defense, speed, height, weight, types) => {
    const hpInt = typeof hp === 'string' ? parseInt(hp, 10) : hp;
    const attackInt = typeof attack === 'string' ? parseInt(attack, 10) : attack;
    const defenseInt = typeof defense === 'string' ? parseInt(defense, 10) : defense;
    const speedInt = typeof speed === 'string' ? parseInt(speed, 10) : speed;
    const heightInt = typeof height === 'string' ? parseInt(height, 10) : height;
    const weightInt = typeof weight === 'string' ? parseInt(weight, 10) : weight;
  
    const lowerCaseTypes = types.map((type) => type.toLowerCase());

    const newPokemon = await Pokemon.create({
      name,
      image,
      hp: hpInt,
      attack: attackInt,
      defense: defenseInt,
      speed: speedInt,
      height: heightInt,
      weight: weightInt,
    });
  
    const foundTypes = await Type.findAll({ where: { name: lowerCaseTypes } });
  
    if (foundTypes.length !== types.length) {
      throw new Error('No se encontraron todos los tipos especificados.');
    }
  
    await newPokemon.setTypes(foundTypes);
  
    return newPokemon;
  };

// GET | /pokemons/:idPokemon
const getPokemonDetailAPI = async (id) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);

      const { name, sprites, stats, types } = response.data;
  
      const typeNames = types.map((type) => type.type.name);
  
      const formattedStats = stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat
      }));


      const pokemonDetail = {
        id,
        name,
        image: sprites.front_default,
        stats: formattedStats,
        types: typeNames,
        origen: 'API'
      };
  
      return pokemonDetail;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el detalle del Pokémon.');
    }
};

const getPokemonDetailBD = async (id) => {
    try {
      const pokemon = await Pokemon.findByPk(id, {
        include: [Type] 
      });
  
      if (!pokemon) {
        return undefined
      }
      const typeNames = pokemon.Types.map((type) => type.name);
      const pokemonDetail = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        speed: pokemon.speed,
        height: pokemon.height,
        weight: pokemon.weight,
        types: typeNames,
        origen: 'BD',
      };
  
      return pokemonDetail;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el detalle del Pokémon desde la base de datos.');
    }
  };

const getPokemonDetailID = async (id) => {
    try {
      const apiResult = await getPokemonDetailAPI(id); 
      const dbResult = await getPokemonDetailBD(id); 
      
      let result = [];

      if (apiResult) {
        result.push(apiResult);
      }
  
      if (dbResult) {
        result.push(dbResult);
      }

      return result
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el detalle del Pokémon.');
    }
};
  
//  GET | /pokemons/name?="..."
  
const getPokemonDetailByNameAPI = async (name) => {
  try {
    const formattedName = name.toLowerCase();

    // Realizar la solicitud HTTP al endpoint de la API de Pokémon
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${formattedName}`);

    // Obtener los datos del Pokémon y sus tipos del cuerpo de la respuesta
    const { id, name: pokemonName, sprites, stats, types } = response.data;

    // Obtener los nombres de los tipos de Pokémon
    const typeNames = types.map((type) => type.type.name);

    const formattedStats = stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat
    }));

    const pokemonDetail = {
      id,
      name: pokemonName,
      image: sprites.front_default,
      stats: formattedStats,
      types: typeNames,
      origen: 'API'
    };

    return pokemonDetail;
  } catch (error) {
    // Verificar si el error es debido a que el Pokémon no fue encontrado en la API (código de estado 404)
    if (error.response && error.response.status === 404) {
      return null; // Retornar nulo para indicar que el Pokémon no se encontró en la API
    }

    console.error(error);
    throw new Error('Error al obtener el detalle del Pokémon desde la API.');
  }
};
  
const getPokemonDetailByNameBD = async (name) => {
    try {
      const lowercaseName = name.toLowerCase();
  
      const pokemon = await Pokemon.findOne({
        where: { name: lowercaseName },
        include: [Type] 
      });

      if (!pokemon) {
        return undefined
      }
  
      const typeNames = pokemon.Types.map((type) => type.name);
  
      const pokemonDetail = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        speed: pokemon.speed,
        height: pokemon.height,
        weight: pokemon.weight,
        types: typeNames,
        origen: 'BD',
      };
  
      return pokemonDetail;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el detalle del Pokémon desde la base de datos.');
    }
};

const getPokemonDetailName = async (name) => {
    try {
      const apiResult = await getPokemonDetailByNameAPI(name); 
      const dbResult = await getPokemonDetailByNameBD(name); 
      const result = [apiResult, dbResult]; 
  
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el detalle del Pokémon.');
    }
};

//GET | /pokemons

const getAllPokemonsAPI = async (page, pageSize) => {
  try {
    const pokemons = [];
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    
    const allPokemonsBD = await Pokemon.findAll({
      include: [Type] 
    });
    const allPokemonsMapped = allPokemonsBD.map((pokemon) => {
      const typeNames = pokemon.Types.map((type) => type.name);

      return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        speed: pokemon.speed,
        height: pokemon.height,
        weight: pokemon.weight,
        types: typeNames,
        origen: 'BD',
      };
    });

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const { results } = response.data;

    const pokemonDetailsPromises = results.map(async (pokemon) => {
      const pokemonDetail = await getPokemonDetailByNameAPI(pokemon.name);
      return {
        ...pokemonDetail,
        origen: 'API',
      };
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    const mergedPokemons = [...allPokemonsMapped, ...pokemonDetails];

    pokemons.push(...mergedPokemons);

    return pokemons;
    
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener la lista de Pokémon desde la API.');
  }
};

// DELETE /pokemons/:id
const deletePokemon = async (id) => {
    try {
      const pokemon = await Pokemon.findByPk(id);
  
      if (!pokemon) {
        throw new Error('No se encontró el Pokémon especificado.');
      }
      await pokemon.setTypes([]);
      await pokemon.destroy();
      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Error al eliminar el Pokémon de la base de datos.');
    }
  };


//PUT /pokemons/:id

// const updatedData = {
//   name: 'Nuevo Nombre',
//   level: 50,
//   types: ['Agua', 'Volador'] // Arreglo de tipos a asignar al Pokémon
// };


const updatePokemon = async (pokemonId, updatedData) => {
  try {
    const pokemon = await Pokemon.findByPk(pokemonId, {
      include: [Type] 
    });

    if (!pokemon) {
      throw new Error('No se encontró el Pokémon especificado.');
    }
    await pokemon.update(updatedData);

    // Si se proporcionaron tipos, actualizar la relación "muchos a muchos"
    if (updatedData.types) {
      // Obtener los IDs de los tipos proporcionados
      const typeIds = await Promise.all(
        updatedData.types.map(async (typeName) => {
          const type = await Type.findOne({ where: { name: typeName } });
          if (!type) {
            throw new Error(`No se encontró el tipo ${typeName}.`);
          }
          return type.id;
        })
      );

      // Actualizar la relación "muchos a muchos" entre Pokémon y tipos
      await pokemon.setTypes(typeIds);
    }

    const types = await pokemon.getTypes();
    const updatedTypeNames = types.map((type) => type.name);

    const updatedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      speed: pokemon.speed,
      height: pokemon.height,
      weight: pokemon.weight,
      types: updatedTypeNames
    };

    return updatedPokemon;
  } catch (error) {
    console.error(error);
    throw new Error('Error al actualizar el Pokémon en la base de datos.');
  }
};


  module.exports = {
    createPokemon,
    getPokemonDetailID,
    getPokemonDetailName,
    getAllPokemonsAPI,
    deletePokemon,
    updatePokemon
};