const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

router.get('/', async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

router.post('/', async (req, res) => {
  const novoUsuario = await Usuario.create(req.body);
  res.json(novoUsuario);
});

module.exports = router;