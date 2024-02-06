const { Pokemon , Type} = require("../db");
const axios = require("axios")
const { Op } = require("sequelize")

const getTypesController = async () => {
    try {
      // Buscar todos los nombres de tipos existentes en la base de datos
      const existingTypes = await Type.findAll({ attributes: ['name'] });
  
      // Verificar si existen tipos en la base de datos
      if (existingTypes.length === 0) {
        // Realizar la solicitud HTTP al endpoint de la API de Pokémon para obtener los tipos
        const response = await axios.get('https://pokeapi.co/api/v2/type');
        
        // Obtener los nombres de los tipos desde la respuesta
        const typeNames = response.data.results.map((type) => type.name);
  
        // Crear un nuevo registro en la base de datos para cada tipo
        const createdTypes = await Promise.all(
          typeNames.map((typeName) => Type.create({ name: typeName }))
        );
  
        // Obtener los nombres de los tipos creados
        const createdTypeNames = createdTypes.map((type) => type.name);
  
        // Combinar los tipos existentes y los tipos creados
        const allTypes = [...createdTypeNames];
  
        return allTypes;
      }
  
      // Si existen tipos en la base de datos, retornarlos
      return existingTypes.map((type) => type.name);
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener y guardar los tipos de Pokémon.');
    }
  };


module.exports = {
    getTypesController
}
