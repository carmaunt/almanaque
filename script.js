// script.js
// Lida com o formulário de login e autenticação no Firebase

import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Referências de elementos
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const feedbackEl = document.getElementById("feedback");
const successEl = document.getElementById("success");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  feedbackEl.textContent = "";
  successEl.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    feedbackEl.textContent = "Preencha login e senha para continuar.";
    return;
  }

  // Estado de carregamento
  loginButton.disabled = true;
  const originalText = loginButton.textContent;
  loginButton.textContent = "Validando...";

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Sucesso
    successEl.textContent = "Login realizado com sucesso. Redirecionando...";
    feedbackEl.textContent = "";

    // Exemplo de redirecionamento após login
    // Substitua '/dashboard.html' pela rota real da sua aplicação
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  } catch (error) {
    console.error(error);
    // Mensagens amigáveis, sem expor detalhes técnicos
    switch (error.code) {
      case "auth/invalid-email":
        feedbackEl.textContent = "E-mail inválido. Verifique o formato.";
        break;
      case "auth/user-disabled":
        feedbackEl.textContent = "Usuário desativado. Contate o suporte.";
        break;
      case "auth/user-not-found":
      case "auth/wrong-password":
        feedbackEl.textContent = "Login ou senha incorretos.";
        break;
      default:
        feedbackEl.textContent = "Não foi possível entrar. Tente novamente.";
    }
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = originalText;
  }
});
