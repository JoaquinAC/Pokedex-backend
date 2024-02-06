const {Router} = require("express");
const {
    getPokemonsHandler,
    getPokemonsIDHandler,
    getPokemonsNameHandler,
    postPokemonsHandler,
    deletePokemonHandler,
    updatePokemonHandler,
} = require("../handlers/pokemonHandler")


const pokemonRouter = Router();

pokemonRouter.get("/main/:page",getPokemonsHandler);

pokemonRouter.get("/:id",getPokemonsIDHandler);

pokemonRouter.get("/",getPokemonsNameHandler);

pokemonRouter.post("/new",postPokemonsHandler);

pokemonRouter.delete("/delete/:id",deletePokemonHandler)

pokemonRouter.put("/put/:id",updatePokemonHandler)


module.exports = pokemonRouter;




