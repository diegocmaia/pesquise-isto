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
  opened[a.dataset.q] = true; save();
  a.classList.add("opened");
  updateCount();
});

document.getElementById("share").addEventListener("click", async () => {
  let link = "";
  try { link = location.href.split("#")[0]; } catch (e) {}
  const toast = document.getElementById("toast");
  try { if (navigator.share) { await navigator.share({ text: SHARE_TEXT, url: link || undefined }); return; } } catch (e) {}
  try { await navigator.clipboard.writeText(link ? SHARE_TEXT + " " + link : SHARE_TEXT); toast.textContent = "Copiado. Cole onde quiser."; }
  catch (e) { toast.textContent = "Não foi possível copiar. Compartilhe: " + SHARE_TEXT; }
});
