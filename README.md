# Import-Export

Boutique en ligne de vêtements, accessoires et électronique importés de Chine, livrés en République
démocratique du Congo. Les prix sont affichés en **USD** et en **CDF (FC)**.

> **État** : socle en construction. Le catalogue, les prix et les visuels sont en **mode démonstration**
> tant qu'Oscar n'a pas fourni les données réelles. Voir « À confirmer » plus bas.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- Supabase (optionnel, pour les commandes et comptes)
- Vitest (tests unitaires)

## Démarrage

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ouvrir http://localhost:3000.

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm test` | Tests unitaires (Vitest) |

## Paiement

Le module de paiement est **provider-agnostique** :

- **Mode démonstration** (`NEXT_PUBLIC_DEMO_MODE=true`) : aucun débit réel, statuts explicitement de démo.
- **Flutterwave (carte)** : clé publique côté navigateur + vérification **serveur** avec la clé secrète
  via la fonction Edge `supabase/functions/verify-payment`. Sans vérification serveur réussie, la
  commande reste **en attente** — jamais « payée ». Le montant carte est débité en **USD** (le montant
  en FC reste affiché à titre indicatif).
- **Mobile money manuel** : instructions + référence ; la commande reste « en attente de confirmation »
  jusqu'à validation manuelle.

La vérification serveur est fournie comme fonction Edge Supabase (compatible export statique) :

```bash
supabase functions deploy verify-payment
supabase secrets set FLUTTERWAVE_SECRET_KEY=...
```

Puis renseigner `NEXT_PUBLIC_PAYMENT_VERIFY_URL`. Le schéma de commandes est dans
`supabase/schema.sql` (écritures via `service_role`, jamais depuis le navigateur).

Opérateurs pris en charge (RDC uniquement) : M-Pesa, Airtel Money, Orange Money, Afrimoney.

## Données et sauvegarde

- Sans Supabase configuré, les commandes de démonstration restent dans le navigateur (`localStorage`).
- Avec Supabase, appliquer `supabase/schema.sql` puis renseigner les variables d'environnement.
- Les données ne sont **pas** sauvegardées par GitHub : exporter la base avec `pg_dump` ou un export CSV.

## Déploiement

Le site est publié automatiquement sur GitHub Pages par `.github/workflows/pages.yml` à chaque push sur
`main` : **https://oscarmulume.github.io/Import-export-/**.

- Source Pages : « GitHub Actions ».
- Build : `NEXT_OUTPUT=export` et `NEXT_PUBLIC_BASE_PATH=/Import-export-` (sous-chemin du dépôt).
- Le workflow enchaîne lint, typecheck, tests, build statique, puis publie `out/`.

En local, l'export statique se lance ainsi (PowerShell) :

```powershell
$env:NEXT_OUTPUT="export"
$env:NEXT_PUBLIC_BASE_PATH="/Import-export-"
npm run build
```

Le dossier `out/` peut être publié tel quel. Pour les paiements réels (vérification serveur), la fonction
Edge Supabase reste nécessaire ; le reste du site peut rester statique.

## À confirmer (blocages)

- Nom commercial définitif de la boutique et adresse de contact.
- Liste réelle des produits avec prix USD et CDF, et photos fournies par Oscar.
- Clés Flutterwave (publique + secrète) et numéros mobile money.
- Logos officiels des moyens de paiement (fichiers SVG fournis/validés).
- Projet Supabase et schéma de commandes.

© 2026 M-SEC Technology Consulting — Mulume Izuba Oscar. Tous droits réservés.
