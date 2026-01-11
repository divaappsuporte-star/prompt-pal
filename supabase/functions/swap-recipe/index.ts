import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RecipeSwapRequest {
  currentRecipe: {
    name: string;
    calories: number;
    protein: number;
    fat: number;
    carbs?: number;
  };
  dietType: string;
  mealType: string;
  userPreferences?: {
    avoid?: string[];
    prefer?: string[];
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentRecipe, dietType, mealType, userPreferences } = await req.json() as RecipeSwapRequest;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Você é um nutricionista especializado em dietas ${dietType}. 
Sua tarefa é sugerir uma receita alternativa que mantenha valores nutricionais similares.

REGRAS OBRIGATÓRIAS:
1. A receita DEVE seguir as regras da dieta ${dietType}
2. Mantenha calorias com variação máxima de ±50 kcal
3. Mantenha proteína com variação máxima de ±5g
4. Para dietas low carb/keto/carnívora, mantenha carboidratos mínimos
5. Use ingredientes simples e acessíveis no Brasil
6. Forneça instruções claras e concisas

FORMATO DE RESPOSTA (JSON apenas):
{
  "name": "Nome da Receita",
  "calories": número,
  "protein": número,
  "fat": número,
  "carbs": número,
  "instructions": "Instruções passo a passo",
  "reason": "Breve explicação de por que essa é uma boa troca"
}`;

    const userMessage = `Preciso de uma receita alternativa para ${mealType}.

RECEITA ATUAL:
- Nome: ${currentRecipe.name}
- Calorias: ${currentRecipe.calories} kcal
- Proteína: ${currentRecipe.protein}g
- Gordura: ${currentRecipe.fat}g
- Carboidratos: ${currentRecipe.carbs || 0}g

${userPreferences?.avoid?.length ? `EVITAR: ${userPreferences.avoid.join(', ')}` : ''}
${userPreferences?.prefer?.length ? `PREFERIR: ${userPreferences.prefer.join(', ')}` : ''}

Sugira uma receita diferente mas com valores nutricionais similares.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Entre em contato com o suporte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Erro ao gerar receita alternativa");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("Resposta vazia da IA");
    }

    // Parse JSON from response
    let newRecipe;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        newRecipe = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("JSON not found in response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError, "Content:", content);
      throw new Error("Erro ao processar resposta da IA");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        recipe: newRecipe 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("swap-recipe error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
