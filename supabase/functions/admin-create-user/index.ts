import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== Admin Create User - Starting ===");
    
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("ERROR: Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const token = authHeader.replace("Bearer ", "");
    console.log("Token length:", token.length);

    // Create Supabase clients
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create admin client with service role key (bypasses RLS)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify the token using admin client
    console.log("Verifying token...");
    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.log("ERROR: Invalid token -", userError?.message || "No user found");
      return new Response(
        JSON.stringify({ error: "Sessão expirada. Faça logout e login novamente." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const callingUser = userData.user;
    console.log("Calling user ID:", callingUser.id, "Email:", callingUser.email);

    // Check if calling user is an admin using admin client to bypass RLS

    // Check if calling user is an admin using admin client to bypass RLS
    console.log("Checking admin role...");
    const { data: roleData, error: roleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callingUser.id)
      .in("role", ["super_admin", "admin"])
      .maybeSingle();

    console.log("Role check result:", roleData, "Error:", roleError?.message);

    if (roleError || !roleData) {
      console.log("ERROR: User is not an admin");
      return new Response(
        JSON.stringify({ error: "Você não tem permissão para criar usuários" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.log("User has admin role:", roleData.role);

    // Default password for all users - simplified email-only login
    const DEFAULT_PASSWORD = "nutri21@2025";

    // Parse request body
    console.log("Parsing request body...");
    const { email, fullName } = await req.json();

    if (!email || !fullName) {
      console.log("ERROR: Missing email or fullName");
      return new Response(
        JSON.stringify({ error: "Email e nome completo são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.log("Creating user:", email, fullName);

    const password = DEFAULT_PASSWORD;

    // Create the user
    console.log("Calling admin.createUser...");
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
      },
    });

    if (createError) {
      console.log("ERROR: Failed to create user -", createError.message);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.log("User created successfully:", newUser.user?.id);

    // The profile should be created automatically by the handle_new_user trigger
    // But let's update the full_name just in case
    if (newUser.user) {
      console.log("Updating profile with full_name...");
      await adminClient
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", newUser.user.id);
    }

    console.log("=== Admin Create User - Success ===");
    return new Response(
      JSON.stringify({ 
        success: true, 
        user: { 
          id: newUser.user?.id, 
          email: newUser.user?.email 
        } 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("=== Admin Create User - Error ===", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
