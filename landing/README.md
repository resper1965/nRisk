# Landing n.Risk

Landing page do produto n.Risk. **Separada do projeto principal** (backend e app de painel). Estrutura e tom inspirados em [ness.com.br](https://ness.com.br).

## Conteúdo

- **index.html** — Página única: hero, soluções, para quem é, CTA, footer.
- **styles.css** — Estilos (variáveis CSS, responsivo).
- **COPY.md** — Copy e decisão de localização (pasta no repo).

## Como rodar localmente

Servir a pasta como site estático. Exemplos:

```bash
# Python 3
cd landing && python3 -m http.server 8080

# Node (npx serve)
npx serve landing -p 8080

# PHP
cd landing && php -S localhost:8080
```

Abrir [http://localhost:8080](http://localhost:8080).

## Deploy

A pasta `landing/` pode ser publicada como site estático em:

- **Google Cloud Storage + Load Balancer:** fazer upload de `index.html` e `styles.css` em um bucket configurado para site estático.
- **Vercel / Netlify:** apontar o projeto (ou monorepo) para a pasta `landing/` como raiz do site.
- **Cloud Run (static):** empacotar em container que sirva os arquivos com nginx ou similar.

Não há build step; os arquivos são estáticos.

## Plano

Ver [.context/plans/nrisk-landing-page.md](../.context/plans/nrisk-landing-page.md) para fases, copy e critérios de sucesso.
