export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.user) { // Ensure the user is authenticated and has tokens
      return next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };