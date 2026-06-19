const api = "http://localhost:3000";

const listaQuartos = document.getElementById("listaQuartos");

const overlay = document.getElementById("overlay");
const btnConfirmarExcluir = document.getElementById("btnConfirmarExcluir");

let idExcluir = null;

async function carregarQuartos() {
  try {
    const resposta = await fetch(`${api}/quarto`);
    const quartos = await resposta.json();
    listaQuartos.innerHTML = "";
    quartos.forEach((quarto) => {
      listaQuartos.innerHTML += `
        <tr>
          <td>${quarto.numero}</td>
          <td>${quarto.tipo}</td>

          <td>
            <a
              href="reservas.html?id=${quarto.id}"
              class="btn-ver">
              Ver Reservas
            </a>

            <button
              class="btn-delete"
              onclick="abrirModal(${quarto.id})">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });
  } catch (erro) {
    console.error("Erro ao carregar quartos:", erro);
  }
}

function abrirModal(id) {
  idExcluir = id;
  overlay.style.display = "flex";
}

function fecharModal() {
  overlay.style.display = "none";
  idExcluir = null;
}

if (btnConfirmarExcluir) {
  btnConfirmarExcluir.addEventListener("click", async () => {

    if (!idExcluir) return;

    try {

      const resposta = await fetch(
        `${api}/quarto/${idExcluir}`,
        {
          method: "DELETE",
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao excluir quarto");
      }

      fecharModal();
      carregarQuartos();

    } catch (erro) {

      console.error("Erro ao excluir:", erro);
      alert("Erro ao excluir quarto.");

    }

  });
}

if (overlay) {
  overlay.addEventListener("click", (e) => {

    if (e.target === overlay) {
      fecharModal();
    }

  });
}

if (listaQuartos) {
  carregarQuartos();
}

const listaReservas = document.getElementById("listaReservas");
const infoQuarto = document.getElementById("infoQuarto");
const btnNovaReserva = document.getElementById("btnNovaReserva");

const params = new URLSearchParams(window.location.search);
const quartoId = params.get("id");

if (btnNovaReserva && quartoId) {
  btnNovaReserva.href =
    `cadastro-reserva.html?quarto=${quartoId}`;
}

async function carregarQuarto() {
  if (!quartoId) return;
  try {
    const resposta = await fetch(
      `${api}/quarto/${quartoId}`
    );

    const quarto = await resposta.json();

    if (infoQuarto) {
      infoQuarto.innerHTML = `
        <div class="card">
          <h2>Quarto ${quarto.numero}</h2>
          <p>Tipo: ${quarto.tipo}</p>
        </div>
      `;
    }

  } catch (erro) {
    console.error("Erro ao carregar quarto:", erro);
  }
}

async function carregarReservas() {
  if (!quartoId) return;
  try {
    const resposta = await fetch(
      `${api}/reserva/quarto/${quartoId}`
    );

    const reservas = await resposta.json();

    console.log("Reservas recebidas:", reservas);
    listaReservas.innerHTML = "";
    if (reservas.length === 0) {
      listaReservas.innerHTML = `
        <tr>
          <td colspan="5">
            Nenhuma reserva encontrada.
          </td>
        </tr>
      `;

      return;
    }

    reservas.forEach((reserva) => {

      const entrada =
        new Date(reserva.data_entrada)
          .toLocaleDateString("pt-BR");

      const saida =
        new Date(reserva.data_saida)
          .toLocaleDateString("pt-BR");

      listaReservas.innerHTML += `
        <tr>
          <td>${reserva.id}</td>
          <td>${reserva.hospede}</td>
          <td>${entrada}</td>
          <td>${saida}</td>

          <td>
            <button
              class="btn-delete"
              onclick="excluirReserva(${reserva.id})">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });

  } catch (erro) {

    console.error("Erro ao carregar reservas:", erro);

  }
}

async function excluirReserva(id) {

  const confirmar =
    confirm("Deseja excluir esta reserva?");

  if (!confirmar) return;

  try {

    await fetch(
      `${api}/reserva/${id}`,
      {
        method: "DELETE",
      }
    );

    carregarReservas();

  } catch (erro) {

    console.error("Erro ao excluir reserva:", erro);

  }
}

if (listaReservas) {
  carregarQuarto();
  carregarReservas();
}