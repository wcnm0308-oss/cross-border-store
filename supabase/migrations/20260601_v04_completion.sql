alter table public.inquiries
  add column if not exists company_name text,
  add column if not exists phone text,
  add column if not exists whatsapp text,
  add column if not exists country text,
  add column if not exists quantity text,
  add column if not exists requirements text,
  add column if not exists updated_at timestamptz;

create table if not exists public.inquiry_notes (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  note text not null,
  created_at timestamptz default now(),
  created_by text
);

create index if not exists inquiry_notes_inquiry_id_idx
  on public.inquiry_notes(inquiry_id);

create index if not exists inquiries_status_idx
  on public.inquiries(status);

create index if not exists inquiries_created_at_idx
  on public.inquiries(created_at);
