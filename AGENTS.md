# AGENTS.md — Contexte permanent M-SEC (Import-Export)

OpenCode lit ce fichier automatiquement. Il décrit qui nous sommes, ce qui existe, et les règles de
travail. Toute mission doit respecter ce contexte. En cas de doute : ne pas deviner, poser la question
ou l'écrire dans le rapport.

## 0. Ce dépôt

| Élément | Valeur |
|---|---|
| Produit | Boutique **Import-Export** (import Chine → RDC) |
| Dépôt GitHub | `OscarMulume/Import-export-` (public) |
| Dossier local | `C:\Users\oscar\Import-export-` |
| Stack | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Supabase (optionnel) |
| Catalogue | vêtements, accessoires, électronique — prix **USD + CDF (FC)** |
| Paiement | mobile money RDC (M-Pesa, Airtel Money, Orange Money, Afrimoney) + carte via Flutterwave |
| État | socle en construction ; catalogue et prix à confirmer par Oscar (données de démonstration étiquetées) |

Règles propres à ce dépôt :

- **Checkout invité par défaut** ; le compte est **optionnel** et proposé seulement au paiement.
- **Aucune commande n'est marquée « payée » sans confirmation réelle** (vérification serveur Flutterwave
  ou confirmation manuelle du mobile money). Un paiement non vérifié reste « en attente ».
- **Opérateurs RDC uniquement** : M-Pesa, Airtel Money, Orange Money, Afrimoney. Jamais MTN MoMo ni Moov.
- **Aucun prix, produit, visuel, numéro ou logo inventé** : données manquantes = `TODO` visible + question
  dans le rapport. Les données de démonstration sont explicitement étiquetées.
- **Logos de paiement** : seuls des fichiers officiels fournis/validés sont utilisés. À défaut, un badge
  texte neutre est affiché ; ne jamais fabriquer un faux logo de marque.
- **Secrets** : clés Flutterwave et Supabase uniquement en variables d'environnement. `.env.example`
  sans valeurs. La clé secrète Flutterwave ne doit jamais atteindre le navigateur.

## 1. Identité

- Marque officielle : **M-SEC Technology Consulting** (« M-SEC » = Mulume Security). Toujours écrit `M-SEC`
  dans les textes visibles (jamais « M-Sec », « MSEC », « MM-SEC », « MCP »). Identifiants techniques en minuscules : `msec`.
- Fondateur et éditeur : **Mulume Izuba Oscar**, Kinshasa, République démocratique du Congo.
- Statut visé : un studio-startup. M-SEC (conseil IT, réseaux, cybersécurité) finance des produits SaaS.
- Copyright : « © 2026 M-SEC Technology Consulting — Mulume Izuba Oscar. Tous droits réservés. »

## 2. Produits et dépôts

| Produit | Dépôt GitHub | Dossier local | Rôle |
|---|---|---|---|
| Site M-SEC | OscarMulume/msec-technology-consulting (public) | C:\pos-system\repos\msec-technology-consulting | Vitrine, prospects, blog |
| POS Pro | OscarMulume/pos_msec (privé) | C:\pos-system | Caisse restaurant |
| Herbo | OscarMulume/herbo (public) | C:\pos-system\repos\herbo | Boutique de médicaments traditionnels |
| Import-Export | OscarMulume/Import-export- (public) | C:\Users\oscar\Import-export- | Boutique import Chine → RDC |
| Malaïka | OscarMulume/malaika-ranch-web | C:\Users\oscar\malaika-ranch-web | Ranch / plateforme groupe |
| SentinelOps | OscarMulume/sentinelops | C:\Users\oscar\sentinelops | Supervision des applications |

## 3. Infrastructure

- Bases : Supabase organisation « M-SEC TECHNOLOGY CONSULTING ». Projets actifs : `malaika-ranch` et
  `pos-pro-msec` (à renommer `msec-apps`). Bases supplémentaires si besoin : Neon (gratuit).
- Hébergement : sites statiques sur GitHub Pages puis Cloudflare Pages. Serveur POS Pro sur Render.
  **Pas de Vercel Hobby** pour un usage commercial (interdit par ses conditions).
- Jamais de domaine inventé : l'adresse d'API de POS Pro est https://pos-pro-msec.onrender.com tant
  qu'Oscar n'a pas acheté de domaine.

## 4. Contexte RDC (à respecter dans tout le code)

- Devises ISO 4217 : **CDF** et **USD** uniquement en base et dans le code ; l'affichage peut écrire « FC ».
- Mobile money en RDC : **M-Pesa (Vodacom), Airtel Money, Orange Money, Afrimoney (Africell)**.
  MTN MoMo et Moov Money N'EXISTENT PAS en RDC.
- Connexion internet faible ou coupée fréquemment : hors-ligne d'abord, pages légères, images optimisées.
- Langues : français (principal), anglais ; plus tard lingala et swahili. Textes visibles centralisés.
- Beaucoup de téléphones Android d'entrée de gamme : les effets visuels lourds se désactivent sur appareil lent.

## 5. Design (M-SEC Design System)

- Direction : style Apple iOS 26 « Liquid Glass » : surfaces translucides, barres et panneaux flottants,
  coins arrondis, typographie nette, mode clair et sombre.
- Le verre est réservé à la navigation, aux barres d'outils et aux panneaux flottants ; le contenu reste
  sur fond opaque pour la lisibilité. Respecter `prefers-reduced-transparency`, `prefers-reduced-motion`
  et `prefers-color-scheme`.
- Accessibilité : contraste AA minimum, cibles tactiles de 44 px minimum, navigation clavier, textes alternatifs.
- Une seule source de jetons (couleurs, rayons, ombres, flous, espacements) réutilisée par tous les produits.

## 6. Règles de travail (non négociables)

1. **SAUVEGARDE CONTINUE** : chaque étape terminée = lint + typecheck + tests verts + commit + tag +
   rapport d'étape + `git push origin <branche> --tags`, immédiatement. Messages de commit en français.
   On ne termine jamais une session avec du travail non poussé : `git status` propre et
   `git log origin/<branche>..HEAD` vide sont vérifiés et cités dans le rapport.
2. Avant chaque commit : `npm run lint`, `npm run typecheck`, `npm test`. Rien n'est « fait » tant que
   la CI n'est pas verte.
3. Ne jamais afficher, écrire ou committer un secret (.env, clés, jetons). Seulement des `.env.example`
   sans valeurs. La clé publique Supabase (publishable/anon) n'est pas un secret mais passe par une
   variable d'environnement.
4. Ne jamais inventer : un domaine, un opérateur, un prix, un client, un chiffre, une certification, un
   témoignage. Une information manquante = un `TODO` visible + une question dans le rapport.
5. Ne jamais afficher « envoyé avec succès » ou « payé » si l'opération n'a pas réellement réussi.
6. Pas d'affirmations absolues dans les textes commerciaux (« ne tombe jamais en panne », « zéro faille »).
7. Chaque étape ajoute sa ligne au rapport `docs/RAPPORT-<mission>-<AAAA-MM-JJ>.md` (étape | fichiers |
   tests | commit | tag | poussé oui/non) ; le rapport est committé et poussé avec l'étape. En fin de
   mission : ce qui n'a pas pu être fait et pourquoi, questions pour Oscar, puis S'ARRÊTER.
8. Où vit chaque chose : le CODE sur GitHub ; les DONNÉES (produits, commandes, comptes) dans Supabase ;
   les SITES et SERVEURS en ligne sur GitHub Pages / Cloudflare Pages / Render. Une sauvegarde GitHub ne
   sauvegarde pas les données : documenter l'export de la base (pg_dump ou export CSV).
9. Encodage : UTF-8 SANS BOM.
10. VÉRIFICATION AUTOMATIQUE : à la fin de chaque étape, AVANT le commit, appeler le sous-agent
    `@verificateur` (modèle différent) ; corriger ce qu'il signale ; citer son verdict dans le rapport.
