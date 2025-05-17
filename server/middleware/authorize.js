const { expressjwt: jwt } = require('express-jwt');
const { secret } = require('../config.json');
const db = require('../helpers/db');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ 
            secret, 
            algorithms: ['HS256'],
            credentialsRequired: true,
            requestProperty: 'auth',
            getToken: function fromHeaderOrQuerystring(req) {
                if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                    return req.headers.authorization.split(' ')[1];
                }
                return null;
            }
        }),

        // authorize based on user role
        async (req, res, next) => {
            try {
                console.log('Auth from token:', req.auth);
                if (!req.auth || !req.auth.id) {
                    return res.status(401).json({ message: 'Invalid token' });
                }

                const account = await db.Account.findByPk(req.auth.id);
                console.log('Found account:', account);

                if (!account || (roles.length && !roles.includes(account.role))) {
                    // account no longer exists or role not authorized
                    console.log('Authorization failed:', { account, roles });
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                // authentication and authorization successful
                req.user = {
                    id: account.id,
                    role: account.role
                };
                const refreshTokens = await account.getRefreshTokens();
                req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
                next();
            } catch (err) {
                console.error('Authorization error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
    ];
}
