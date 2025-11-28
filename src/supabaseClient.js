import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const MODEL_BASE_URL = `${supabaseUrl}/storage/v1/object/public/3dWeb-models/`;

export const getModelUrl = (fileName) => {
    if(!fileName) return "";
    return `${MODEL_BASE_URL}${fileName}`;
}