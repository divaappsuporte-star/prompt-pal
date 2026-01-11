import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.0";

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Faz uma consulta simples para manter o banco ativo
    const { data, error } = await supabase.from("profiles").select("id").limit(1);

    if (error) throw error;

    console.log("Ping realizado com sucesso. Banco de dados ativo!");
    return new Response(JSON.stringify({ success: true, message: "Keep-alive successful" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
