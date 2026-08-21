import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, imageBase64, mode } = await req.json();

    const keys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
    ].filter(Boolean) as string[];

    if (keys.length === 0) {
      return NextResponse.json({ error: "Configuration Error: No Groq API keys found on the server." }, { status: 500 });
    }

    // Prepare Groq Payload
    const model = imageBase64 ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile";
    
    let messages = [];
    if (imageBase64) {
      messages = [
        {
          role: "user",
          content: [
            { type: "text", text: prompt || "Describe this image in detail." },
            { type: "image_url", image_url: { url: imageBase64 } }
          ]
        }
      ];
    } else {
      messages = [
        {
          role: "system",
          content: mode === 'UNDERSTAND' 
            ? "You are an accessibility assistant. Simplify the user's text based on their request. Return ONLY the simplified text, no conversational filler."
            : "You are an accessibility assistant. Help the user."
        },
        {
          role: "user",
          content: prompt
        }
      ];
    }

    // Fallback logic
    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];
      
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${currentKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.3,
            max_tokens: 1024
          })
        });

        if (res.status === 429) {
          console.warn(`Groq Key ${i + 1} rate limited. Falling back...`);
          continue; // Try next key
        }

        if (!res.ok) {
          const err = await res.text();
          console.error(`Groq API Error on Key ${i + 1}:`, err);
          
          // If we are on the last key, return the actual error so the frontend can see it
          if (i === keys.length - 1) {
            return NextResponse.json({ error: `Groq API Error: ${res.status} - ${err}` }, { status: res.status });
          }
          continue; 
        }

        const data = await res.json();
        return NextResponse.json({ result: data.choices[0].message.content });
        
      } catch (e) {
        console.error(`Network error on Key ${i + 1}`, e);
        if (i === keys.length - 1) {
           return NextResponse.json({ error: `Network fetch failed: ${e}` }, { status: 500 });
        }
        continue;
      }
    }

    return NextResponse.json({ error: "RATE_LIMIT_REACHED" }, { status: 429 });

  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
