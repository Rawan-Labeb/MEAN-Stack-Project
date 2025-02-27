const {verifyToken, decodedToken} = require("../utils/jwttoken.manager");

const authenticaiton = async (req, res, next) => {
    try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Checking authentication token:', token ? 'Present' : 'Missing');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.id);
    console.log('User details:', {
      id: user._id,
      role: user.role,
      isActive: user.isActive,
      email: user.email
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
        }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Can not make this operation User Not Active' });
    }

    req.user = user;
        next();

    } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
}
};

module.exports = {
    authenticaiton
}

