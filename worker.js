// Listen for incoming requests
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // 1. Handle CORS Preflight Options
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
      },
    });
  }

  // 2. Handle Actual Video Payload POST
  if (request.method === "POST") {
    try {
      const bodyText = await request.text();
      const targetUrl = "https://zecora0.serv00.net/ai/Sora2_s4.php";

      // Fire direct fetch to target API with disguised browser headers
      const apiResponse = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        },
        body: bodyText
      });

      const rawData = await apiResponse.text();
      let jsonData;

      try {
        jsonData = JSON.parse(rawData);
      } catch (e) {
        jsonData = { raw_output: rawData };
      }

      // Inject your elite developer signature into the JSON
      jsonData.developer = "Developed by Ramzan Ahsan";
      jsonData.powered_by = "Ramzan Ahsan Core Engine";

      return new Response(JSON.stringify(jsonData), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "X-Developer": "Ramzan Ahsan"
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Edge network pipeline timeout.",
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

  return new Response("Method not allowed on this channel.", { status: 405 });
}
