import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ykiwsxkycybntfjklxvk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xNppxTspkRGmNbfvNCyhKw_O5dRLkSm";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
