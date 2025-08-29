const {  registerUser,loginUser } = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Nickname y contraseña requeridos' 
      });
    }

    const result = await loginUser(nickname, password);
    res.status(result.success ? 200 : 401).json(result);
  } catch (error) {
    console.error('Error en login controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};


exports.register = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Nickname y contraseña requeridos' 
      });
    }

    const result = await registerUser(nickname, password);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Error en register controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};