# verify-payment (Supabase Edge Function)

Vérifie côté serveur une transaction Flutterwave avant de considérer un paiement comme confirmé.
La clé secrète `FLUTTERWAVE_SECRET_KEY` reste sur le serveur et n'est jamais exposée au navigateur.

## Déploiement

```bash
supabase functions deploy verify-payment
supabase secrets set FLUTTERWAVE_SECRET_KEY=...   # ne pas committer la valeur
```

Renseigner ensuite `NEXT_PUBLIC_PAYMENT_VERIFY_URL` avec l'URL publique de la fonction
(par exemple `https://<projet>.supabase.co/functions/v1/verify-payment`).

Tant que cette URL ou la clé publique Flutterwave est absente, l'application affiche le paiement
carte comme non configuré et ne marque jamais une commande comme payée.

## Réponse

- `{ "verified": true, ... }` : transaction réussie, référence, devise et montant conformes.
- `{ "verified": false, "reason": "..." }` : paiement non confirmé ; la commande reste en attente.

La logique est un miroir de `src/lib/payments/flutterwave-verify.ts`, testée par Vitest.
