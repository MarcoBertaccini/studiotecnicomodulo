# DESIGN.md — Studio Tecnico Modulo

Sistema visivo del sito dimostrativo. Concept: **"Il Modulo"** — il nome dello studio
(modulo / modulo elastico) diventa identità: una **griglia strutturale** come nei disegni
di ingegneria, reinterpretata in chiave **luminosa** (blueprint chiaro, non scuro).

## Principi
- Tema **unico chiaro** per scelta esplicita del cliente: niente dark, niente verde.
- Linguaggio tecnico: linee sottili, quote, coordinate, indici di sezione, angoli squadrati.
- Un solo punto di "audacia": l'accento cobalto. L'arancio è un **segnale** raro (nodi, cantiere).

## Colore (token in `styles/tokens.css`)
| Ruolo | Token | Hex |
|---|---|---|
| Fondo pagina | `--paper` | `#F1F3F6` |
| Sezioni alternate | `--paper-2` | `#E9ECF1` |
| Superfici/card | `--surface` | `#FFFFFF` |
| Testo | `--ink` | `#0E1420` |
| Testo secondario | `--ink-soft` | `#333B4A` |
| Accento primario (blueprint) | `--cobalt` | `#1E38D4` |
| Segnale (cantiere) | `--signal` | `#FF5A1F` |

Neutri con leggero bias freddo verso l'accento (scelti, non di default). Verde ammesso
**solo** per lo stato di successo del form (`--ok`), mai come colore di brand.

## Tipografia (Google Fonts)
- **Display** — `Archivo` (pesi 700/800, larghezza espansa): titoli, look architettonico.
- **Body** — `Instrument Sans`: testo corrente, ottima leggibilità.
- **Mono** — `Space Mono`: etichette tecniche, quote, coordinate, indici (`01 / STUDIO`).

Scala tipografica fluida `--step--1 … --step-5` (clamp). Titoli con `text-wrap: balance`,
numeri con `font-variant-numeric: tabular-nums`.

## Layout
- Griglia editoriale, `--maxw: 1320px`, gutter fluido `clamp(1rem, 4vw, 3.5rem)`.
- Reticolo blueprint di sfondo fisso (`.blueprint-grid`), mascherato in alto/basso.
- Sezioni con indice strutturale numerato (è una **sequenza** reale lungo la pagina).
- Spaziatura via `gap` su flex/grid; angoli `--radius: 4px` (squadrato, non "rounded").

## Motion
- Solo `transform`/`opacity`, `requestAnimationFrame`, `IntersectionObserver`.
- Hero: mesh strutturale su `<canvas>` (nodi + collegamenti), parallax leggero col puntatore,
  in pausa quando fuori schermo.
- Reveal allo scroll, contatori animati, tilt 3D sulle card, cursore custom.
- Tutto disattivato sotto `prefers-reduced-motion`; lo stato **a riposo è già visibile**.

## Accessibilità
- Landmark semantici, skip link, focus visibile, menu mobile con `aria-expanded`.
- Form con label esplicite, errori `aria-live`, `aria-invalid`.
- Contrasto testo/fondo elevato (ink su paper). Immagini decorative `aria-hidden`.

## File
```
index.html            markup + contenuti + JSON-LD
styles/tokens.css     design tokens
styles/main.css       layout e componenti
scripts/hero.js       animazione canvas della hero
scripts/main.js       nav, reveal, contatori, filtri, tilt, cursore, form
assets/logo.svg       marchio / favicon
assets/og.svg         immagine social
```

## Nota sui dati
Dati reali: nome, sede (Via G. Petruzzi 9, Rimini), telefono (0541 24581), P.IVA (03794930409),
ambito (ingegneria civile). Email, orari, numeri e progetti sono **dimostrativi** e segnalati come tali.
