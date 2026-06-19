const prisma = require("../data/prisma");

const listar = async (req, res) => {
  try {
    const quartos = await prisma.quarto.findMany({
      orderBy: {
        numero: "asc",
      },
    });

    res.status(200).json(quartos);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
};

const buscar = async (req, res) => {
  try {
    const { id } = req.params;

    const quarto = await prisma.quarto.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!quarto) {
      return res.status(404).json({
        mensagem: "Quarto não encontrado.",
      });
    }

    res.status(200).json(quarto);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
};

const cadastrar = async (req, res) => {
  try {
    const { numero, tipo } = req.body;

    if (!numero || !tipo) {
      return res.status(400).json({
        mensagem: "Número e tipo são obrigatórios.",
      });
    }

    const quartoExistente = await prisma.quarto.findFirst({
      where: {
        numero,
      },
    });

    if (quartoExistente) {
      return res.status(400).json({
        mensagem: "Já existe um quarto com esse número.",
      });
    }

    const quarto = await prisma.quarto.create({
      data: {
        numero,
        tipo,
      },
    });

    res.status(201).json(quarto);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero, tipo } = req.body;

    const quarto = await prisma.quarto.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!quarto) {
      return res.status(404).json({
        mensagem: "Quarto não encontrado.",
      });
    }

    if (!numero || !tipo) {
      return res.status(400).json({
        mensagem: "Número e tipo são obrigatórios.",
      });
    }

    const quartoExistente = await prisma.quarto.findFirst({
      where: {
        numero,
        NOT: {
          id: Number(id),
        },
      },
    });

    if (quartoExistente) {
      return res.status(400).json({
        mensagem: "Já existe um quarto com esse número.",
      });
    }

    const quartoAtualizado = await prisma.quarto.update({
      where: {
        id: Number(id),
      },
      data: {
        numero,
        tipo,
      },
    });

    res.status(200).json(quartoAtualizado);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
};

const excluir = async (req, res) => {
  try {
    const { id } = req.params;

    const quarto = await prisma.quarto.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!quarto) {
      return res.status(404).json({
        mensagem: "Quarto não encontrado.",
      });
    }

    await prisma.quarto.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      mensagem: "Quarto excluído com sucesso.",
    });
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
};

module.exports = {
  listar,
  buscar,
  cadastrar,
  atualizar,
  excluir,
};