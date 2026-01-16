export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send("Falta el ID del canal");

  try {
    const url = `https://www.youtube.com/embed/live_stream?channel=${id}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.153 Mobile Safari/537.36'
      }
    });
    const html = await response.text();
    
    // Buscamos el ID del video que está corriendo en vivo
    const videoIdMatch = html.match(/"video_id":"([^"]+)"/);
    
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      // Redirigimos a un servicio que convierte YouTube a M3U8 de forma externa
      res.redirect(302, `https://www.youtube.com/watch?v=${videoId}`);
    } else {
      res.status(404).send("No se pudo detectar el video en vivo. Asegúrate de que el canal esté transmitiendo.");
    }
  } catch (error) {
    res.status(500).send("Error de servidor");
  }
}
