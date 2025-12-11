// dashboard-reconhecimento.js
// Reconhecimento Facial: upload de imagem, preview e chamada real ao backend /api/reconhecimento/face

function renderReconhecimentoSection(dashTitle, dashSubtitle, dashHighlight) {
  dashTitle.textContent = "Reconhecimento Facial";
  dashSubtitle.textContent =
    "Envie uma foto e o sistema tenta encontrar correspondências entre os criminosos cadastrados.";

  dashHighlight.innerHTML = `
    <div style="padding: 20px; display: flex; flex-direction: column; gap: 18px;">

      <div style="font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <span>🧠</span>
        <span>Módulo de análise facial</span>
      </div>

      <p style="opacity: .8;">
        Selecione uma imagem clara do rosto. O sistema irá gerar o embedding da imagem
        e comparar com os criminosos cadastrados.
      </p>

      <div
        style="
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: flex-start;
        "
      >
        <!-- Coluna esquerda: upload + ações -->
        <div style="flex: 1 1 260px; min-width: 0;">
          <label
            for="face-file-input"
            style="
              display: block;
              margin-bottom: 10px;
              font-weight: 500;
            "
          >
            Foto para reconhecimento
          </label>

          <input
            id="face-file-input"
            type="file"
            accept="image/*"
            style="
              display: block;
              width: 100%;
              padding: 10px;
              background: #0f172a;
              border-radius: 6px;
              border: 1px solid #334155;
              color: #e2e8f0;
              font-size: 14px;
            "
          />

          <p style="margin-top: 8px; font-size: 13px; opacity: .8;">
            Dica: use uma foto com o rosto frontal e bem iluminado.
          </p>

          <button
            id="face-analyze-btn"
            style="
              margin-top: 14px;
              padding: 10px 20px;
              background: linear-gradient(90deg, #22c55e, #16a34a);
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 15px;
              font-weight: 600;
            "
          >
            Analisar rosto
          </button>

          <div
            id="face-status"
            style="margin-top: 10px; font-size: 14px; opacity: .85;"
          >
            Nenhuma imagem selecionada.
          </div>
        </div>

        <!-- Coluna direita: preview -->
        <div
          style="
            flex: 0 0 220px;
            max-width: 260px;
            background: #020617;
            border-radius: 8px;
            border: 1px solid #1e293b;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          "
        >
          <div style="font-weight: 500; font-size: 14px;">Pré-visualização</div>
          <div
            style="
              width: 100%;
              aspect-ratio: 3 / 4;
              border-radius: 6px;
              border: 1px dashed #334155;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              background: radial-gradient(circle at top, #020617, #020617);
            "
          >
            <img
              id="face-preview"
              src=""
              alt="Pré-visualização do rosto"
              style="max-width: 100%; max-height: 100%; display: none; object-fit: cover;"
            />
            <span
              id="face-placeholder"
              style="font-size: 12px; opacity: .7; text-align: center; padding: 0 10px;"
            >
              Nenhuma imagem carregada.
            </span>
          </div>
        </div>
      </div>

      <!-- Área para exibir resultado do reconhecimento -->
      <div
        id="face-result"
        style="
          margin-top: 10px;
          padding: 14px;
          border-radius: 8px;
          border: 1px solid #1e293b;
          background: #020617;
          font-size: 14px;
          opacity: .9;
        "
      >
        Nenhuma análise realizada ainda.
      </div>
    </div>
  `;

  const fileInput = dashHighlight.querySelector("#face-file-input");
  const previewImg = dashHighlight.querySelector("#face-preview");
  const placeholder = dashHighlight.querySelector("#face-placeholder");
  const statusEl = dashHighlight.querySelector("#face-status");
  const analyzeBtn = dashHighlight.querySelector("#face-analyze-btn");
  const resultEl = dashHighlight.querySelector("#face-result");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) {
      previewImg.style.display = "none";
      placeholder.style.display = "block";
      statusEl.textContent = "Nenhuma imagem selecionada.";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      previewImg.src = reader.result;
      previewImg.style.display = "block";
      placeholder.style.display = "none";
      statusEl.textContent = `Imagem carregada: ${file.name}`;
    };
    reader.readAsDataURL(file);
  });

  async function enviarParaReconhecimento() {
    const file = fileInput.files?.[0];
    if (!file) {
      statusEl.textContent = "Selecione uma imagem antes de analisar.";
      return;
    }

    statusEl.textContent = "Enviando imagem para reconhecimento...";
    resultEl.textContent = "Processando...";

    const formData = new FormData();
    // campo deve ser 'foto', igual ao upload.single("foto") no server.js
    formData.append("foto", file);

    try {
      const resp = await fetch("http://localhost:3000/api/reconhecimento/face", {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        statusEl.textContent = "Erro ao comunicar com o backend.";
        const erroText = await resp.text().catch(() => "");
        resultEl.textContent =
          "Falha na análise. Detalhes (se houver): " + erroText;
        return;
      }

      const data = await resp.json();

      // usamos apenas o MELHOR resultado e só se estiver acima de 89%
      let melhor = data.melhor_match;

      // se por algum motivo melhor_match vier vazio, tenta pegar o primeiro da lista de resultados
      if (!melhor && Array.isArray(data.resultados) && data.resultados.length > 0) {
        melhor = data.resultados[0];
      }

      // limiar mínimo de similaridade (89%)
      const LIMIAR = 0.89;

      // se não tiver melhor match ou similarity abaixo do limiar, considera que NÃO encontrou ninguém
      if (
        !melhor ||
        typeof melhor.similarity !== "number" ||
        melhor.similarity < LIMIAR
      ) {
        statusEl.textContent = "Nenhuma face semelhante encontrada.";
        resultEl.textContent =
          "Nenhum criminoso com similaridade igual ou acima de 89%.";
        return;
      }

      // SE CHEGOU AQUI: há um melhor match acima de 89% → exibe apenas ele
      statusEl.textContent = `Melhor correspondência encontrada: ${
        melhor.nome || "Desconhecido"
      } (${(melhor.similarity * 100).toFixed(1)}% de similaridade).`;

      resultEl.innerHTML = `
        <div
          onclick="window.location.href='resultado.html?id=${melhor.id}'"
          style="
            cursor: pointer;
            display: flex;
            gap: 15px;
            align-items: flex-start;
            background: #020617;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #1e293b;
            margin-bottom: 10px;
            transition: background 0.15s, transform 0.15s, border-color 0.15s;
          "
          onmouseover="this.style.background='#02091f'; this.style.borderColor='#22c55e'; this.style.transform='translateY(-1px)';"
          onmouseout="this.style.background='#020617'; this.style.borderColor='#1e293b'; this.style.transform='translateY(0)';"
        >
          <img
            src="${melhor.imagem_url || ""}"
            alt="${melhor.nome || ""}"
            style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;"
          />
          <div>
            <div style="font-size: 16px; font-weight: 600;">
              ${melhor.nome || "Sem nome"}
            </div>
            <div><strong>Alcunha:</strong> ${melhor.alcunha || "-"}</div>
            <div><strong>Facção:</strong> ${melhor.faccao || "-"}</div>
            <div style="margin-top: 4px;">
              <strong>Similaridade:</strong> ${(melhor.similarity * 100).toFixed(1)}%
            </div>
            <div style="margin-top: 6px; opacity: .9;">
              <strong>Histórico:</strong> ${melhor.historico || "-"}
            </div>
          </div>
        </div>
      `;
    } catch (erro) {
      console.error("Erro na análise facial:", erro);
      statusEl.textContent = "Erro inesperado ao analisar rosto.";
      resultEl.textContent = "Verifique o console do navegador/servidor.";
    }
  }

  analyzeBtn.addEventListener("click", enviarParaReconhecimento);
}
