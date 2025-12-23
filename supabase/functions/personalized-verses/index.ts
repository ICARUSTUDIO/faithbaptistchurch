import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { readingHistory, bookmarkedBooks, currentBook, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "daily_verse") {
      systemPrompt = `You are a wise biblical scholar and spiritual guide for Faith Baptist Church. 
      Based on the user's reading habits and interests, suggest a daily verse that would be meaningful to them.
      Always include:
      1. The verse reference (book chapter:verse)
      2. The full verse text
      3. A personalized reflection on why this verse is relevant to them
      4. A short prayer or meditation prompt
      
      Format your response as JSON with keys: verseReference, verseText, reflection, prayer`;
      
      userPrompt = `The user has been reading: ${readingHistory?.join(", ") || "various books"}.
      They have bookmarked verses from: ${bookmarkedBooks?.join(", ") || "various books"}.
      Currently reading: ${currentBook || "the Bible"}.
      
      Suggest a personalized verse for today that connects with their spiritual journey.`;
    } else if (type === "reading_suggestions") {
      systemPrompt = `You are a biblical study guide for Faith Baptist Church.
      Based on the user's reading patterns, suggest related passages and books they might enjoy.
      Provide 3-5 suggestions with brief explanations of why they might resonate.
      
      Format as JSON with key: suggestions (array of {book, chapter, reason})`;
      
      userPrompt = `The user has been reading: ${readingHistory?.join(", ") || "various books"}.
      Bookmarked: ${bookmarkedBooks?.join(", ") || "nothing yet"}.
      
      What should they read next to deepen their understanding?`;
    } else {
      systemPrompt = `You are a compassionate biblical wisdom guide for Faith Baptist Church.
      Provide encouragement and biblical insights tailored to the user's spiritual journey.`;
      
      userPrompt = readingHistory?.length > 0 
        ? `Based on their interest in ${readingHistory.join(", ")}, share words of wisdom.`
        : "Share an encouraging word for today's journey.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Try to parse as JSON, otherwise return as text
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                        content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      result = JSON.parse(jsonStr);
    } catch {
      result = { message: content };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("personalized-verses error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
