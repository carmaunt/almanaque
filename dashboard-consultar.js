// dashboard-consultar.js
// Seção "Consultar" integrada com a rota GET /api/criminosos/consulta do backend

function renderConsultarSection(dashTitle, dashSubtitle, dashHighlight) {
  dashTitle.textContent = "Consultar";
  dashSubtitle.textContent =
    "Pesquise rapidamente em todos os registros cadastrados.";

  dashHighlight.innerHTML = `
    <div style="padding: 20px;">

      <div style="font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <span>🔍</span> <span>Busca rápida</span>
      </div>

      <p style="margin: 8px 0 18px 0; opacity: .8;">
        Digite qualquer nome, alcunha, facção ou palavra do histórico e clique em Buscar.
      </p>

      <!-- LINHA DO INPUT + BOTÃO COM FLEX-WRAP PARA NÃO ESCAPAR EM TELAS PEQUENAS -->
      <div
        style="
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: stretch;
          margin-bottom: 10px;
          max-width: 100%;
        "
      >
        <input
          id="consulta-termo"
          type="text"
          placeholder="Ex.: João, Cabeça, Comando X, assalto..."
          style="
            flex: 1 1 0;
            min-width: 0;
            padding: 12px 14px;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 6px;
            color: #e2e8f0;
            font-size: 15px;
            outline: none;
            transition: 0.2s;
          "
        />

        <button
          id="consulta-btn"
          style="
            flex: 0 0 auto;
            padding: 12px 22px;
            background: linear-gradient(90deg, #2563eb, #1d4ed8);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            transition: 0.2s;
          "
        >
          Buscar
        </button>
      </div>

      <div id="consulta-status" style="margin-top: 10px; opacity: .8;">
        Digite um termo de busca e clique em Buscar.
      </div>

      <div id="consulta-resultados" style="margin-top: 20px;">
        <!-- resultados aparecem aqui -->
      </div>

    </div>
  `;

  const termoInput = dashHighlight.querySelector("#consulta-termo");
  const btnBuscar = dashHighlight.querySelector("#consulta-btn");
  const statusEl = dashHighlight.querySelector("#consulta-status");
  const resultadosEl = dashHighlight.querySelector("#consulta-resultados");

  async function executarBusca() {
    const termo = termoInput.value.trim();

    if (!termo) {
      statusEl.textContent = "Digite algo para buscar.";
      resultadosEl.innerHTML = "";
      return;
    }

    statusEl.textContent = "Buscando...";
    resultadosEl.innerHTML = "";

    try {
      const resp = await fetch(
        `http://localhost:3000/api/criminosos/consulta?q=${encodeURIComponent(
          termo
        )}`
      );

      if (!resp.ok) {
        statusEl.textContent = "Erro ao consultar. Verifique o backend.";
        return;
      }

      const dados = await resp.json();

      if (!dados || dados.length === 0) {
        statusEl.textContent = "Nenhum registro encontrado.";
        return;
      }

      statusEl.textContent = `Encontrados ${dados.length} registro(s).`;

      resultadosEl.innerHTML = "";

      dados.forEach((item) => {
        // resumo do histórico com no máximo 55 caracteres
        const resumoHistorico = item.historico
          ? item.historico.length > 55
            ? item.historico.substring(0, 55) + "..."
            : item.historico
          : "-";

        // se não tiver imagem, usa avatar padrão
        const avatar =
          item.imagem_url && item.imagem_url.trim()
            ? item.imagem_url
            : "assets/avatar-default.png";

        const cardHtml = `
          <div
            onclick="window.location.href='resultado.html?id=${item.id}'"
            style="
              cursor: pointer;
              display: flex;
              gap: 15px;
              align-items: flex-start;
              background: #0f172a;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #1e293b;
              margin-bottom: 12px;
              transition: background 0.15s, transform 0.15s, border-color 0.15s;
            "
            onmouseover="this.style.background='#020617'; this.style.borderColor='#2563eb'; this.style.transform='translateY(-1px)';"
            onmouseout="this.style.background='#0f172a'; this.style.borderColor='#1e293b'; this.style.transform='translateY(0)';"
          >
            <img src="${avatar}" alt="${item.nome}" style="width: 90px; height: 90px; object-fit: cover; border-radius: 6px;"/>

            <div>
              <div style="font-size: 18px; font-weight: 600;">${item.nome}</div>
              <div><strong>Alcunha:</strong> ${item.alcunha || "-"}</div>
              <div><strong>Facção:</strong> ${item.faccao || "-"}</div>
              <div style="margin-top: 6px; opacity: .9;">
                <strong>Histórico:</strong> ${resumoHistorico}
              </div>
            </div>
          </div>
        `;

        resultadosEl.innerHTML += cardHtml;
      });
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Erro inesperado ao consultar.";
    }
  }

  btnBuscar.addEventListener("click", executarBusca);
  termoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") executarBusca();
  });
}
