# Logos de paiement officiels

Déposer ici les fichiers **SVG officiels** fournis/validés par Oscar, avec exactement ces noms :

| Fichier | Marque |
|---|---|
| `mpesa.svg` | M-Pesa (Vodacom) |
| `airtel.svg` | Airtel Money |
| `orange.svg` | Orange Money |
| `afrimoney.svg` | Afrimoney (Africell) |
| `flutterwave.svg` | Flutterwave |
| `visa.svg` | Visa |
| `mastercard.svg` | Mastercard |

Tant qu'un fichier est absent, l'interface affiche un **badge texte neutre** avec le nom de la marque.
Aucun faux logo n'est généré. Le composant `PaymentLogo` détecte les fichiers présents au build
(`src/lib/payment-logos.ts`) et affiche le SVG officiel s'il existe.

Ne pas ajouter de logo non officiel ou non autorisé.
