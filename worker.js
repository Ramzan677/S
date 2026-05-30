export default {
  async fetch(request, env, ctx) {
    // 1. Handling CORS requests for your browser
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
        },
      });
    }

    // 2. Handling Actual POST Request
    if (request.method === "POST") {
      try {
        const bodyText = await request.text();
        const targetUrl = "https://zecora0.serv00.net/ai/Sora2_s4.php";

        // Hit target api with clean browser headers
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
        } catch(e) {
          jsonData = { raw_output: rawData };
        }

        // Injecting your branding signature into the API response object
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
          error: "Edge connection issue.",
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

    return new Response("Method not allowed", { status: 405 });
  }
};
