-- P0-9: Add published_slug column to track last successfully published slug
-- This column tracks the last successfully published slug to enable safe slug changes
-- and prevent orphaning of published content.

alter table public.documents
add column if not exists published_slug text;

-- Backfill for the six production documents with verified GitHub publications
-- These are the only documents with independently verified GitHub paths
-- Do NOT run this for drafts or unverified documents

update public.documents
set published_slug = 'adi-kailash'
where id = 'b1db939e-af85-4ce5-91bc-f510c2435fe5';

update public.documents
set published_slug = 'curio'
where id = 'f860831f-a6b8-4a09-9f88-dca44bc96d4f';

update public.documents
set published_slug = 'nook'
where id = '397d1a0b-ea90-4454-8877-d6d36e38ab9e';

update public.documents
set published_slug = 'prime'
where id = '6a8bc733-bf5b-4a18-ad5d-15043162a690';

update public.documents
set published_slug = 'statement-analyzer'
where id = '6ef89cce-7c6c-4b54-97f4-a6a68c7a302b';

update public.documents
set published_slug = 'wayfarer'
where id = '5680832c-8ded-43e4-81d8-ff30486b001e';