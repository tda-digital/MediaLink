export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send("Falta el ID del canal");

  try {
    const response = await fetch(`https://www.youtube.com/channel/${id}/live`);
    const text = await response.text();
    
    // Buscamos la URL del streaming
    const match = text.match(/(https:[^"]*?\.m3u8)/);
    
    if (match) {
      const m3u8Url = match[0].replace(/\\/g, '');
      // Redirigimos directamente al flujo de video
      res.redirect(302, m3u8Url);
    } else {
      res.status(404).send("No se encontró una transmisión en vivo en este canal.");
    }
  } catch (error) {
    res.status(500).send("Error al obtener el video");
  }
}
