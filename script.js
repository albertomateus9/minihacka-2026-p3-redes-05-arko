document.addEventListener("DOMContentLoaded", () => {
  // --- Password Strength Meter ---
  const passwordInput = document.getElementById("password-input");
  const btnTogglePassword = document.getElementById("btn-toggle-password");
  const strengthBar = document.getElementById("strength-bar-fill");
  const strengthText = document.getElementById("strength-text");
  const crackTimeText = document.getElementById("crack-time");

  const chkLength = document.getElementById("chk-length");
  const chkUpper = document.getElementById("chk-upper");
  const chkLower = document.getElementById("chk-lower");
  const chkNumber = document.getElementById("chk-number");
  const chkSpecial = document.getElementById("chk-special");

  // Show/Hide Password Toggle
  if (btnTogglePassword && passwordInput) {
    btnTogglePassword.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        btnTogglePassword.textContent = "🙈";
      } else {
        passwordInput.type = "password";
        btnTogglePassword.textContent = "👁️";
      }
    });
  }

  // Password Analysis Function
  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      const val = passwordInput.value;
      if (!val) {
        resetPasswordMetrics();
        return;
      }

      // Check conditions
      const hasLength = val.length >= 8;
      const hasUpper = /[A-Z]/.test(val);
      const hasLower = /[a-z]/.test(val);
      const hasNumber = /[0-9]/.test(val);
      const hasSpecial = /[^A-Za-z0-9]/.test(val);

      // Toggle checkbox classes
      updateCheck(chkLength, hasLength);
      updateCheck(chkUpper, hasUpper);
      updateCheck(chkLower, hasLower);
      updateCheck(chkNumber, hasNumber);
      updateCheck(chkSpecial, hasSpecial);

      // Calculate score
      let score = 0;
      if (hasLength) score++;
      if (hasUpper) score++;
      if (hasLower) score++;
      if (hasNumber) score++;
      if (hasSpecial) score++;

      // Length bonus
      if (val.length >= 14 && score > 0) score++;

      // Update progress bar
      let pct = (score / 6) * 100;
      strengthBar.style.width = `${pct}%`;

      // Update labels based on score
      if (score <= 1) {
        strengthBar.className = "strength-bar bar-weak";
        strengthText.textContent = "Trivial (Fraca)";
        strengthText.className = "status-weak";
        crackTimeText.textContent = "Alguns segundos / Imediato";
      } else if (score <= 3) {
        strengthBar.className = "strength-bar bar-medium";
        strengthText.textContent = "Média";
        strengthText.className = "status-medium";
        crackTimeText.textContent = "Alguns minutos a horas";
      } else if (score <= 5) {
        strengthBar.className = "strength-bar bar-strong";
        strengthText.textContent = "Forte";
        strengthText.className = "status-strong";
        crackTimeText.textContent = "Vários meses";
      } else {
        strengthBar.className = "strength-bar bar-ultimate";
        strengthText.textContent = "Altamente Segura!";
        strengthText.className = "status-ultimate";
        crackTimeText.textContent = "Séculos de processamento";
      }
    });
  }

  function updateCheck(element, isPassed) {
    if (!element) return;
    if (isPassed) {
      element.className = "success";
    } else {
      element.className = "fail";
    }
  }

  function resetPasswordMetrics() {
    strengthBar.style.width = "0%";
    strengthBar.className = "strength-bar";
    strengthText.textContent = "Nula";
    strengthText.className = "status-weak";
    crackTimeText.textContent = "Imediato";

    updateCheck(chkLength, false);
    updateCheck(chkUpper, false);
    updateCheck(chkLower, false);
    updateCheck(chkNumber, false);
    updateCheck(chkSpecial, false);
  }

  // --- Phishing Simulator ---
  const suspectTargets = document.querySelectorAll(".suspect-target");
  const analysisInstruction = document.getElementById("analysis-instruction");
  const activeTipCard = document.getElementById("active-tip-card");
  const tipTitle = document.getElementById("tip-title");
  const tipDesc = document.getElementById("tip-desc");
  const btnRevealAll = document.getElementById("btn-reveal-all");

  suspectTargets.forEach(target => {
    target.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Highlight selection
      suspectTargets.forEach(t => t.classList.remove("active-highlight"));
      target.classList.add("active-highlight");
      
      // Show description card
      if (analysisInstruction) analysisInstruction.style.display = "none";
      if (activeTipCard) activeTipCard.style.display = "block";
      
      const tipText = target.getAttribute("data-tip");
      const cleanTitle = getCleanTitle(target);
      
      if (tipTitle) tipTitle.textContent = cleanTitle;
      if (tipDesc) tipDesc.textContent = tipText;
    });
  });

  function getCleanTitle(element) {
    if (element.classList.contains("email-value")) {
      if (element.textContent.includes("suporte@")) return "Remetente Falso";
      return "Assunto Alarmista";
    }
    return "Link Externo Malicioso";
  }

  if (btnRevealAll) {
    btnRevealAll.addEventListener("click", () => {
      suspectTargets.forEach(target => {
        target.classList.add("revealed-danger");
      });
      
      if (analysisInstruction) {
        analysisInstruction.innerHTML = "🔍 <strong>3 Pontos Críticos Revelados!</strong> Desconfie sempre de links com senhas urgentes, remetentes estranhos e erros de escrita.";
        analysisInstruction.style.display = "block";
      }
      if (activeTipCard) activeTipCard.style.display = "none";
    });
  }
});
