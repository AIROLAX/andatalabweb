// GET /api/geo  ->  { country, region, city }
// País aproximado desde los headers de Vercel. No se guarda la IP.
module.exports = function (req, res) {
  var h = req.headers || {};
  var country = String(h['x-vercel-ip-country'] || '').toUpperCase();
  var region = h['x-vercel-ip-country-region'] || '';
  var city = '';
  try { city = decodeURIComponent(h['x-vercel-ip-city'] || ''); }
  catch (e) { city = h['x-vercel-ip-city'] || ''; }

  var host = String(h.host || '').split(':')[0];
  var local = host === 'localhost' || host === '127.0.0.1';
  if (local) {
    try {
      var raw = req.url || '';
      var qi = raw.indexOf('?');
      if (qi !== -1) {
        var q = raw.slice(qi + 1);
        q.split('&').forEach(function (pair) {
          var p = pair.split('=');
          if (p[0] === 'geo' && p[1] && /^[a-zA-Z]{2}$/.test(p[1])) {
            country = p[1].toUpperCase();
          }
        });
      }
    } catch (e) {}
  }

  res.setHeader('Cache-Control', 'private, no-store');
  res.status(200).json({ country: country, region: region, city: city });
};
