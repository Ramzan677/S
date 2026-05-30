addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // 1. Handle CORS Preflight Configurations
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
      },
    });
  }

  // 2. Process Video Creation Pipeline via POST Method
  if (request.method === "POST") {
    try {
      const bodyPayload = await request.text();
      const targetApiUrl = "https://zecora0.serv00.net/ai/Sora2_s4.php";

      // Disguise requests through native clean cloudflare IPs
      const apiResponse = await fetch(targetApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        },
        body: bodyPayload
      });

      const responseText = await apiResponse.text();
      let compiledJson;

      try {
        compiledJson = JSON.parse(responseText);
      } catch (jsonErr) {
        compiledJson = { raw_data_stream: responseText };
      }

      // Injecting explicit ownership signatures into application stream
      compiledJson.developer = "Developed by Ramzan Ahsan";
      compiledJson.infrastructure = "Ramzan Ahsan Premium Engine";

      return new Response(JSON.stringify(compiledJson), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "X-Developer-Signature": "Ramzan Ahsan"
        },
      });

    } catch (networkError) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Edge synchronization failure.",
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

  return new Response("Method context rejected.", { status: 405 });
}
