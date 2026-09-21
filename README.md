# Studio Tecnico Modulo — sito (demo)

Sito **dimostrativo** one-page per lo *Studio Tecnico Modulo — Ing. Fabrizio Puliti e
Ing. Giorgio Ricchi*, studio di ingegneria civile di Rimini.

Statico, senza build né dipendenze: HTML, CSS e JavaScript vanilla.
Identità visiva "Il Modulo" (griglia strutturale, blueprint in chiave luminosa) —
vedi [`DESIGN.md`](DESIGN.md).

## Anteprima
Apri semplicemente `index.html` nel browser. In alternativa, un server locale:

```bash
python -m http.server 8000
```

poi visita `http://localhost:8000`.

## Struttura
```
index.html            pagina unica (Hero, Studio, Titolari, Servizi, Numeri, Progetti, Contatti)
styles/tokens.css     design tokens (colori, tipografia, spaziature)
styles/main.css       layout e componenti
scripts/hero.js       reticolo strutturale animato (canvas)
scripts/main.js       nav, reveal, contatori, filtri, tilt, cursore, form
assets/               logo/favicon e immagine social
DESIGN.md             documentazione del sistema visivo
```

## Note sui contenuti
- **Dati reali:** ragione sociale, sede (Via G. Petruzzi 9, 47922 Rimini), telefono
  (0541 24581), P.IVA (03794930409), ambito di attività (ingegneria civile).
- **Dati dimostrativi** (segnalati nel sito): email, orari, statistiche, progetti/portfolio,
  anno di fondazione, dettagli biografici dei titolari.
- Il modulo di contatto **non invia** dati: mostra solo validazione e conferma visiva.

## Pubblicazione (GitHub Pages)
Impostazioni → Pages → *Deploy from a branch* → `main` / `root`. Il sito è già relativo
alle path, quindi funziona anche in sottocartella.

---
Sito realizzato come demo. Non è il sito ufficiale dello studio.
