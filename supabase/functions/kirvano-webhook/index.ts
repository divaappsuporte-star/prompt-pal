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
    console.log("=== Kirvano Webhook - Starting ===");
    
    const payload = await req.json();
    console.log("Payload received:", JSON.stringify(payload));

    // Kirvano sends event type in 'event' field
    // We are looking for 'order.paid' or similar. 
    // Based on common Kirvano webhooks, we check the status.
    const event = payload.event;
    const data = payload.data;

    if (!data || !data.customer || !data.customer.email) {
      console.log("ERROR: Missing customer email in payload");
      return new Response(
        JSON.stringify({ error: "Missing customer email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const customerEmail = data.customer.email;
    const customerName = data.customer.name || "Cliente Kirvano";
    const productExternalId = data.product?.id; // ID do produto na Kirvano
    
    // Map Kirvano product IDs to your diet types
    // You should update these IDs with your real Kirvano product IDs
    const productMapping: Record<string, string> = {
      "PROD_ID_CARNIVORE": "carnivore",
      "PROD_ID_KETO": "keto",
      "PROD_ID_LOWCARB": "lowcarb",
      "PROD_ID_METABOLIC": "metabolic",
      "PROD_ID_DETOX": "detox",
      "PROD_ID_FASTING": "fasting",
    };

    const dietType = productMapping[productExternalId] || "metabolic"; // Default or mapped

    // Create Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Find or Create User
    console.log(`Processing for email: ${customerEmail}`);
    
    // Check if user exists
    const { data: users, error: userSearchError } = await adminClient.auth.admin.listUsers();
    if (userSearchError) throw userSearchError;

    let user = users.users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());

    if (!user) {
      console.log("User not found, creating new user...");
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: customerEmail,
        password: "nutri21@2025", // Default password as seen in other functions
        email_confirm: true,
        user_metadata: { full_name: customerName }
      });
      
      if (createError) throw createError;
      user = newUser.user;
      console.log("New user created:", user.id);
    } else {
      console.log("Existing user found:", user.id);
    }

    // 2. Grant Access
    console.log(`Granting access to ${dietType} for user ${user.id}`);
    
    const { error: accessError } = await adminClient
      .from("user_diet_access")
      .upsert({
        user_id: user.id,
        diet_type: dietType,
        granted_by: 'payment',
        payment_id: data.id || 'kirvano_payment'
      }, {
        onConflict: 'user_id,diet_type'
      });

    if (accessError) {
      console.error("Error granting access:", accessError);
      throw accessError;
    }

    console.log("=== Kirvano Webhook - Success ===");
    return new Response(
      JSON.stringify({ success: true, message: "Access granted" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("=== Kirvano Webhook - Error ===", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
