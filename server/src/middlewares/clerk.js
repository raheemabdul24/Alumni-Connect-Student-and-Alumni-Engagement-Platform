// Placeholder for Clerk middleware integration
// In production, replace with actual Clerk JWT verification

const clerkAuth = (req, res, next) => {
  // TODO: Integrate @clerk/backend-sdk for token verification
  // const { getAuth } = require('@clerk/backend');
  // const auth = getAuth(req);
  // if (!auth.userId) return res.status(401).json({ error: 'Unauthorized' });
  // req.user = { id: auth.userId, role: 'student' }; // fetch role from DB
  
  // For now, use headers-based dev auth (handled by auth.js)
  next();
};

module.exports = { clerkAuth };
