import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const out: any = { url };
  try {
    const r = await fetch(`${url}/rest/v1/products?select=id`);
    out.rawFetch = `ok ${r.status}`;
  } catch (e: any) { out.rawFetch = `fail ${e?.cause?.code || e?.message}`; }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").select("id").eq("slug", "iphone-15-pro").single();
    out.supabase = error ? `err ${error.message}` : `ok ${data?.id}`;
  } catch (e: any) { out.supabase = `throw ${e?.cause?.code || e?.message}`; }
  return NextResponse.json(out);
}
