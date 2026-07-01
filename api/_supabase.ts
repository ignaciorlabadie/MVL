import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key);
}

export const supabase = getClient();
