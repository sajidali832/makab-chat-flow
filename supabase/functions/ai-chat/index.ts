
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, withSearch = false, context = [] } = await req.json();
    
    console.log('Received chat request:', { message, withSearch, contextLength: context.length });

    let systemPrompt = `You are Makab, a helpful AI assistant created by Sajid. You provide clear, concise, and helpful responses to user questions. Always respond with appropriate emojis to make conversations engaging and friendly. You remember the context of previous messages in this conversation to provide better continuity.

Key personality traits:
- Friendly and helpful 😊
- Use emojis naturally in responses 
- Remember conversation context
- Provide clear and concise answers
- Be engaging and personable

Remember: You are Makab, built by Sajid, and you should maintain a consistent personality throughout the conversation.`;
    
    if (withSearch) {
      systemPrompt += " The user has requested a web search. Please indicate that you would search for relevant information and provide a comprehensive response based on general knowledge about the topic, enhanced with web search context. 🔍";
    }

    // Build conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...context,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://makab-chat.lovable.app',
        'X-Title': 'Makab - AI Chat Assistant',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-8b-instruct:free',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenRouter response received');
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get AI response',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
