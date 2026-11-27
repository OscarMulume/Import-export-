"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { FlutterwaveCardButton } from "@/components/flutterwave-card-button";
import { PaymentLogo } from "@/components/payment-logo";
import { clearAccount, loadAccount, saveAccount } from "@/lib/account-storage";
import { useCart } from "@/lib/cart-context";
import { formatCdf, formatDualPrice, formatUsd } from "@/lib/money";
import {
  buildOrder,
  orderStatusLabel,
  validateCustomer,
  type CustomerErrors,
  type Order,
  type OrderCustomer,
  type OrderStatus,
} from "@/lib/order";
import { saveOrder, updateOrderStatus } from "@/lib/order-storage";
import { resolvePaymentProvider } from "@/lib/payments/provider";
import {
  getMobileMoneyNumber,
  getPaymentMethod,
  paymentMethods,
  type PaymentLogoId,
  type PaymentMethodId,
} from "@/lib/payment";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_ORDER: (keyof OrderCustomer)[] = ["name", "phone", "city", "address", "email"];

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email";
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
};

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  required = false,
  textarea = false,
}: TextFieldProps) {
  const describedBy = error ? `${id}-erreur` : undefined;
  const inputClassName =
    "w-full rounded-xl border border-line bg-surface-solid px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent";

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-danger">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
          rows={3}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      )}
      {error ? (
        <p id={describedBy} className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function statusClass(status: OrderStatus): string {
  switch (status) {
    case "paid":
      return "bg-success/15 text-success";
    case "awaiting_confirmation":
      return "bg-accent-soft text-accent";
    case "cancelled":
      return "bg-danger/10 text-danger";
    default:
      return "bg-warning/10 text-warning";
  }
}

export function CheckoutFlow({ availableLogos }: { availableLogos: PaymentLogoId[] }) {
  const { resolved, totals, count, ready, clear } = useCart();

  const [customer, setCustomer] = useState<OrderCustomer>({
    name: "",
    phone: "",
    city: "",
    address: "",
    email: "",
    notes: "",
  });
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [accountInput, setAccountInput] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountNotice, setAccountNotice] = useState<string | null>(null);

  const paymentRef = useRef<HTMLDivElement>(null);

  function updateField(field: keyof OrderCustomer, value: string) {
    setCustomer((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function focusFirstError(fieldErrors: CustomerErrors) {
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (first) document.getElementById(`champ-${first}`)?.focus();
  }

  function handleValidate(event: FormEvent) {
    event.preventDefault();
    const validation = validateCustomer(customer);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      focusFirstError(validation);
      return;
    }

    paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    paymentRef.current?.focus();
  }

  function handleCreateAccount() {
    const email = accountInput.trim();
    if (!EMAIL_PATTERN.test(email)) {
      setAccountError("Indiquez une adresse e-mail valide.");
      return;
    }
    const account = saveAccount(email);
    setAccountEmail(account.email);
    setAccountInput("");
    setAccountError(null);
    setAccountNotice(`Compte local de démonstration actif pour ${account.email}.`);
  }

  function handleRemoveAccount() {
    clearAccount();
    setAccountEmail("");
    setAccountNotice(null);
  }

  function handlePay(methodId: PaymentMethodId) {
    if (submitting) return;

    const validation = validateCustomer(customer);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      focusFirstError(validation);
      return;
    }

    if (methodId === "card" && !(customer.email ?? "").trim()) {
      setErrors({ email: "L’e-mail est requis pour le paiement par carte." });
      document.getElementById("champ-email")?.focus();
      return;
    }

    setSubmitting(true);
    setPayError(null);

    try {
      const existing = loadAccount();
      const newOrder = buildOrder({
        customer,
        lines: resolved.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
        })),
        paymentMethod: methodId,
        accountEmail: accountEmail || existing?.email,
      });
      saveOrder(newOrder);
      setOrder(newOrder);
      clear();
    } catch {
      setPayError(
        "Impossible d’enregistrer la commande. Vérifiez votre panier puis réessayez.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handlePaymentResult(status: OrderStatus, message: string) {
    if (!order) return;
    const stored = updateOrderStatus(order.reference, status);
    setOrder(stored ?? { ...order, status });
    setPaymentMessage(message);
  }

  function handleMarkPaid() {
    handlePaymentResult(
      "awaiting_confirmation",
      "Paiement déclaré. La boutique doit encore le confirmer.",
    );
  }

  if (!ready) {
    return <p className="mt-6 text-sm text-muted">Chargement de la commande…</p>;
  }

  if (order) {
    const method = getPaymentMethod(order.paymentMethod);
    const number = method ? getMobileMoneyNumber(method.id) : "";
    const initiation = resolvePaymentProvider(order.paymentMethod).initiate(order);

    return (
      <div className="card mt-6 max-w-2xl space-y-4 p-6">
        <span className="badge bg-accent-soft text-accent">Commande enregistrée</span>
        <h2 className="text-2xl font-semibold tracking-tight">
          Merci, {order.customer.name}.
        </h2>
        <p className="text-sm text-muted">
          Référence : <strong className="text-foreground">{order.reference}</strong>
        </p>

        <div className="flex flex-wrap gap-2">
          <span className={`badge ${statusClass(order.status)}`}>
            {orderStatusLabel(order.status)}
          </span>
          <span className="badge border border-line bg-surface-solid">
            {method?.label ?? order.paymentMethod}
          </span>
        </div>

        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Total</p>
          <p className="mt-1 text-xl font-semibold">{formatDualPrice(order.totals)}</p>
          <p className="text-xs text-muted">
            {order.items.length} ligne{order.items.length > 1 ? "s" : ""} · commande de démonstration
          </p>
        </div>

        {method?.kind === "mobile_money" ? (
          number ? (
            <div className="space-y-2 rounded-2xl bg-surface-alt p-4 text-sm">
              <p className="font-semibold">Paiement {method.label}</p>
              <p>
                Envoyez <strong>{formatCdf(order.totals.cdf)}</strong> au{" "}
                <strong>{number}</strong>
                {method.operator ? ` (${method.operator})` : ""}.
              </p>
              <p className="text-xs text-muted">
                Indiquez la référence {order.reference} dans le message si possible.
              </p>
              {order.status === "pending_payment" ? (
                <button type="button" className="btn btn-primary" onClick={handleMarkPaid}>
                  J’ai effectué le paiement
                </button>
              ) : (
                <p className="text-xs text-muted">
                  Paiement déclaré. La boutique doit encore le confirmer.
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-warning/10 p-4 text-sm">
              <p className="font-semibold text-warning">
                Numéro {method.label} non configuré
              </p>
              <p className="mt-1 text-muted">
                Le numéro de réception n’est pas encore renseigné. Contactez la boutique pour
                finaliser le paiement.
              </p>
            </div>
          )
        ) : initiation.kind === "checkout" ? (
          <div className="space-y-2 rounded-2xl bg-surface-alt p-4 text-sm">
            <p className="font-semibold">Paiement par carte via Flutterwave</p>
            {order.status === "paid" ? (
              <p className="text-success">Paiement confirmé par le serveur.</p>
            ) : (
              <FlutterwaveCardButton order={order} onResult={handlePaymentResult} />
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-surface-alt p-4 text-sm">
            <p className="font-semibold">Paiement par carte</p>
            <p className="mt-1 text-muted">
              {initiation.kind === "unconfigured"
                ? initiation.message
                : "Le paiement par carte n’est pas disponible pour le moment."}
            </p>
          </div>
        )}

        {paymentMessage ? (
          <p className="text-xs text-muted" role="status">
            {paymentMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/suivi?ref=${encodeURIComponent(order.reference)}`}
            className="btn btn-primary"
          >
            Suivre ma commande
          </Link>
          <button type="button" className="btn btn-ghost" onClick={() => setOrder(null)}>
            Nouvelle commande
          </button>
        </div>

        <p className="text-xs text-muted">
          Le statut « payée » n’apparaît qu’après confirmation réelle du paiement. Cette commande est
          une démonstration stockée dans ce navigateur.
        </p>
      </div>
    );
  }

  if (resolved.length === 0) {
    return (
      <div className="card mt-6 max-w-xl p-6">
        <p className="font-semibold">Votre panier est vide.</p>
        <p className="mt-1 text-sm text-muted">
          Ajoutez des articles au panier avant de passer commande.
        </p>
        <Link href="/catalogue" className="btn btn-primary mt-4">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-6">
        <form onSubmit={handleValidate} noValidate className="card space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Vos coordonnées</h2>
            <span className="badge bg-accent-soft text-accent">Commande invité</span>
          </div>
          <p className="text-sm text-muted">
            Aucun compte n’est requis. Le compte est optionnel, plus bas.
          </p>

          <TextField
            id="champ-name"
            label="Nom complet"
            value={customer.name}
            onChange={(value) => updateField("name", value)}
            error={errors.name}
            autoComplete="name"
            required
          />
          <TextField
            id="champ-phone"
            label="Téléphone"
            value={customer.phone}
            onChange={(value) => updateField("phone", value)}
            error={errors.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+243 …"
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="champ-city"
              label="Ville"
              value={customer.city}
              onChange={(value) => updateField("city", value)}
              error={errors.city}
              autoComplete="address-level2"
              required
            />
            <TextField
              id="champ-email"
              label="E-mail (optionnel)"
              value={customer.email ?? ""}
              onChange={(value) => updateField("email", value)}
              error={errors.email}
              type="email"
              inputMode="email"
              autoComplete="email"
            />
          </div>
          <TextField
            id="champ-address"
            label="Adresse de livraison"
            value={customer.address}
            onChange={(value) => updateField("address", value)}
            error={errors.address}
            autoComplete="street-address"
            required
          />
          <TextField
            id="champ-notes"
            label="Note pour la boutique (optionnel)"
            value={customer.notes ?? ""}
            onChange={(value) => updateField("notes", value)}
            textarea
            placeholder="Précisions sur la taille, la livraison…"
          />

          <details className="rounded-2xl border border-line p-4">
            <summary className="cursor-pointer text-sm font-semibold">Compte (optionnel)</summary>
            <div className="mt-3 space-y-2">
              {accountNotice ? <p className="text-xs text-success">{accountNotice}</p> : null}
              {accountEmail ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm">{accountEmail}</span>
                  <button
                    type="button"
                    className="text-xs font-medium text-danger hover:underline"
                    onClick={handleRemoveAccount}
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label htmlFor="champ-compte-email" className="text-xs font-medium">
                    E-mail du compte
                  </label>
                  <input
                    id="champ-compte-email"
                    type="email"
                    value={accountInput}
                    onChange={(event) => {
                      setAccountInput(event.target.value);
                      setAccountError(null);
                    }}
                    className="w-full rounded-xl border border-line bg-surface-solid px-3 py-2.5 text-sm outline-none focus:border-accent"
                    autoComplete="email"
                  />
                  {accountError ? <p className="text-xs text-danger">{accountError}</p> : null}
                  <button type="button" className="btn btn-ghost" onClick={handleCreateAccount}>
                    Créer mon compte (démo)
                  </button>
                </div>
              )}
              <p className="text-xs text-muted">
                Compte local de démonstration : aucune donnée n’est envoyée. En production, la
                connexion passera par Supabase.
              </p>
            </div>
          </details>

          <button type="submit" className="btn btn-primary w-full">
            Vérifier mes informations
          </button>
        </form>

        <div
          ref={paymentRef}
          tabIndex={-1}
          className="card space-y-4 p-5 focus:outline-none"
        >
          <h2 className="text-lg font-semibold">Paiement</h2>
          <p className="text-sm text-muted">
            Choisissez un moyen de paiement : la commande est enregistrée en un clic.
          </p>
          {payError ? <p className="text-sm text-danger">{payError}</p> : null}

          <div className="grid gap-3 sm:grid-cols-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => handlePay(method.id)}
                disabled={submitting}
                className="card card-hover flex flex-col items-start gap-2 p-4 text-left disabled:opacity-60"
                aria-label={`Payer avec ${method.label}`}
              >
                <span className="flex flex-wrap items-center gap-2">
                  {method.logoIds.map((logoId) => (
                    <PaymentLogo
                      key={logoId}
                      id={logoId}
                      available={availableLogos.includes(logoId)}
                    />
                  ))}
                </span>
                <span className="font-semibold">{method.label}</span>
                <span className="text-xs text-muted">{method.description}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-muted">
            Aucun paiement n’est marqué « payé » sans confirmation réelle (vérification serveur ou
            confirmation manuelle).
          </p>
        </div>
      </div>

      <aside className="card h-fit space-y-3 p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">Votre commande</h2>
        <ul className="space-y-2 text-sm">
          {resolved.map(({ product, quantity, lineTotal }) => (
            <li key={product.id} className="flex items-start justify-between gap-2">
              <span className="text-muted">
                {product.name} × {quantity}
              </span>
              <span className="text-right font-medium">{formatDualPrice(lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-line pt-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Articles</span>
            <span className="font-medium">{count}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Total USD</span>
            <span className="font-semibold">{formatUsd(totals.usd)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Total CDF</span>
            <span className="font-semibold">{formatCdf(totals.cdf)}</span>
          </div>
        </div>
        <p className="text-xs text-muted">
          Les produits et prix sont des données de démonstration, à confirmer avant l’ouverture.
        </p>
        <Link href="/panier" className="btn btn-ghost w-full">
          Modifier le panier
        </Link>
      </aside>
    </div>
  );
}
