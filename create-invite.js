import dotenv from "dotenv";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Mangler SUPABASE_URL eller SUPABASE_SECRET_KEY i .env");
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const count = Math.max(1, Math.min(50, Number(process.argv[2] || 1)));
const baseUrl = (process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, "");

for (let i = 0; i < count; i++) {
  const code = crypto.randomBytes(18).toString("base64url");
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  const { error } = await supabase.from("invites").insert({ code_hash: codeHash });
  if (error) throw error;
  console.log(`Invitasjon ${i + 1}: ${baseUrl}/?invite=${code}`);
}
