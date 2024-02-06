const {Router} = require("express");

const {
    getTypesHandler,
} = require("../handlers/typesHandler")

const typeRouter = Router();

typeRouter.get("/",getTypesHandler);

module.exports= typeRouter;