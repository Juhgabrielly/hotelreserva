const express = require("express");
const router = express.Router();

const controller = require("../controllers/quarto.controller");

router.get("/", controller.listar);
router.get("/:id", controller.buscar);
router.post("/", controller.cadastrar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

module.exports = router;