// dashboard-home.js
// Define o conteúdo da seção "Home" do dashboard
// Mostra os 5 últimos criminosos cadastrados em formato de "feed"

const HOME_API_URL = "http://localhost:3000/api/criminosos";
const HOME_AVATAR_PADRAO = "assets/avatar-default.png"; // mesmo avatar padrão do resultado.html

function renderHomeSection(dashTitle, dashSubtitle, dashHighlight) {
  dashTitle.textContent = "Home";
  dashSubtitle.textContent =
    "Visão geral do seu ambiente. Veja os últimos registros cadastrados e navegue para mais detalhes.";

  // Estrutura base do bloco da Home
  dashHighlight.innerHTML = `
    <div class="dash-highlight-title" style="margin-bottom: 12px;">
      <span class="icon">📲</span>
      <span>Últimos registros (feed)</span>
    </div>

    <p style="margin-bottom: 12px; opacity: .85;">
      Visualize rapidamente os últimos criminosos adicionados ao sistema.
      Toque em um card para ver o registro completo.
    </p>

    <div id="home-feed-status" style="font-size: 13px; opacity: .8; margin-bottom: 10px;">
      Carregando últimos registros...
    </div>

    <div id="home-feed-list">
      <!-- cards do feed serão inseridos aqui -->
    </div>
  `;

  const statusEl = dashHighlight.querySelector("#home-feed-status");
  const feedEl = dashHighlight.querySelector("#home-feed-list");

  function resumirHistorico(texto, limite = 120) {
    if (!texto || !texto.trim()) {
      return "Sem histórico cadastrado.";
    }
    const t = texto.trim();
    if (t.length <= limite) return t;
    return t.slice(0, limite).trim() + "...";
  }

  async function carregarUltimos() {
    try {
      const resp = await fetch(HOME_API_URL);

      if (!resp.ok) {
        statusEl.textContent = "Erro ao carregar registros. Verifique o backend.";
        return;
      }

      const dados = await resp.json();

      if (!Array.isArray(dados) || dados.length === 0) {
        statusEl.textContent = "Nenhum registro encontrado.";
        return;
      }

      // pega só os 5 primeiros (a API já retorna ordenado por criado_em desc)
      const ultimos = dados.slice(0, 5);
      statusEl.textContent = `Mostrando os ${ultimos.length} últimos registros.`;
      feedEl.innerHTML = "";

      ultimos.forEach((item) => {
        const imgSrc = item.imagem_url || HOME_AVATAR_PADRAO;
        const vulgo = item.alcunha || "Sem alcunha";
        const historicoResumo = resumirHistorico(item.historico, 120);

        const card = document.createElement("div");
        card.style.cursor = "pointer";
        card.style.background = "#020617";
        card.style.border = "1px solid #1e293b";
        card.style.borderRadius = "14px";
        card.style.overflow = "hidden";
        card.style.marginBottom = "14px";
        card.style.boxShadow = "0 14px 30px rgba(15,23,42,0.6)";
        card.style.transition = "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease";

        card.onmouseover = () => {
          card.style.transform = "translateY(-2px)";
          card.style.boxShadow = "0 18px 40px rgba(15,23,42,0.8)";
          card.style.borderColor = "#2563eb";
        };
        card.onmouseout = () => {
          card.style.transform = "translateY(0)";
          card.style.boxShadow = "0 14px 30px rgba(15,23,42,0.6)";
          card.style.borderColor = "#1e293b";
        };

        card.onclick = () => {
          window.location.href = `resultado.html?id=${item.id}`;
        };

        card.innerHTML = `
          <!-- topo estilo "Instagram" com foto em destaque -->
          <div style="width: 100%; aspect-ratio: 4 / 5; background:#020617; overflow:hidden;">
            <img
              src="${imgSrc}"
              alt="${item.nome || vulgo}"
              style="width:100%; height:100%; object-fit:cover; display:block;"
            />
          </div>

          <!-- corpo do card -->
          <div style="padding: 10px 12px 12px 12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <div style="font-size: 15px; font-weight:600;">
                ${vulgo}
              </div>
              <div style="font-size:11px; opacity:.7; text-transform:uppercase; letter-spacing:.04em;">
                ${item.faccao || ""}
              </div>
            </div>

            <div style="font-size:13px; opacity:.9; margin-bottom:4px;">
              <strong>${item.nome || "Nome não informado"}</strong>
            </div>

            <div style="font-size:13px; opacity:.85; line-height:1.35;">
              ${historicoResumo}
            </div>
          </div>
        `;

        feedEl.appendChild(card);
      });
    } catch (e) {
      console.error(e);
      statusEl.textContent = "Erro inesperado ao carregar os registros.";
    }
  }

  carregarUltimos();
}
