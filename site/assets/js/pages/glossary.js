/* Reference B — filterable glossary */
(function () {
  const { $, $$, esc, norm, slug } = window.SBA;
  const CATS = [["all", "All"], ["build", "Build"], ["image", "Images"], ["kernel", "Kernel"], ["virt", "Virtualization"], ["auto", "Automotive"]];
  const BADGE = { build: "", image: "amber", kernel: "green", virt: "purple", auto: "red" };
  const items = (window.GLOSSARY || []).slice().sort((a, b) => a.term.localeCompare(b.term));
  const grid = $("#gloss-grid"), input = $("#gloss-filter"), cats = $("#gloss-cats");
  let cat = "all";

  cats.innerHTML = CATS.map(([k, l]) => `<button type="button" data-cat="${k}" aria-pressed="${k === "all"}">${l}</button>`).join("");
  grid.innerHTML = items.map((g) => `
    <div class="gloss-item glass" id="g-${slug(g.term)}" data-cat="${g.cat}" data-hay="${esc(norm(g.term + " " + g.full + " " + g.desc))}">
      <span class="badge gcat ${BADGE[g.cat]}">${esc(CATS.find((c) => c[0] === g.cat)[1])}</span>
      <h4>${esc(g.term)}</h4><div class="gf">${esc(g.full)}</div><p>${esc(g.desc)}</p>
    </div>`).join("");

  const apply = () => {
    const q = norm(input.value.trim());
    $$(".gloss-item", grid).forEach((el) => {
      el.hidden = !((cat === "all" || el.dataset.cat === cat) && (!q || el.dataset.hay.includes(q)));
    });
  };
  input.addEventListener("input", apply);
  cats.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    cat = b.dataset.cat;
    $$("button", cats).forEach((x) => {
      x.setAttribute("aria-pressed", x === b);
      x.setAttribute("aria-selected", x === b);   // reuses the tab-list pill styling
    });
    apply();
  });
  $$("button", cats)[0].setAttribute("aria-selected", "true");
})();
