export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send("Falta el ID del canal");

  try {
    // Usamos un User-Agent de navegador real para que YouTube no nos bloquee
    const response = await fetch(`https://www.youtube.com/channel/${id}/live`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await response.text();
    
    // Buscamos el enlace dentro de la respuesta de YouTube
    const m3u8Match = html.match(/hlsManifestUrl":"(https:\/\/[\w\.\-\/]+\.m3u8)"/);
    
    if (m3u8Match) {
      const streamUrl = m3u8Match[1];
      res.redirect(302, streamUrl);
    } else {
      // Intento alternativo buscando en el objeto JSON de YouTube
      const jsonMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
      if (jsonMatch) {
        const playerResponse = JSON.parse(jsonMatch[1]);
        const hlsUrl = playerResponse.streamingData?.hlsManifestUrl;
        if (hlsUrl) {
          return res.redirect(302, hlsUrl);
        }
      }
      res.status(404).send("YouTube no devolvió un enlace HLS. Prueba de nuevo en unos segundos.");
    }
  } catch (error) {
    res.status(500).send("Error de conexión: " + error.message);
  }
}
