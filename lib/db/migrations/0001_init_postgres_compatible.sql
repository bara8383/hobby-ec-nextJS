-- P-028: PostgreSQL互換の初期スキーマ（開発時はSQLite方言へ変換して適用）

create table if not exists users (
  id text primary key,
  email text not null unique,
  role text not null check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null default '',
  sort_order integer not null default 0
);

create table if not exists products (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  price_jpy integer not null,
  category_id text not null references categories(id),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_specs (
  id text primary key,
  product_id text not null unique references products(id) on delete cascade,
  file_format text not null,
  duration_sec integer,
  bpm integer,
  sample_rate_hz integer,
  resolution text
);

create table if not exists product_media (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'audio', 'video')),
  url text not null,
  alt text not null default '',
  is_primary boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists tags (
  id text primary key,
  slug text not null unique,
  name text not null
);

create table if not exists product_tags (
  product_id text not null references products(id) on delete cascade,
  tag_id text not null references tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

create table if not exists orders (
  id text primary key,
  user_id text not null references users(id),
  status text not null check (status in ('pending', 'paid', 'failed', 'refunded')),
  subtotal_jpy integer not null,
  tax_jpy integer not null,
  total_jpy integer not null,
  payment_provider text,
  payment_intent_id text unique,
  ordered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text references products(id),
  product_slug_snapshot text not null,
  product_name_snapshot text not null,
  unit_price_jpy integer not null,
  quantity integer not null default 1
);

create table if not exists download_grants (
  id text primary key,
  order_item_id text not null references order_items(id) on delete cascade,
  user_id text not null references users(id),
  download_token_hash text not null,
  expires_at timestamptz not null,
  max_download_count integer not null default 3,
  downloaded_count integer not null default 0,
  last_downloaded_at timestamptz
);

create table if not exists chat_sessions (
  id text primary key,
  user_id text not null references users(id),
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id text primary key,
  session_id text not null references chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  token_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category_published
  on products (category_id, is_published, published_at desc);

create index if not exists idx_orders_user_ordered
  on orders (user_id, ordered_at desc);

create index if not exists idx_order_items_order
  on order_items (order_id);

create index if not exists idx_download_grants_user_expires
  on download_grants (user_id, expires_at);

create index if not exists idx_product_tags_tag_product
  on product_tags (tag_id, product_id);

create index if not exists idx_chat_messages_session_created
  on chat_messages (session_id, created_at);
