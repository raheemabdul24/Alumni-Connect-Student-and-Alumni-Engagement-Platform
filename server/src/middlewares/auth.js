const { verifyToken } = require('@clerk/backend');
const User = require('../models/user');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Auth: Missing or invalid authorization header');
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    let decoded;
    try {
      decoded = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY
      });
    } catch (tokenErr) {
      console.error('Clerk token verification error:', tokenErr.message);
      return res.status(401).json({ error: 'Invalid or expired token', details: tokenErr.message });
    }

    const clerkId = decoded.sub;
    if (!clerkId) {
      console.error('Auth: No clerkId (sub) in token');
      return res.status(401).json({ error: 'Invalid token: no subject' });
    }
    
    // Extract email from JWT first
    let email = decoded.email || 
                decoded.email_addresses?.[0]?.email_address ||
                decoded.primary_email_address?.email_address ||
                null;

    // If email not in JWT, fetch from Clerk API
    if (!email) {
      try {
        console.log(`Fetching user from Clerk API: ${clerkId}`);
        const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (!clerkResponse.ok) {
          const errText = await clerkResponse.text();
          throw new Error(`Clerk API error ${clerkResponse.status}: ${errText}`);
        }

        const clerkUser = await clerkResponse.json();
        
        // Extract email from Clerk user object
        email = clerkUser.email_addresses?.[0]?.email_address ||
                clerkUser.primary_email_address?.email_address ||
                clerkUser.email ||
                null;

        if (!email) {
          console.error(`Clerk user ${clerkId} has no email addresses. User data:`, {
            id: clerkUser.id,
            email_addresses: clerkUser.email_addresses,
            primary_email_address: clerkUser.primary_email_address
          });
          return res.status(401).json({ error: 'No email found for Clerk user' });
        }

        console.log(`✅ Got email from Clerk API: ${email}`);
      } catch (clerkErr) {
        console.error(`Error fetching from Clerk API: ${clerkErr.message}`);
        return res.status(401).json({ error: 'Failed to verify user with auth provider', details: clerkErr.message });
      }
    }

    // Find user: first try by clerkId, then by email (for seeded/migrated users)
    let user = await User.findOne({ where: { clerkId } });
    let isNew = false;

    if (!user && email) {
      // Check if a user exists with this email but no clerkId (seeded user)
      user = await User.findOne({ where: { email } });
      if (user) {
        // Link the existing user to this Clerk account
        user.clerkId = clerkId;
        if (decoded.name && (!user.name || user.name === email.split('@')[0])) {
          user.name = decoded.name;
        }
        // Existing/seeded users already have a role assigned
        if (!user.roleSelected) {
          user.roleSelected = true;
        }
        await user.save();
        console.log(`✅ Linked existing user ${user.id} (${email}) to clerkId: ${clerkId}`);
      }
    }

    if (!user) {
      // Create brand new user
      user = await User.create({
        clerkId,
        name: decoded.name || email.split('@')[0] || 'User',
        email: email,
        role: 'student',
        verified: decoded.email_verified || true,
        roleSelected: false
      });
      isNew = true;
      console.log(`✅ Created new user ${user.id} from Clerk: ${email}`);
    }

    // Update user if email changed
    if (user.email !== email) {
      console.log(`Updating user ${user.id} email: ${user.email} → ${email}`);
      user.email = email;
      await user.save();
    }

    req.user = {
      id: user.id,
      clerkId,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error('Auth error:', err.message || err);
    res.status(401).json({ error: 'Authentication failed', details: err.message });
  }
};

module.exports = { requireAuth };
