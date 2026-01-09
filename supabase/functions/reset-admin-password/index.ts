import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Admin password - separate from regular users
const ADMIN_PASSWORD = "Lux11karin";
const ADMIN_EMAIL = "charllys777@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Find the admin user
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const adminUser = users.find(u => u.email === ADMIN_EMAIL);
    if (!adminUser) {
      return new Response(
        JSON.stringify({ error: "Admin user not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Reset admin password
    await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
      password: ADMIN_PASSWORD,
    });

    console.log(`Admin password reset for: ${ADMIN_EMAIL}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Senha do admin resetada com sucesso`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
