const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        const userRole = req.user.role || 'patient';

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
                }
            });
        }

        next();
    };
};

const requireVerified = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required'
            }
        });
    }

    if (req.user.role === 'doctor' && !req.user.verified) {
        return res.status(403).json({
            success: false,
            error: {
                code: 'NOT_VERIFIED',
                message: 'Doctor account pending verification'
            }
        });
    }

    next();
};

const requireActive = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required'
            }
        });
    }

    if (req.user.status !== 'active') {
        return res.status(403).json({
            success: false,
            error: {
                code: 'ACCOUNT_INACTIVE',
                message: 'Your account is inactive. Please contact support.'
            }
        });
    }

    next();
};

module.exports = {
    requireRole,
    requireVerified,
    requireActive
};
