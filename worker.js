addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // 1. Handle CORS Preflight Configurations
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
      },
    });
  }

  const url = new URL(request.url);

  // 2. GET METHOD (Direct Browser URL Testing Support)
  if (request.method === "GET") {
    const promptParam = url.searchParams.get("prompt");
    const aspectParam = url.searchParams.get("aspect") || "16:9";

    if (promptParam) {
      return await forwardToTargetAPI({ prompt: promptParam, aspect: aspectParam });
    }

    // Modern Test Interface for Browser
    const htmlUI = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Aura AI Engine - Direct Tester</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: system-ui, sans-serif; background: #0b0f19; color: #fff; padding: 30px; text-align: center; }
        .box { max-width: 400px; margin: 50px auto; background: #131a2c; padding: 30px; border-radius: 16px; border: 1px solid #22314d; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h2 { margin-bottom: 5px; font-size: 22px; color: #38bdf8; }
        p { font-size: 11px; color: #64748b; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
        input, select, button { width: 100%; padding: 12px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #22314d; background: #0b0f19; color: #fff; box-sizing: border-box; }
        button { background: #38bdf8; color: #0b0f19; font-weight: bold; border: none; cursor: pointer; transition: 0.2s; text-transform: uppercase; }
        button:hover { background: #0ea5e9; }
      </style>
    </head>
    <body>
      <div class="box">
        <h2>Aura AI Video Test Channel</h2>
        <p>Developed by Ramzan Ahsan</p>
        <form action="${url.origin}/" method="GET">
          <input type="text" name="prompt" placeholder="Enter prompt..." required>
          <select name="aspect">
            <option value="16:9">16:9 Landscape</option>
            <option value="9:16">9:16 Portrait</option>
          </select>
          <button type="submit">Run Direct API Test</button>
        </form>
      </div>
    </body>
    </html>
    `;
    return new Response(htmlUI, { headers: { "Content-Type": "text/html" } });
  }

  // 3. POST METHOD (For backend requests)
  if (request.method === "POST") {
    try {
      const bodyText = await request.text();
      const parsedBody = JSON.parse(bodyText);
      return await forwardToTargetAPI(parsedBody);
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: "Invalid JSON payload structure." }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }

  return new Response("Method context rejected.", { status: 405 });
}

async function forwardToTargetAPI(payloadData) {
  const targetApiUrl = "https://zecora0.serv00.net/ai/Sora2_s4.php";

  try {
    const apiResponse = await fetch(targetApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({
        prompt: payloadData.prompt,
        aspect: payloadData.aspect || "16:9"
      })
    });

    const responseText = await apiResponse.text();
    let originalJson;

    try {
      originalJson = JSON.parse(responseText);
    } catch (jsonErr) {
      originalJson = {};
    }

    // Pure Filter Structure: Sirf wahi fields bachaayein jo aapko chahiye
    const filteredResponse = {
      success: originalJson.success || false,
      UrlVideo: originalJson.UrlVideo || "",
      developer: "Developed by Ramzan Ahsan"
    };

    return new Response(JSON.stringify(filteredResponse), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-Developer": "Ramzan Ahsan"
      },
    });

  } catch (networkError) {
    return new Response(JSON.stringify({ 
      success: false, 
      UrlVideo: "",
      developer: "Developed by Ramzan Ahsan"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
