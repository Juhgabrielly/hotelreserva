const prisma = require("../data/prisma");

const listarReservasPorQuarto = async (req, res) => {
  try {
    const { quartoId } = req.params;

    const reservas = await prisma.reserva.findMany({
      where: {
        quarto_id: Number(quartoId),
      },
      orderBy: {
        data_entrada: "asc",
      },
    });

    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const listar = async (req, res) => {
  try {

    const reservas = await prisma.reserva.findMany({
      include: {
        quarto: true
      }
    });

    res.status(200).json(reservas);

  } catch (error) {

    res.status(500).json({
      erro: error.message
    });

  }
};

const buscar = async (req, res) => {
  try {
    console.log("PARAMS:", req.params);

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        mensagem: "ID não informado.",
      });
    }

    const reserva = await prisma.reserva.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!reserva) {
      return res.status(404).json({
        mensagem: "Reserva não encontrada.",
      });
    }

    res.status(200).json(reserva);
  } catch (error) {
    res.status(500).json({
      erro: error.message,
    });
  }
};
const cadastrar = async (req, res) => {
  try {
    const {
      hospede,
      data_entrada,
      data_saida,
      quarto_id,
    } = req.body;

    if (!hospede || !data_entrada || !data_saida || !quarto_id) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios.",
      });
    }

    if (new Date(data_saida) < new Date(data_entrada)) {
      return res.status(400).json({
        mensagem: "A data de saída não pode ser menor que a data de entrada.",
      });
    }

    const reserva = await prisma.reserva.create({
      data: {
        hospede,
        data_entrada: new Date(data_entrada),
        data_saida: new Date(data_saida),
        quarto_id: Number(quarto_id),
      },
    });

    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      hospede,
      data_entrada,
      data_saida,
      quarto_id,
    } = req.body;

    const reserva = await prisma.reserva.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!reserva) {
      return res.status(404).json({
        mensagem: "Reserva não encontrada.",
      });
    }

    const reservaAtualizada = await prisma.reserva.update({
      where: {
        id: Number(id),
      },
      data: {
        hospede,
        data_entrada: new Date(data_entrada),
        data_saida: new Date(data_saida),
        quarto_id: Number(quarto_id),
      },
    });

    res.status(200).json(reservaAtualizada);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

const excluir = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await prisma.reserva.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!reserva) {
      return res.status(404).json({
        mensagem: "Reserva não encontrada.",
      });
    }

    await prisma.reserva.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      mensagem: "Reserva excluída com sucesso.",
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

module.exports = {
  listarReservasPorQuarto,
  listar,
  buscar,
  cadastrar,
  atualizar,
  excluir,
};