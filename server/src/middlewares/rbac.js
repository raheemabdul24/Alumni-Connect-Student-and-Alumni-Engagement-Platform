const permit = (...allowed) => {
  return (req, res, next) => {
    const { role } = req.user || {};
    if (!role) return res.status(403).json({ error: 'No role found' });
    if (allowed.includes(role)) return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
};

module.exports = { permit };
