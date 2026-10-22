const KEY = "pesquise-isto-abertos";
let opened = {};
try { opened = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { opened = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(opened)); } catch (e) {} };

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const list = document.getElementById("list");
document.getElementById("sub").textContent = INTRO;

list.innerHTML = TERMS.map(t => {
  const url = "https://www.google.com/search?hl=pt-BR&gl=BR&q=" + encodeURIComponent(t.q);
  return `<li class="${t.featured ? "featured" : ""}">
    <a class="item ${opened[t.q] ? "opened" : ""}" href="${url}" target="_blank" rel="noopener noreferrer" data-q="${esc(t.q)}">
      <span class="term">${esc(t.q)}</span>
      ${t.tease ? `<span class="tease">${esc(t.tease)}</span>` : ""}
      <span class="via">Pesquisar no Google</span>
      <span class="seen">Você foi atrás.</span>
    </a></li>`;
}).join("");

function updateCount() {
  const c = TERMS.filter(t => opened[t.q]).length;
  document.getElementById("count").textContent =
    c === 0 ? `${TERMS.length} termos`
    : c === TERMS.length ? "Você abriu todos."
    : `${c} de ${TERMS.length} abertos`;
}
updateCount();

list.addEventListener("click", e => {
  const a = e.target.closest("a[data-q]");
  if (!a) return;
  track("term_click", { term: a.dataset.q });
  opened[a.dataset.q] = true; save();
  a.classList.add("opened");
  updateCount();
});

document.getElementById("share").addEventListener("click", async () => {
  const link = location.href.split("#")[0];
  const toast = document.getElementById("toast");
  track("share");
  const touch = matchMedia("(pointer: coarse)").matches;
  try { if (touch && navigator.share) { await navigator.share({ title: document.title, url: link }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(link); toast.textContent = "Link copiado. Cole onde quiser."; }
  catch (e) { toast.textContent = "Não foi possível copiar. O link é: " + link; }
});

/* Analytics: loads only after the visitor accepts (LGPD) */
const GA_ID = "G-1CWKGBVPW7", CKEY = "pesquise-isto-cookies";
let gaOn = false;
function track(name, params) { if (gaOn) gtag("event", name, params); }
function loadGA() {
  if (gaOn) return;
  gaOn = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag("js", new Date()); gtag("config", GA_ID);
  const s = document.createElement("script");
  s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
}
function getChoice() { try { return localStorage.getItem(CKEY); } catch (e) { return null; } }
function setChoice(v) {
  try { localStorage.setItem(CKEY, v); } catch (e) {}
  document.getElementById("consent").hidden = true;
  document.getElementById("prefs").hidden = false;
  if (v === "yes") loadGA();
  else if (gaOn) location.reload(); // stop tracking and drop the loaded script
}
document.getElementById("allow").addEventListener("click", () => setChoice("yes"));
document.getElementById("deny").addEventListener("click", () => setChoice("no"));
document.getElementById("prefs").addEventListener("click", () => {
  document.getElementById("consent").hidden = false;
  document.getElementById("prefs").hidden = true;
});
const choice = getChoice();
if (choice === "yes") loadGA();
if (choice) document.getElementById("prefs").hidden = false;
else document.getElementById("consent").hidden = false;
