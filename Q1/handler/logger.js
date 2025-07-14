const axios = require('axios');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyYXVuaXRyYWoyMzM2QGdtYWlsLmNvbSIsImV4cCI6MTc1MjQ3MDA1NSwiaWF0IjoxNzUyNDY5MTU1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYTgxYmE5NjctYjMzNS00OGY3LWEyYTktYmYzMTE0MjhlOWU2IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicmF1bml0IHJhaiIsInN1YiI6ImExZjczMTI2LTFjYTMtNDhhNy1hNWMwLTg0OTQ4MjM0NTNhMyJ9LCJlbWFpbCI6InJhdW5pdHJhajIzMzZAZ21haWwuY29tIiwibmFtZSI6InJhdW5pdCByYWoiLCJyb2xsTm8iOiIxMjIwMzEyNSIsImFjY2Vzc0NvZGUiOiJDWnlwUUsiLCJjbGllbnRJRCI6ImExZjczMTI2LTFjYTMtNDhhNy1hNWMwLTg0OTQ4MjM0NTNhMyIsImNsaWVudFNlY3JldCI6InByekt1cE16SlJFVkRac0oifQ.y5ijY5ktgp9CqGLOhTSWb26g-oav6uF3kbtHJHYjbJk';

const log = async (lvl, section, msg) => {
  try {
    await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      {
        stack: 'backend',
        level: lvl,
        package: section,
        message: msg
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );
  } catch (e) {
    console.log('[LOGGING ERROR]', e.message);
  }
};

const loggerMiddleware = (req, res, next) => {
  log('info', 'route', `${req.method} -> ${req.originalUrl}`);
  next();
};

module.exports = {
  log,
  loggerMiddleware
};
