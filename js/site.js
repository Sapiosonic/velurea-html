/* Velurea — interatividade do site.
 *
 * JavaScript puro, sem dependência e sem build. Substitui o que antes era feito
 * por React. São duas coisas apenas: o menu mobile e o accordion do FAQ.
 *
 * Todo o resto do site é HTML estático: links, formulário e navegação funcionam
 * com este arquivo desativado.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * Menu mobile
   *
   * O painel já existe no HTML, fechado por `max-h-0`. Abrir é trocar a
   * classe de altura — a transição vem do CSS (`transition-all duration-300`).
   * ------------------------------------------------------------------ */
  var ICONE_MENU =
    '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>';
  var ICONE_FECHAR = '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>';

  function iniciarMenu() {
    var botao = document.getElementById("menu-toggle");
    var painel = document.getElementById("menu-mobile");
    if (!botao || !painel) return;

    var svg = botao.querySelector("svg");
    var aberto = false;

    function alternar(novoEstado) {
      aberto = novoEstado;
      painel.classList.toggle("max-h-0", !aberto);
      painel.classList.toggle("border-t-0", !aberto);
      painel.classList.toggle("max-h-[36rem]", aberto);
      botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
      if (svg) svg.innerHTML = aberto ? ICONE_FECHAR : ICONE_MENU;
    }

    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-controls", "menu-mobile");
    botao.addEventListener("click", function () {
      alternar(!aberto);
    });

    // Fecha ao navegar para um link do próprio menu.
    painel.addEventListener("click", function (e) {
      if (e.target.closest("a")) alternar(false);
    });

    // Fecha com Esc.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && aberto) {
        alternar(false);
        botao.focus();
      }
    });

    // Se a tela crescer até o breakpoint do menu de desktop (xl = 1280px),
    // o painel fica escondido por CSS; zeramos o estado para não reabrir torto.
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1280 && aberto) alternar(false);
    });
  }

  /* ------------------------------------------------------------------ *
   * Accordion do FAQ
   *
   * Comportamento igual ao original: um aberto por vez, e clicar no aberto
   * fecha. As animações do CSS dependem da variável
   * `--radix-accordion-content-height`, que antes era definida pelo React —
   * aqui medimos a altura real do conteúdo e definimos na mão.
   * ------------------------------------------------------------------ */
  function iniciarAccordion() {
    var gatilhos = document.querySelectorAll("[data-accordion-trigger]");
    if (!gatilhos.length) return;

    function conteudoDe(gatilho) {
      return document.getElementById(gatilho.getAttribute("aria-controls"));
    }

    function definirEstado(gatilho, aberto) {
      var conteudo = conteudoDe(gatilho);
      var item = gatilho.closest("[data-accordion-item]");
      var estado = aberto ? "open" : "closed";

      gatilho.setAttribute("data-state", estado);
      gatilho.setAttribute("aria-expanded", aberto ? "true" : "false");
      if (item) item.setAttribute("data-state", estado);
      if (gatilho.parentElement) gatilho.parentElement.setAttribute("data-state", estado);
      if (!conteudo) return;

      if (aberto) {
        conteudo.hidden = false;
        // A animação `accordion-down` começa em height:0, então medir o
        // elemento enquanto ela está ativa devolve 0 — e a animação passaria a
        // ir de zero a zero. Neutralizamos a animação para medir a altura real
        // e só então a devolvemos, já com a variável certa.
        conteudo.style.animation = "none";
        var altura = conteudo.scrollHeight;
        conteudo.style.animation = "";
        conteudo.style.setProperty("--radix-accordion-content-height", altura + "px");
        conteudo.setAttribute("data-state", "open");
      } else {
        conteudo.setAttribute("data-state", "closed");
        conteudo.hidden = true;
      }
    }

    Array.prototype.forEach.call(gatilhos, function (gatilho) {
      gatilho.addEventListener("click", function () {
        var jaAberto = gatilho.getAttribute("data-state") === "open";
        // type="single": fecha todos antes de abrir o escolhido.
        Array.prototype.forEach.call(gatilhos, function (outro) {
          definirEstado(outro, false);
        });
        // collapsible: clicar no que estava aberto apenas fecha.
        if (!jaAberto) definirEstado(gatilho, true);
      });
    });
  }

  function iniciar() {
    iniciarMenu();
    iniciarAccordion();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
