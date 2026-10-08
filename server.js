import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

// Target upstream hosts for proxying
const PINBOT_HOST = 'https://partnersV1.pinbot.ai';
const WHATSAPP_MMG_HOST = 'https://mmg.whatsapp.net';

async function handleProxy(req, res, targetBaseUrl, prefix) {
  const targetPath = req.url.replace(new RegExp(`^${prefix}`), '');
  const targetUrl = `${targetBaseUrl}${targetPath}`;

  // Forward incoming headers except host
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
      headers[key] = value;
    }
  }

  // Read request body for POST/PUT/PATCH
  let body = null;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    body = Buffer.concat(chunks);
  }

  try {
    const proxyRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: 'follow',
    });

    // Send response headers
    res.writeHead(proxyRes.status, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': proxyRes.headers.get('content-type') || 'application/json',
    });

    const arrayBuffer = await proxyRes.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error(`[Proxy Error] ${req.method} ${targetUrl}:`, err);
    res.writeHead(502, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({ error: `Proxy failed: ${err.message}` }));
  }
}

function serveStatic(req, res) {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(DIST_DIR, reqPath);

  // Check if file exists
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // SPA fallback to index.html
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found - Build the frontend first (npm run build)');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // Handle CORS preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
    res.end();
    return;
  }

  if (req.url.startsWith('/api-pinbot')) {
    handleProxy(req, res, PINBOT_HOST, '/api-pinbot');
  } else if (req.url.startsWith('/api-whatsapp-mmg')) {
    handleProxy(req, res, WHATSAPP_MMG_HOST, '/api-whatsapp-mmg');
  } else {
    serveStatic(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`WhatsApp Flow Studio server running on port ${PORT}`);
});
