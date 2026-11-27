-- Import-Export — schéma Supabase (optionnel, pour la persistance des commandes).
-- En mode démonstration, les commandes restent dans le navigateur (localStorage).
-- Ce schéma prépare la persistance serveur ; les écritures doivent passer par un
-- serveur/Edge Function avec la clé service_role, jamais par le navigateur.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  created_at timestamptz not null default now(),
  customer jsonb not null,
  items jsonb not null,
  totals jsonb not null,
  payment_method text not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'awaiting_confirmation', 'paid', 'cancelled')),
  account_email text,
  demo boolean not null default true
);

create index if not exists orders_reference_idx on public.orders (reference);

alter table public.orders enable row level security;

-- Aucune politique publique par défaut : la lecture/écriture se fait via service_role
-- (serveur ou Edge Function). Ne jamais exposer la clé service_role au navigateur.
