const isAdmin = (req, res, next) => {
    const userAdmin = req.user.role
    if(!req.user){
      req.logger.error("Inicia session para proceder")
      res.status(400).send({
        status: "Error",
        message: "Inicia session para proceder"
      });
      return
    };
    if (userAdmin !== 'admin') {
      req.logger.error("No tienes los permisos necesarios para realizar esta acción")
      res.status(400).send({
        status: "Error",
        message: "No tienes los permisos necesarios para realizar esta acción"
      });
      return
    };
    next()
  };
  
  const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado. Solo los usuarios pueden realizar esta acción.' });
    }
  };
  
  const isUserOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'user')) {
    } else {
      res.status(403).json({ error: 'Acceso denegado. Inicia sesión para realizar esta acción' });
    }
  };

  module.exports = {
    isAdmin,
    isUser,
    isUserOrAdmin
  }