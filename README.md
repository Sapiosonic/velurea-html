# Velurea — site estático

Site institucional da Velurea Clinic em **HTML, CSS e JavaScript puros**. Sem
framework, sem build, sem dependência. Abrir qualquer `.html` num navegador
funciona.

Gerado a partir do projeto TanStack/React anterior: o HTML e o CSS são
exatamente os que o React produzia, então o visual é idêntico por construção —
a home das duas versões foi comparada pixel a pixel e não há uma só diferença.

---

## Estrutura

```
.
├── index.html                      home
├── sobre/index.html
├── tratamentos/index.html
├── tratamentos/<slug>/index.html   10 páginas de tratamento
├── como-funciona/index.html
├── depoimentos/index.html
├── medicos-e-hospitais/index.html
├── blog/index.html
├── perguntas-frequentes/index.html
├── contato/index.html
├── obrigado/index.html             destino do formulário
├── 404/index.html
├── css/style.css                   todo o CSS (Tailwind já compilado)
├── js/site.js                      menu mobile + accordion do FAQ
├── img/                            3 imagens
├── favicon.ico
├── robots.txt
├── htaccess.txt                    → renomear para .htaccess no Apache/cPanel
├── _headers / _redirects           equivalentes para Netlify
└── README.md
```

As URLs são **as mesmas** da versão anterior. `/contato` continua `/contato`.

---

## ⚠️ O que mudou para pior, e você precisa saber

Na versão React, todo o conteúdo vivia num arquivo só (`src/data/site.ts`).
Agora ele está escrito dentro de cada página.

Medido neste site:

| Para alterar | Arquivos a editar |
| ------------ | ----------------- |
| O número de WhatsApp | **21** |
| O e-mail de contato | **21** |
| Qualquer item do menu ou do rodapé | **21** |

Isso é inerente a um site estático sem template. Para uma alteração pontual, use
busca e substituição em todos os arquivos — no VS Code/Cursor, `Ctrl+Shift+H`.

É exatamente esse problema que a etapa Django resolve: header, rodapé e dados de
contato voltam a existir em um lugar só.

---

## Editar o conteúdo

O texto está direto no HTML. Para mudar um título, procure-o no arquivo da
página e edite.

**Não reformate o HTML automaticamente.** As classes do Tailwind são longas, e um
formatador pode quebrar linhas dentro de atributos. Edite o texto, deixe a
marcação quieta.

**O CSS é compilado.** `css/style.css` saiu do Tailwind; não há arquivo-fonte
aqui. Para um ajuste pontual, escreva no fim do arquivo — ele vence por ordem:

```css
/* ----- ajustes manuais ----- */
.minha-classe { color: #1f3d34; }
```

Mudar a identidade visual inteira (cores, tipografia) pede os tokens no `:root`,
no começo do arquivo.

---

## O JavaScript

`js/site.js` faz duas coisas, e só:

1. **Menu mobile** — abre e fecha o painel em telas abaixo de 1280px.
2. **Accordion do FAQ** — um item aberto por vez, clicar no aberto fecha.

Com o arquivo removido, o site continua navegável: todos os links, o formulário
e o conteúdo funcionam. Só esses dois comportamentos param.

---

## Formulário de contato

Faz POST direto para o **Web3Forms**, que encaminha por e-mail. Sem backend e sem
CORS — POST de formulário HTML não dispara CORS.

A configuração está nos campos ocultos em `contato/index.html`:

```html
<input type="hidden" name="access_key" value="...">
<input type="hidden" name="redirect" value="https://velureaistanbul.com/obrigado">
```

⚠️ O `redirect` precisa ser a URL **real** onde o site está. Testando noutro
endereço, o e-mail chega mas o visitante cai numa página inexistente.

---

## Publicar

**Apache / cPanel / GoDaddy**

1. Renomeie `htaccess.txt` para `.htaccess`
2. Envie todo o conteúdo desta pasta para dentro de `public_html`
3. No FTP ou no File Manager, ative a exibição de arquivos ocultos — senão o
   `.htaccess` não sobe

Sem o `.htaccess`, acessar `/contato` direto pela barra de endereço dá erro.

**Netlify / Cloudflare Pages / qualquer host estático**

Arraste a pasta. O `_headers` e o `_redirects` já estão aqui.

**Conferir depois de publicar:** digite `/contato` e `/tratamentos/oncologia`
direto na barra de endereço. É o teste que pega problema de configuração —
clicar nos links não pega.

---

## Caminho para o Django

Este site é o material de origem. A conversão é direta:

| Aqui | No Django |
| ---- | --------- |
| `css/`, `js/`, `img/` | `static/` |
| Header e rodapé repetidos em 21 páginas | `base.html` com `{% block %}` |
| Cada página | um template que estende `base.html` |
| Texto dentro do HTML | models, editáveis pelo Django Admin |
| Formulário no Web3Forms | view própria gravando o lead |

O trabalho maior é o primeiro: extrair header e rodapé para um `base.html`.
Como as 21 páginas foram geradas pelo mesmo componente, esses trechos são
idênticos entre si — dá para recortar de uma página e reaproveitar nas outras
com segurança.
