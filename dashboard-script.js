// dashboard-script.js
// Controla o menu hamburger, a navegação e DELEGA o conteúdo das seções
// para outros arquivos JS (dashboard-home.js, dashboard-adicionar.js, etc.)

const hamburgerBtn = document.getElementById("hamburgerBtn");
const sideNav = document.getElementById("sideNav");
const navOverlay = document.getElementById("navOverlay");
const navButtons = document.querySelectorAll(".nav-item-btn");
const dashTitle = document.getElementById("dashTitle");
const dashSubtitle = document.getElementById("dashSubtitle");
const dashHighlight = document.getElementById("dashHighlight");

// Abre/fecha o menu lateral
function toggleMenu(open) {
  const shouldOpen = open ?? !sideNav.classList.contains("open");
  if (shouldOpen) {
    sideNav.classList.add("open");
    navOverlay.classList.add("open");
  } else {
    sideNav.classList.remove("open");
    navOverlay.classList.remove("open");
  }
}

// Função que troca a seção do card central
// e chama a função correta definida em OUTROS ARQUIVOS JS
function changeSection(section) {
  switch (section) {
    case "home":
      if (typeof renderHomeSection === "function") {
        renderHomeSection(dashTitle, dashSubtitle, dashHighlight);
      }
      break;

    case "adicionar":
      if (typeof renderAdicionarSection === "function") {
        renderAdicionarSection(dashTitle, dashSubtitle, dashHighlight);
      }
      break;

    case "consultar":
      if (typeof renderConsultarSection === "function") {
        renderConsultarSection(dashTitle, dashSubtitle, dashHighlight);
      }
      break;

    case "reconhecimento":
      if (typeof renderReconhecimentoSection === "function") {
        renderReconhecimentoSection(dashTitle, dashSubtitle, dashHighlight);
      }
      break;
  }
}

// Eventos do menu hamburger (mobile)
hamburgerBtn.addEventListener("click", () => toggleMenu());
navOverlay.addEventListener("click", () => toggleMenu(false));

// Clique nas opções do menu
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove seleção de todos
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const section = btn.getAttribute("data-section");

    // Fecha menu no mobile
    toggleMenu(false);

    // Delega o conteúdo da seção para as funções externas
    changeSection(section);
  });
});

// Render inicial (garante que a Home use a função externa, se carregada)
changeSection("home");
