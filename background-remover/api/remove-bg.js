const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const { image_url } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: 'Falta el campo image_url en el body.' });
  }

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url,
        size: 'auto',
        format: 'png'
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(response.status).json({
        error: 'Error en la API de remove.bg',
        details: errorBody
      });
    }

    const buffer = await response.buffer();
    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(buffer);

  } catch (err) {
    return res.status(500).json({
      error: 'Error interno al conectar con remove.bg',
      message: err.message
    });
  }
};
