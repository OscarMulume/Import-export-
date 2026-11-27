# Rapport de mission — Import-Export — 2026-11-27

Dépôt : `OscarMulume/Import-export-` (public) — dossier local `C:\Users\oscar\Import-export-`.
Stack : Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Vitest, Supabase (optionnel).

## Étapes

| Étape | Fichiers | Tests | Commit | Tag | Poussé |
|---|---|---|---|---|---|
| 1a — Socle : scaffold Next.js/TS/Tailwind, design system Liquid Glass, layout FR, header/footer, bandeau démo, accueil, pages provisoires, utilitaires USD/CDF + tests, AGENTS.md, README, .env.example | `next.config.ts`, `src/app/{layout,page,globals.css}`, `src/app/{catalogue,panier,suivi,aide}/page.tsx`, `src/components/*`, `src/lib/{money,site}.ts`, `src/lib/money.test.ts`, `AGENTS.md`, `README.md`, `.env.example`, `vitest.config.mts`, `package.json` | lint OK · typecheck OK · 9 tests OK · build OK (8 routes statiques) | ce commit | `v0.1.0-socle` | oui |

## Vérification indépendante (@verificateur)

Verdict : **VERT** — prêt à committer. Lint, typecheck, tests (9/9) et build vérifiés ; aucun secret en
dur ; `.env*` ignoré sauf `.env.example` ; opérateurs RDC uniquement ; accessibilité et design conformes.

## Décisions et points d'honnêteté

- **Nom commercial provisoire** : « Import-Export » (le nom définitif n'a pas été fourni). À confirmer.
- **Catalogue et prix** : non fournis à ce stade. Aucune donnée réelle n'est inventée ; la page catalogue
  est provisoire et le mode démonstration est affiché.
- **Logos de paiement** : aucun logo officiel n'est embarqué pour l'instant (pas de faux logo). Les badges
  texte seront remplacés par les SVG officiels fournis/validés.
- **Paiement réel** : non activé sans clés Flutterwave ni endpoint de vérification serveur. Aucune
  commande ne sera marquée « payée » sans confirmation réelle.

## Reste à faire (étape 1)

1b. Catalogue (démo étiquetée) + panier + pages produit.
1c. Logos de paiement + checkout invité en un clic + compte optionnel.
1d. Module de paiement provider-agnostique (Flutterwave + repli mobile money manuel).
1e. Animations/micro-interactions + bot boutique.
1f. Déploiement (export statique GitHub Pages) + preview complet.

## Questions pour Oscar

1. Nom commercial définitif de la boutique et adresse de contact publique.
2. Liste réelle des produits (catégorie, description, prix USD et CDF) et photos.
3. Clés Flutterwave (publique + secrète) et numéros mobile money à afficher.
4. Logos officiels SVG des moyens de paiement (fichiers à fournir).
5. Projet Supabase à utiliser pour les commandes/comptes (ou rester en démo).
