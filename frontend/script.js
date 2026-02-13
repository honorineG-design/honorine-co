const API = "http://localhost:5000";

let toastTimer;


const translations = {
  en: {
    appTitle: "Honorine Co. Employee Reviews",
    appSubtitle: "AI-assisted employee feedback insights",
    heroTitle: "Analyze employee feedback in seconds.",
    heroBody:
      "Paste survey comments or HR notes. Honorine Co. highlights satisfaction and risk so leaders can respond early.",
    textareaPlaceholder: "Paste or type employee feedback here...",
    analyzeBtn: "Analyze feedback",
    samplesTitle: "Example feedback",
    statsTotal: "Total reviews",
    statsPos: "Positive",
    statsNeg: "Negative",
    historyTitle: "Recent reviews",
    resultPositiveNote:
      "This employee appears positively engaged. Treat this as a retention signal and recognise the contribution.",
    resultNegativeNote:
      "There are signs of dissatisfaction. This feedback deserves a follow-up conversation.",
    loginTitle: "Sign in to Honorine Co.",
    registerTitle: "Create your HR profile",
    firstName: "First name",
    lastName: "Last name",
    email: "Work email",
    phone: "Contact number",
    password: "Password",
    confirmPassword: "Confirm password",
    registerBtn: "Create account",
    loginBtn: "Sign in",
    haveAccount: "Already have an account?",
    needAccount: "Need an account?",
    goToLogin: "Sign in",
    goToRegister: "Register",
    logout: "Sign out",
    nothingYet: "No reviews recorded yet.",
    deleted: "Review deleted.",
    cannotReach: "Cannot reach server. Is the backend running?",
    fillAll: "Please fill in all fields.",
    passwordsNoMatch: "Passwords do not match.",
    shortPassword: "Password must be at least 4 characters.",
    enterFeedbackFirst: "Enter some feedback text first.",
    accountCreated: "Account created. Please sign in.",
    loggedIn: "Signed in.",
  },
  fr: {
    appTitle: "Honorine Co. Avis des employés",
    appSubtitle: "Analyse intelligente des retours collaborateurs",
    heroTitle: "Analysez les retours employés en quelques secondes.",
    heroBody:
      "Collez des commentaires de sondages ou des notes RH. Honorine Co. met en évidence la satisfaction et les signaux de risque.",
    textareaPlaceholder: "Collez ou saisissez ici le retour de l’employé...",
    analyzeBtn: "Analyser le retour",
    samplesTitle: "Exemples de retours",
    statsTotal: "Avis au total",
    statsPos: "Positifs",
    statsNeg: "Négatifs",
    historyTitle: "Avis récents",
    resultPositiveNote:
      "Ce collaborateur semble engagé positivement. C’est un signal de rétention à valoriser.",
    resultNegativeNote:
      "Des signaux d’insatisfaction apparaissent. Ce retour mérite un échange de suivi.",
    loginTitle: "Connexion à Honorine Co.",
    registerTitle: "Créer votre profil RH",
    firstName: "Prénom",
    lastName: "Nom",
    email: "E‑mail professionnel",
    phone: "Numéro de contact",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    registerBtn: "Créer le compte",
    loginBtn: "Se connecter",
    haveAccount: "Vous avez déjà un compte ?",
    needAccount: "Vous n’avez pas de compte ?",
    goToLogin: "Se connecter",
    goToRegister: "S’inscrire",
    logout: "Se déconnecter",
    nothingYet: "Aucun avis enregistré pour le moment.",
    deleted: "Avis supprimé.",
    cannotReach: "Serveur inaccessible. Le backend fonctionne‑t‑il ?",
    fillAll: "Veuillez remplir tous les champs.",
    passwordsNoMatch: "Les mots de passe ne correspondent pas.",
    shortPassword:
      "Le mot de passe doit comporter au moins 4 caractères.",
    enterFeedbackFirst:
      "Saisissez d’abord un retour d’employé.",
    accountCreated: "Compte créé. Veuillez vous connecter.",
    loggedIn: "Connecté.",
  },
  rw: {
    appTitle: "Honorine Co. Isuzuma ry’ibitekerezo by’abakozi",
    appSubtitle: "Gusesengura ibyiyumvo by’abakozi",
    heroTitle: "Sesengura ibitekerezo by’abakozi mu masegonda.",
    heroBody:
      "Andika cyangwa copy‑paste ibisubizo by’abanze cyangwa ibiganiro bya HR. Honorine Co. izagaragaza ibyishimo n’ibimenyetso by’ibibazo hakiri kare.",
    textareaPlaceholder: "Andika hano igitekerezo cy’umukozi...",
    analyzeBtn: "Sesengura igitekerezo",
    samplesTitle: "Ingero z’ibitekerezo",
    statsTotal: "Ibitekerezo byose",
    statsPos: "Byiza",
    statsNeg: "Bibi",
    historyTitle: "Ibitekerezo biheruka",
    resultPositiveNote:
      "Uyu mukozi agaragaza kunyurwa no kwitanga. Ni ikimenyetso cyiza cyo gukomeza kumwitaho.",
    resultNegativeNote:
      "Hari ibimenyetso by’uko atanyuzwe. Iki gitekerezo gikeneye ikiganiro gikurikiraho.",
    loginTitle: "Injira muri Honorine Co.",
    registerTitle: "Hanga konti yawe ya HR",
    firstName: "Izina rito",
    lastName: "Izina ry’inyuma",
    email: "Imeli y’akazi",
    phone: "Numero ya telefoni",
    password: "Ijambo ry’ibanga",
    confirmPassword: "Ongera ijambo ry’ibanga",
    registerBtn: "Hanga konti",
    loginBtn: "Injira",
    haveAccount: "Usanzwe ufite konti?",
    needAccount: "Nta konti ufite?",
    goToLogin: "Injira",
    goToRegister: "Iyandikishe",
    logout: "Sohoka",
    nothingYet: "Nta gitekerezo kirandikwa.",
    deleted: "Igitekerezo cyahanaguwe.",
    cannotReach: "Server ntibonetse. Backend iri gukora?",
    fillAll: "Zuza imyanya yose usabwe.",
    passwordsNoMatch: "Amagambo y’ibanga ntahura.",
    shortPassword:
      "Ijambo ry’ibanga rigomba kuba nibura inyuguti 4.",
    enterFeedbackFirst:
      "Banza wandike igitekerezo cy’umukozi.",
    accountCreated: "Konti irakozwe. Injira.",
    loggedIn: "Winjiye neza.",
  },
  sw: {
    appTitle: "Honorine Co. Maoni ya Wafanyakazi",
    appSubtitle:
      "Uchanganuzi wa akili wa mrejesho wa wafanyakazi",
    heroTitle: "Changanua maoni ya wafanyakazi kwa sekunde.",
    heroBody:
      "Bandika maoni ya tafiti au mazungumzo ya HR. Honorine Co. inaonyesha kuridhika na ishara za hatari mapema.",
    textareaPlaceholder:
      "Andika au bandika hapa maoni ya mfanyakazi...",
    analyzeBtn: "Changanua maoni",
    samplesTitle: "Mifano ya maoni",
    statsTotal: "Maoni yote",
    statsPos: "Chanya",
    statsNeg: "Hasi",
    historyTitle: "Maoni ya karibuni",
    resultPositiveNote:
      "Mfanyakazi anaonekana kuridhika. Hii ni ishara nzuri ya kutunza na kumtambua.",
    resultNegativeNote:
      "Kuna ishara za kutoridhika. Maoni haya yanahitaji mazungumzo ya ufuatiliaji.",
    loginTitle: "Ingia kwenye Honorine Co.",
    registerTitle: "Unda wasifu wa HR",
    firstName: "Jina la kwanza",
    lastName: "Jina la ukoo",
    email: "Barua pepe ya kazi",
    phone: "Namba ya mawasiliano",
    password: "Nenosiri",
    confirmPassword: "Thibitisha nenosiri",
    registerBtn: "Unda akaunti",
    loginBtn: "Ingia",
    haveAccount: "Tayari una akaunti?",
    needAccount: "Huna akaunti?",
    goToLogin: "Ingia",
    goToRegister: "Jisajili",
    logout: "Toka",
    nothingYet: "Bado hakuna maoni yaliyorekodiwa.",
    deleted: "Maoni yamefutwa.",
    cannotReach: "Seva haipatikani. Je, backend inaendeshwa?",
    fillAll: "Tafadhali jaza sehemu zote.",
    passwordsNoMatch: "Manenosiri hayalingani.",
    shortPassword:
      "Nenosiri lazima liwe angalau herufi 4.",
    enterFeedbackFirst:
      "Andika kwanza maoni ya mfanyakazi.",
    accountCreated: "Akaunti imeundwa. Tafadhali ingia.",
    loggedIn: "Umeingia.",
  },
};

function detectInitialLang() {
  const saved = localStorage.getItem("lang");
  if (saved && ["en", "fr", "rw", "sw"].includes(saved)) {
    return saved;
  }

  const navLang =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage ||
    "en";

  const lang = navLang.toLowerCase();

  if (lang.startsWith("fr")) return "fr";
  if (lang.startsWith("rw") || lang.startsWith("kin")) return "rw";
  if (lang.startsWith("sw") || lang.startsWith("swa")) return "sw";
  return "en";
}

let currentLang = detectInitialLang();

function t(key) {
  const pack = translations[currentLang] || translations.en;
  return pack[key] || translations.en[key] || key;
}

function setLang(lang) {
  if (!["en", "fr", "rw", "sw"].includes(lang)) return;
  currentLang = lang;
  localStorage.setItem("lang", lang);
  applyTranslations();
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  const ta = document.getElementById("feedbackText");
  if (ta) ta.placeholder = t("textareaPlaceholder");

  const analyzeBtn = document.getElementById("analyzeBtn");
  if (analyzeBtn) {
    const span = analyzeBtn.querySelector("span:not(.spin)");
    if (span) span.textContent = t("analyzeBtn");
  }

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.dataset.langBtn === currentLang
    );
  });
}



function toast(msg, type) {
  const el = document.getElementById("toast");
  const dot = document.getElementById("toastDot");
  const msgEl = document.getElementById("toastMsg");
  if (!el || !dot || !msgEl) return;

  msgEl.textContent = msg;
  dot.className = type === "bad" ? "bad" : "ok";

  el.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("on"), 3000);
}

function showErr(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.add("on");
}

function setLoading(btn, state, labelKey) {
  if (!btn) return;
  btn.disabled = state;
  const spinner = btn.querySelector(".spin");
  const label = btn.querySelector("span:not(.spin)");
  if (spinner) spinner.style.display = state ? "inline-block" : "none";
  if (label && labelKey) label.textContent = t(labelKey);
}

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---------- auth ----------

async function register() {
  const firstName = document.getElementById("regFirst")?.value.trim();
  const lastName = document.getElementById("regLast")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const phone = document.getElementById("regPhone")?.value.trim();
  const password = document.getElementById("regPass")?.value;
  const confirm = document.getElementById("regConfirm")?.value;
  const err = document.getElementById("regErr");

  if (!firstName || !lastName || !email || !phone || !password || !confirm) {
    return showErr(err, t("fillAll"));
  }
  if (password !== confirm) {
    return showErr(err, t("passwordsNoMatch"));
  }
  if (password.length < 4) {
    return showErr(err, t("shortPassword"));
  }

  const btn = document.querySelector(".btn-main");
  setLoading(btn, true, "registerBtn");

  try {
    const res = await fetch(API + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      return showErr(err, data.error || "Registration failed.");
    }

    toast(t("accountCreated"));
    window.location.href = "login.html";
  } catch (e) {
    showErr(err, t("cannotReach"));
  } finally {
    setLoading(btn, false, "registerBtn");
  }
}

async function login() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPass")?.value;
  const err = document.getElementById("loginErr");

  if (!email || !password) {
    return showErr(err, t("fillAll"));
  }

  const btn = document.querySelector(".btn-main");
  setLoading(btn, true, "loginBtn");

  try {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      return showErr(err, data.error || "Login failed.");
    }

    const name = data.name || email;
    sessionStorage.setItem("username", name);
    toast(t("loggedIn"));
    window.location.href = "index.html";
  } catch (e) {
    showErr(err, t("cannotReach"));
  } finally {
    setLoading(btn, false, "loginBtn");
  }
}

async function logout() {
  try {
    await fetch(API + "/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    // ignore
  }
  sessionStorage.removeItem("username");
  window.location.href = "login.html";
}

const samples = [
  "Management here is genuinely great. I feel heard, my growth is supported, and the team culture is something I've never experienced elsewhere. Work-life balance is respected.",
  "I've been raising the same issue for months and nothing changes. Communication from leadership is nonexistent and a lot of talented people are leaving.",
  "The company has real potential and some parts of the culture are strong, but compensation is behind the market and some teams feel ignored.",
];

function setSample(i) {
  const ta = document.getElementById("feedbackText");
  const result = document.getElementById("result");
  if (!ta) return;
  ta.value = samples[i];
  if (result) result.classList.remove("on");
}

async function analyze() {
  const ta = document.getElementById("feedbackText");
  const err = document.getElementById("analyzeErr");
  const btn = document.getElementById("analyzeBtn");
  const resultCard = document.getElementById("result");

  if (err) err.classList.remove("on");
  if (resultCard) resultCard.classList.remove("on");

  const text = (ta?.value || "").trim();
  if (!text) {
    toast(t("enterFeedbackFirst"), "bad");
    return;
  }

  setLoading(btn, true, "analyzeBtn");

  try {
    const res = await fetch(API + "/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });

    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const data = await res.json();
    if (!res.ok) {
      return showErr(err, data.error || "Analysis failed.");
    }

    renderResult(data.sentiment, data.confidence);
    loadHistory();
    toast("OK");
  } catch (e) {
    showErr(err, t("cannotReach"));
  } finally {
    setLoading(btn, false, "analyzeBtn");
  }
}

function renderResult(sentiment, confidence) {
  const card = document.getElementById("result");
  if (!card) return;

  card.classList.add("on");

  const label = document.getElementById("resultLabel");
  const confEl = document.getElementById("confBadge");
  const noteEl = document.getElementById("resultNote");

  const isPos = sentiment === "POSITIVE";

  if (label) {
    label.className = "result-label " + (isPos ? "positive" : "negative");
    const badge = label.querySelector(".badge");
    if (badge) badge.textContent = isPos ? "Positive" : "Negative";
  }

  if (confEl) {
    confEl.textContent = (confidence * 100).toFixed(1) + "% confidence";
  }

  if (noteEl) {
    noteEl.textContent = isPos
      ? t("resultPositiveNote")
      : t("resultNegativeNote");
  }
}


async function loadHistory() {
  const totalEl = document.getElementById("stTotal");
  const posEl = document.getElementById("stPos");
  const negEl = document.getElementById("stNeg");
  const list = document.getElementById("histList");

  if (!list) return;

  try {
    const res = await fetch(API + "/history", {
      credentials: "include",
    });
    if (!res.ok) return;
    const data = await res.json();

    const pos = data.filter((r) => r.sentiment === "POSITIVE").length;
    const neg = data.filter((r) => r.sentiment === "NEGATIVE").length;

    if (totalEl) totalEl.textContent = data.length;
    if (posEl) posEl.textContent = pos;
    if (negEl) negEl.textContent = neg;

    if (!data.length) {
      list.innerHTML =
        '<div class="hist-empty">' + t("nothingYet") + "</div>";
      return;
    }

    list.innerHTML = data
      .slice(0, 50)
      .map(
        (r) => `
      <div class="hist-item">
        <div class="hist-item-top">
          <div class="hist-badge ${r.sentiment}">
            ${r.sentiment}
          </div>
          <div class="hist-time">
            ${esc(r.created_at)}
            <button class="delete-btn" onclick="deleteFeedback(${r.id})">×</button>
          </div>
        </div>
        <div class="hist-text">${esc(r.text)}</div>
      </div>
    `
      )
      .join("");
  } catch (e) {
    // ignore for now
  }
}

async function deleteFeedback(id) {
  try {
    const res = await fetch(API + "/feedback/" + id, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) return;
    toast(t("deleted"));
    loadHistory();
  } catch (e) {
    toast(t("cannotReach"), "bad");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();

  const page = document.body.dataset.page || "";

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.langBtn);
    });
  });

  if (page === "dashboard") {
    const username = sessionStorage.getItem("username");
    if (!username) {
      window.location.href = "login.html";
      return;
    }
    document
      .querySelectorAll(".uname")
      .forEach((el) => (el.textContent = username));
    document
      .querySelectorAll(".uavi")
      .forEach((el) => (el.textContent = username[0].toUpperCase()));
    loadHistory();
  }

  const loginPass = document.getElementById("loginPass");
  if (loginPass) {
    loginPass.addEventListener("keydown", (e) => {
      if (e.key === "Enter") login();
    });
  }

  const regConfirm = document.getElementById("regConfirm");
  if (regConfirm) {
    regConfirm.addEventListener("keydown", (e) => {
      if (e.key === "Enter") register();
    });
  }
});
