/* =========================================
   AUTH PAGE — LOGIN / REGISTER LOGIC
   Layout: Split-screen
   ========================================= */

(function () {
  "use strict";

  /* -------------------------------------------------------
     ELEMENTS
  ------------------------------------------------------- */
  const tabLogin       = document.getElementById("tab-login");
  const tabRegister    = document.getElementById("tab-register");
  const tabIndicator   = document.getElementById("auth-tab-indicator");
  const formLogin      = document.getElementById("form-login");
  const formRegister   = document.getElementById("form-register");
  const switchToReg    = document.getElementById("switch-to-register");
  const switchToLog    = document.getElementById("switch-to-login");
  const scrollArea     = document.querySelector(".auth-panel-right__scroll");

  // Left panel
  const panelTagline   = document.getElementById("panel-tagline");
  const dots           = document.querySelectorAll(".auth-dot");

  // Toast
  const toast          = document.getElementById("auth-toast");
  const toastMsg       = document.getElementById("auth-toast-msg");
  const toastIcon      = toast.querySelector(".auth-toast__icon");
  let toastTimer       = null;

  /* -------------------------------------------------------
     LEFT PANEL CONTENT per tab
  ------------------------------------------------------- */
  const panelContent = {
    login: {
      tagline: "Chào mừng trở lại!",
      sub:     "Đăng nhập để tiếp tục hành trình ẩm thực của bạn.",
      dotIdx:  0,
    },
    register: {
      tagline: "Tham gia cùng chúng tôi!",
      sub:     "Tạo tài khoản và khám phá những trải nghiệm ẩm thực đẳng cấp.",
      dotIdx:  1,
    },
  };

  function updateLeftPanel(tab) {
    if (!panelTagline) return;
    const content = panelContent[tab];

    panelTagline.style.opacity = "0";
    panelTagline.style.transform = "translateY(8px)";

    setTimeout(() => {
      panelTagline.innerHTML = `${content.tagline}<br/><span>${content.sub}</span>`;
      panelTagline.style.opacity = "1";
      panelTagline.style.transform = "translateY(0)";
    }, 250);

    // Dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("auth-dot--active", i === content.dotIdx);
    });
  }

  // Smooth transition style for tagline
  if (panelTagline) {
    panelTagline.style.transition = "opacity 0.25s ease, transform 0.25s ease";
  }

  /* -------------------------------------------------------
     TAB SWITCHING
  ------------------------------------------------------- */
  function activateTab(tab) {
    const isLogin = tab === "login";

    tabLogin.classList.toggle("auth-tab--active", isLogin);
    tabRegister.classList.toggle("auth-tab--active", !isLogin);
    tabIndicator.classList.toggle("auth-tab-indicator--right", !isLogin);

    formLogin.classList.toggle("auth-form--active", isLogin);
    formRegister.classList.toggle("auth-form--active", !isLogin);

    // Restart animation
    const activeForm = isLogin ? formLogin : formRegister;
    activeForm.style.animation = "none";
    activeForm.offsetHeight;
    activeForm.style.animation = "";

    // Scroll back to top of the right panel
    if (scrollArea) scrollArea.scrollTop = 0;

    updateLeftPanel(tab);
  }

  tabLogin.addEventListener("click",    () => activateTab("login"));
  tabRegister.addEventListener("click", () => activateTab("register"));
  switchToReg && switchToReg.addEventListener("click", () => activateTab("register"));
  switchToLog && switchToLog.addEventListener("click", () => activateTab("login"));

  // Dots click
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = parseInt(dot.dataset.idx, 10);
      activateTab(idx === 0 ? "login" : "register");
    });
  });

  /* -------------------------------------------------------
     TOAST
  ------------------------------------------------------- */
  function showToast(message, type = "success") {
    clearTimeout(toastTimer);
    toastMsg.textContent = message;
    toast.classList.remove("auth-toast--error");

    if (type === "error") {
      toast.classList.add("auth-toast--error");
      toastIcon.className = "auth-toast__icon fa-solid fa-circle-xmark";
    } else {
      toastIcon.className = "auth-toast__icon fa-solid fa-circle-check";
    }

    toast.classList.add("auth-toast--visible");
    toastTimer = setTimeout(() => toast.classList.remove("auth-toast--visible"), 3500);
  }

  /* -------------------------------------------------------
     TOGGLE PASSWORD VISIBILITY
  ------------------------------------------------------- */
  function setupPasswordToggle(toggleBtnId, inputId) {
    const btn   = document.getElementById(toggleBtnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.querySelector("i").className = isHidden
        ? "fa-regular fa-eye-slash"
        : "fa-regular fa-eye";
    });
  }

  setupPasswordToggle("toggle-login-pw",       "login-password");
  setupPasswordToggle("toggle-reg-pw",         "reg-password");
  setupPasswordToggle("toggle-reg-confirm-pw", "reg-confirm");

  /* -------------------------------------------------------
     PASSWORD STRENGTH METER
  ------------------------------------------------------- */
  const regPassword    = document.getElementById("reg-password");
  const strengthFill   = document.getElementById("pw-strength-fill");
  const strengthLabel  = document.getElementById("pw-strength-label");
  const strengthWidget = document.getElementById("auth-pw-strength");

  function calcStrength(pw) {
    let s = 0;
    if (pw.length >= 8)              s++;
    if (pw.length >= 12)             s++;
    if (/[A-Z]/.test(pw))           s++;
    if (/[0-9]/.test(pw))           s++;
    if (/[^A-Za-z0-9]/.test(pw))   s++;
    return s; // 0–5
  }

  regPassword && regPassword.addEventListener("input", () => {
    const pw = regPassword.value;
    if (!pw.length) {
      strengthWidget.classList.remove("auth-pw-strength--visible");
      return;
    }
    strengthWidget.classList.add("auth-pw-strength--visible");

    const score = calcStrength(pw);
    strengthFill.className = "auth-pw-strength__fill";

    if (score <= 2) {
      strengthFill.classList.add("auth-pw-strength__fill--weak");
      strengthLabel.textContent  = "Yếu";
      strengthLabel.style.color  = "#f05a6e";
    } else if (score <= 3) {
      strengthFill.classList.add("auth-pw-strength__fill--medium");
      strengthLabel.textContent  = "Trung bình";
      strengthLabel.style.color  = "#e88735";
    } else {
      strengthFill.classList.add("auth-pw-strength__fill--strong");
      strengthLabel.textContent  = "Mạnh";
      strengthLabel.style.color  = "#2ecc71";
    }
  });

  /* -------------------------------------------------------
     VALIDATION HELPERS
  ------------------------------------------------------- */
  function setError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (!field || !error) return;
    field.classList.add("auth-field--error");
    field.classList.remove("auth-field--success");
    error.textContent = message;
  }

  function setSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.remove("auth-field--error");
    field.classList.add("auth-field--success");
  }

  function clearState(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field) field.classList.remove("auth-field--error", "auth-field--success");
    if (error) error.textContent = "";
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function isValidPhone(phone) {
    return /^(0|\+84)[0-9]{9}$/.test(phone.replace(/\s/g, ""));
  }

  /* -------------------------------------------------------
     REAL-TIME VALIDATION BINDER
  ------------------------------------------------------- */
  function bindField(inputEl, fieldId, errorId, validateFn) {
    if (!inputEl) return;
    inputEl.addEventListener("blur",  validateFn);
    inputEl.addEventListener("input", () => clearState(fieldId, errorId));
  }

  /* -------------------------------------------------------
     LOGIN — Validation + Submit
  ------------------------------------------------------- */
  const loginEmail    = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");

  bindField(loginEmail, "login-field-email", "login-email-error", () => {
    const v = loginEmail.value.trim();
    if (!v)               setError("login-field-email", "login-email-error", "Vui lòng nhập email");
    else if (!isValidEmail(v)) setError("login-field-email", "login-email-error", "Email không hợp lệ");
    else                  setSuccess("login-field-email");
  });

  bindField(loginPassword, "login-field-password", "login-password-error", () => {
    if (!loginPassword.value) setError("login-field-password", "login-password-error", "Vui lòng nhập mật khẩu");
    else                      setSuccess("login-field-password");
  });

  formLogin && formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;

    const ev = loginEmail.value.trim();
    if (!ev) {
      setError("login-field-email", "login-email-error", "Vui lòng nhập email"); valid = false;
    } else if (!isValidEmail(ev)) {
      setError("login-field-email", "login-email-error", "Email không hợp lệ"); valid = false;
    } else { setSuccess("login-field-email"); }

    if (!loginPassword.value) {
      setError("login-field-password", "login-password-error", "Vui lòng nhập mật khẩu"); valid = false;
    } else { setSuccess("login-field-password"); }

    if (!valid) return;

    const btn = document.getElementById("login-submit-btn");
    setLoading(btn, true);
    await delay(1200);
    setLoading(btn, false);

    showToast("Đăng nhập thành công! Chào mừng trở lại 🎉");
    // TODO: window.location.href = "index.html";
  });

  /* -------------------------------------------------------
     REGISTER — Validation + Submit
  ------------------------------------------------------- */
  const regFirstname = document.getElementById("reg-firstname");
  const regLastname  = document.getElementById("reg-lastname");
  const regPhone     = document.getElementById("reg-phone");
  const regEmail     = document.getElementById("reg-email");
  const regConfirm   = document.getElementById("reg-confirm");
  const regTerms     = document.getElementById("reg-terms");

  bindField(regFirstname, "reg-field-firstname", "reg-firstname-error", () => {
    if (!regFirstname.value.trim()) setError("reg-field-firstname", "reg-firstname-error", "Vui lòng nhập họ");
    else setSuccess("reg-field-firstname");
  });

  bindField(regLastname, "reg-field-lastname", "reg-lastname-error", () => {
    if (!regLastname.value.trim()) setError("reg-field-lastname", "reg-lastname-error", "Vui lòng nhập tên");
    else setSuccess("reg-field-lastname");
  });

  bindField(regPhone, "reg-field-phone", "reg-phone-error", () => {
    const v = regPhone.value.trim();
    if (!v)              setError("reg-field-phone", "reg-phone-error", "Vui lòng nhập số điện thoại");
    else if (!isValidPhone(v)) setError("reg-field-phone", "reg-phone-error", "SĐT không hợp lệ (VD: 0901234567)");
    else                 setSuccess("reg-field-phone");
  });

  bindField(regEmail, "reg-field-email", "reg-email-error", () => {
    const v = regEmail.value.trim();
    if (!v)              setError("reg-field-email", "reg-email-error", "Vui lòng nhập email");
    else if (!isValidEmail(v)) setError("reg-field-email", "reg-email-error", "Email không hợp lệ");
    else                 setSuccess("reg-field-email");
  });

  bindField(regPassword, "reg-field-password", "reg-password-error", () => {
    if (!regPassword.value)          setError("reg-field-password", "reg-password-error", "Vui lòng nhập mật khẩu");
    else if (regPassword.value.length < 8) setError("reg-field-password", "reg-password-error", "Mật khẩu phải có ít nhất 8 ký tự");
    else                             setSuccess("reg-field-password");
  });

  bindField(regConfirm, "reg-field-confirm", "reg-confirm-error", () => {
    if (!regConfirm.value)                  setError("reg-field-confirm", "reg-confirm-error", "Vui lòng xác nhận mật khẩu");
    else if (regConfirm.value !== regPassword.value) setError("reg-field-confirm", "reg-confirm-error", "Mật khẩu không khớp");
    else setSuccess("reg-field-confirm");
  });

  formRegister && formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;

    // First name
    if (!regFirstname.value.trim()) { setError("reg-field-firstname","reg-firstname-error","Vui lòng nhập họ"); valid=false; }
    else setSuccess("reg-field-firstname");

    // Last name
    if (!regLastname.value.trim()) { setError("reg-field-lastname","reg-lastname-error","Vui lòng nhập tên"); valid=false; }
    else setSuccess("reg-field-lastname");

    // Phone
    const pv = regPhone.value.trim();
    if (!pv)              { setError("reg-field-phone","reg-phone-error","Vui lòng nhập số điện thoại"); valid=false; }
    else if (!isValidPhone(pv)) { setError("reg-field-phone","reg-phone-error","SĐT không hợp lệ"); valid=false; }
    else setSuccess("reg-field-phone");

    // Email
    const ev = regEmail.value.trim();
    if (!ev)              { setError("reg-field-email","reg-email-error","Vui lòng nhập email"); valid=false; }
    else if (!isValidEmail(ev)) { setError("reg-field-email","reg-email-error","Email không hợp lệ"); valid=false; }
    else setSuccess("reg-field-email");

    // Password
    if (!regPassword.value)           { setError("reg-field-password","reg-password-error","Vui lòng nhập mật khẩu"); valid=false; }
    else if (regPassword.value.length<8) { setError("reg-field-password","reg-password-error","Mật khẩu phải có ít nhất 8 ký tự"); valid=false; }
    else setSuccess("reg-field-password");

    // Confirm
    if (!regConfirm.value)                      { setError("reg-field-confirm","reg-confirm-error","Vui lòng xác nhận mật khẩu"); valid=false; }
    else if (regConfirm.value!==regPassword.value) { setError("reg-field-confirm","reg-confirm-error","Mật khẩu không khớp"); valid=false; }
    else setSuccess("reg-field-confirm");

    // Terms
    const termsErr = document.getElementById("reg-terms-error");
    if (!regTerms.checked) {
      if (termsErr) { termsErr.textContent="Bạn phải đồng ý với điều khoản"; termsErr.style.display="flex"; }
      valid = false;
    } else {
      if (termsErr) { termsErr.style.display="none"; termsErr.textContent=""; }
    }

    if (!valid) { showToast("Vui lòng kiểm tra lại thông tin", "error"); return; }

    const btn = document.getElementById("register-submit-btn");
    setLoading(btn, true);
    await delay(1500);
    setLoading(btn, false);

    showToast("Tạo tài khoản thành công! Chào mừng bạn 🎉");
    setTimeout(() => activateTab("login"), 1800);
  });

  /* -------------------------------------------------------
     SOCIAL + FORGOT PLACEHOLDERS
  ------------------------------------------------------- */
  const googleBtn  = document.getElementById("login-google");
  const fbBtn      = document.getElementById("login-facebook");
  const forgotLink = document.getElementById("auth-forgot-link");

  googleBtn  && googleBtn.addEventListener("click",  () => showToast("Đang kết nối Google..."));
  fbBtn      && fbBtn.addEventListener("click",      () => showToast("Đang kết nối Facebook..."));
  forgotLink && forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Tính năng đặt lại mật khẩu sẽ sớm ra mắt!", "error");
  });

  /* -------------------------------------------------------
     HELPERS
  ------------------------------------------------------- */
  function setLoading(btn, loading) {
    btn.classList.toggle("auth-btn--loading", loading);
    btn.disabled = loading;
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

})();
