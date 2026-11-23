// Studied-tracking (localStorage), KaTeX render, sidebar highlight, home-page filter.
(function () {
  const KEY = "cma_notes_studied_v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = (s) => localStorage.setItem(KEY, JSON.stringify(s));
  const uid = document.body.dataset.uid;
  // uids are paths relative to the site root; resolve each link's href to the same form
  const depth = uid.split("/").length - 1;
  const rootUrl = new URL("../".repeat(depth) || "./", location.href);
  const linkUid = (a) => decodeURIComponent(new URL(a.getAttribute("href"), location.href).href.slice(rootUrl.href.length));

  function paint() {
    const s = load();
    document.querySelectorAll("a[href$='.html']").forEach((a) => {
      const u = linkUid(a);
      a.classList.toggle("done", !!s[u]);
      if (u === uid) a.classList.add("current");
    });
    const box = document.querySelector(".studied-box");
    if (box) box.checked = !!s[uid];
    const prog = document.getElementById("progress");
    if (prog) prog.textContent = "Studied so far: " + Object.keys(s).length + " pages.";
  }
  document.addEventListener("DOMContentLoaded", () => {
    const box = document.querySelector(".studied-box");
    if (box) box.addEventListener("change", () => { const s = load(); if (box.checked) s[uid] = 1; else delete s[uid]; save(s); paint(); });
    paint();
    if (window.renderMathInElement) {
      renderMathInElement(document.querySelector("main"), {
        delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }],
        throwOnError: false, strict: false,
      });
    }
    const f = document.getElementById("filter");
    if (f) {
      const all = () => document.querySelectorAll("#tree details");
      document.getElementById("expand").onclick = () => all().forEach((d) => (d.open = true));
      document.getElementById("collapse").onclick = () => all().forEach((d) => (d.open = false));
      f.addEventListener("input", () => {
        const q = f.value.trim().toLowerCase();
        document.querySelectorAll("#tree li, #tree details").forEach((el) => el.classList.remove("hide"));
        if (!q) return;
        document.querySelectorAll("#tree li").forEach((li) => li.classList.toggle("hide", !li.textContent.toLowerCase().includes(q)));
        document.querySelectorAll("#tree details").forEach((d) => {
          const hit = d.textContent.toLowerCase().includes(q);
          d.classList.toggle("hide", !hit);
          if (hit) d.open = true;
        });
      });
    }
  });
})();
