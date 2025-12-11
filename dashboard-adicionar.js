// dashboard-adicionar.js
// Define a estrutura da seção "Adicionar" do dashboard
// Integra com o backend Node + Supabase + Flask (reconhecimento facial)
const BACKEND_CADASTRO_URL = "http://localhost:3000/api/criminosos";

function renderAdicionarSection(dashTitle, dashSubtitle, dashHighlight) {
  dashTitle.textContent = "Adicionar";
  dashSubtitle.textContent =
    "Cadastre novos registros de criminosos de forma organizada e segura.";

  dashHighlight.innerHTML = `
    <div class="dash-highlight-title">
      <span class="icon">➕</span>
      <span>Novo cadastro de criminoso</span>
    </div>

    <form id="formAdicionarCriminoso" onsubmit="return false;">
      <!-- FOTO -->
      <div class="field">
        <label for="fotoCriminoso">Foto do criminoso</label>
        <div class="input-wrapper">
          <input
            id="fotoCriminoso"
            type="file"
            accept="image/*"
          />
        </div>
        <p class="hint">Selecione uma foto nítida, de preferência com o rosto frontal.</p>
      </div>

      <!-- NOME -->
      <div class="field">
        <label for="nomeCriminoso">Nome</label>
        <div class="input-wrapper">
          <input
            id="nomeCriminoso"
            type="text"
            placeholder="Nome completo"
            autocomplete="off"
          />
        </div>
      </div>

      <!-- ALCUNHA -->
      <div class="field">
        <label for="alcunhaCriminoso">Alcunha</label>
        <div class="input-wrapper">
          <input
            id="alcunhaCriminoso"
            type="text"
            placeholder="Vulgo / apelido"
            autocomplete="off"
          />
        </div>
      </div>

      <!-- LOCALIDADE -->
      <div class="field">
        <label for="localidadeCriminoso">Localidade</label>
        <div class="input-wrapper">
          <input
            id="localidadeCriminoso"
            type="text"
            placeholder="Bairro, comunidade, cidade ou área de atuação"
            autocomplete="off"
          />
        </div>
      </div>

      <!-- FACÇÃO (SELECT) -->
      <div class="field">
        <label for="faccaoCriminoso">Facção</label>
        <div class="input-wrapper">
          <select
            id="faccaoCriminoso"
            style="
              width: 100%;
              background: transparent;
              border: none;
              outline: none;
              color: #e5e7eb;
              font-size: 14px;
            "
          >
            <option value="">Selecione a facção (se houver)</option>
            <option value="BDM">BDM</option>
            <option value="CV">CV</option>
            <option value="KLV">KLV</option>
            <option value="MK">MK</option>
            <option value="PCC">PCC</option>
            <option value="TROPA DO A">TROPA DO A</option>
            <option value="BDA">BDA</option>
            <option value="KATIARA">KATIARA</option>
            <option value="OUTROS">OUTROS</option>
          </select>
        </div>
      </div>

      <!-- HISTÓRICO -->
      <div class="field">
        <label for="historicoCriminoso">Histórico</label>
        <div class="input-wrapper">
          <textarea
            id="historicoCriminoso"
            rows="3"
            placeholder="Descreva o histórico, ocorrências, mandados, etc."
            style="width: 100%; background: transparent; border: none; outline: none; color: #e5e7eb; font-size: 14px; resize: vertical;"
          ></textarea>
        </div>
      </div>

      <!-- MENSAGEM DE FEEDBACK -->
      <div id="adicionarMensagem" class="hint" style="margin-top: 8px;"></div>

      <!-- BOTÃO ADICIONAR -->
      <div class="actions" style="margin-top: 18px;">
        <button type="submit" id="btnAdicionarCriminoso">Adicionar</button>
      </div>
    </form>
  `;

  // Referências aos elementos do formulário
  const form = document.getElementById("formAdicionarCriminoso");
  const inputFoto = document.getElementById("fotoCriminoso");
  const inputNome = document.getElementById("nomeCriminoso");
  const inputAlcunha = document.getElementById("alcunhaCriminoso");
  const inputLocalidade = document.getElementById("localidadeCriminoso");
  const inputFaccao = document.getElementById("faccaoCriminoso");
  const inputHistorico = document.getElementById("historicoCriminoso");
  const btnAdicionar = document.getElementById("btnAdicionarCriminoso");
  const mensagemEl = document.getElementById("adicionarMensagem");

  // Handler de envio: manda tudo para o backend via multipart/form-data
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    mensagemEl.classList.remove("error-message", "success-message");
    mensagemEl.textContent = "";

    const fotoFile = inputFoto.files[0];
    const nome = inputNome.value.trim();
    const alcunha = inputAlcunha.value.trim();
    const localidade = inputLocalidade.value.trim();
    const faccao = inputFaccao.value;
    const historico = inputHistorico.value.trim();

    if (!nome) {
      mensagemEl.textContent = "Informe o nome do criminoso.";
      mensagemEl.classList.add("error-message");
      return;
    }

    const formData = new FormData();
    if (fotoFile) {
      formData.append("foto", fotoFile); // só envia se tiver foto
    }
    formData.append("nome", nome);
    formData.append("alcunha", alcunha);
    formData.append("localidade", localidade);
    formData.append("faccao", faccao);
    formData.append("historico", historico);

    const originalText = btnAdicionar.textContent;
    btnAdicionar.disabled = true;
    btnAdicionar.textContent = "Enviando...";

    try {
      const response = await fetch(BACKEND_CADASTRO_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || data.sucesso !== true) {
        throw new Error(
          data?.erro || `Falha ao cadastrar (HTTP ${response.status})`
        );
      }

      mensagemEl.textContent = "Cadastro realizado com sucesso.";
      mensagemEl.classList.add("success-message");
      form.reset();
    } catch (error) {
      console.error("Erro ao cadastrar criminoso:", error);
      mensagemEl.textContent =
        "Não foi possível salvar o cadastro. Tente novamente.";
      mensagemEl.classList.add("error-message");
    } finally {
      btnAdicionar.disabled = false;
      btnAdicionar.textContent = originalText;
    }
  });
}
