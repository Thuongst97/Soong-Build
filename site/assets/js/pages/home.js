/* Landing page: module cards and learning tracks rendered from the site map */
(function () {
  const { SITE, $, esc } = window.SBA;
  const TRACKS = [
    ["1 · Foundations", ["overview", "setup", "blueprint"]],
    ["2 · Soong in depth", ["modules", "product", "extending", "debugging"]],
    ["3 · Images & kernel", ["images", "kernel"]],
    ["4 · Head-unit SoC", ["headunit", "qnx-hypervisor", "qnx-cluster", "android-guest", "linux-se", "integration"]],
  ];
  const byId = Object.fromEntries(SITE.map((p) => [p.id, p]));

  $("#tracks").innerHTML = TRACKS.map(([title, ids]) => `<div class="track-col glass card"><h4>${esc(title)}</h4>${ids
    .map((id) => `<a href="${byId[id].file}"><span>${byId[id].num}</span>${esc(byId[id].short)}</a>`).join("")}</div>`).join("");

  $("#module-cards").innerHTML = SITE.map((p) => `
    <a class="module-card glass" href="${p.file}" style="--accent:${p.accent}">
      <div class="mc-top"><div class="mc-icon">${p.icon}</div><span class="badge gray">${esc(p.group)} · ${p.num}</span></div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.desc)}</p>
      <span class="mc-go">Open →</span>
    </a>`).join("");
})();
