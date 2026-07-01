-- Ejecutar en SQL Editor de Supabase

create table productos (
  id serial primary key,
  nombre text not null,
  precio numeric(10,2) not null,
  color text not null,
  tipo text not null check (tipo in ('pulsera', 'anillo')),
  created_at timestamptz default now()
);

create table ventas (
  id serial primary key,
  producto_id integer not null references productos(id),
  cantidad integer not null check (cantidad > 0),
  fecha date default current_date
);

create table colores (
  nombre text primary key
);

create table precios_base (
  tipo text primary key check (tipo in ('pulsera', 'anillo')),
  precio numeric(10,2) not null
);

-- Deshabilitar RLS (el backend usa service_role, no necesita RLS)
alter table productos disable row level security;
alter table ventas disable row level security;
alter table colores disable row level security;
alter table precios_base disable row level security;

-- Insertar datos iniciales
insert into colores (nombre) values
  ('Dorado'), ('Plateado'), ('Oro Rosa'), ('Negro'),
  ('Blanco'), ('Rojo'), ('Azul'), ('Verde')
on conflict (nombre) do nothing;

insert into precios_base (tipo, precio) values
  ('pulsera', 0), ('anillo', 0)
on conflict (tipo) do nothing;
