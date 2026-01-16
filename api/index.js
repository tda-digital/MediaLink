export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send("Falta el ID del canal");

  try {
    const response = await fetch(`https://www.youtube.com/channel/${id}/live`);
    const html = await response.text();
    
    // Nueva búsqueda mejorada para 2026
    const regex = /"hlsManifestUrl":"(https:[^"]+?\.m3u8)"/;
    const match = html.match(regex);
    
    if (match) {
      const m3u8Url = match[1].replace(/\\/g, '');
      res.redirect(302, m3u8Url);
    } else {
      // Intento secundario si el primero falla
      const altRegex = /"hlsManifestUrl":"([^"]+)"/;
      const altMatch = html.match(altRegex);
      if (altMatch) {
         res.redirect(302, altMatch[1].replace(/\\/g, ''));
      } else {
         res.status(404).send("YouTube no devolvió un enlace HLS. Asegúrate de que el canal esté realmente En Vivo.");
      }
    }
  } catch (error) {
    res.status(500).send("Error de conexión con YouTube");
  }
}
