// middleware/rateLimit.js

const rateLimit = () => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW) || 900000;
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX) || 100;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const requestTimestamps = requests.get(ip);
    const recentRequests = requestTimestamps.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          message: 'Too many requests, please try again later'
        }
      });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);
    next();
  };
};

module.exports = rateLimit;