import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const targetBase = process.env.VITE_API_URL || 'https://movu-back.onrender.com/api/v1';
  const targetPath = Array.isArray(path) ? path.join('/') : path;
  const targetUrl = `${targetBase}/${targetPath}`;

  try {
    const fetchRes = await fetch(targetUrl, {
      method: req.method,
      headers: { ...req.headers, host: undefined },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    const data = await fetchRes.arrayBuffer();
    res.status(fetchRes.status);
    fetchRes.headers.forEach((value, key) => {
      // don't forward hop-by-hop headers
      if (['transfer-encoding', 'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailers', 'upgrade'].includes(key)) return;
      res.setHeader(key, value);
    });
    res.send(Buffer.from(data));
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Proxy error' });
  }
}
