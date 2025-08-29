const documentClient = require('./databaseService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


let saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
if (isNaN(saltRounds) || saltRounds < 4 || saltRounds > 31) {
  console.warn('  BCRYPT_SALT_ROUNDS inválido o fuera de rango. Usando 12 por defecto.');
  saltRounds = 12;
}


const jwtSecret = process.env.JWT_SECRET || 'secret-desarrollo';
if (!process.env.JWT_SECRET) {
  console.warn('  JWT_SECRET no está definido en .env. Usando valor por defecto (NO usar en producción)');
}

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';


const generateToken = (user) => {
  return jwt.sign(
    {
      nickname: user.nickname,
      createdAt: user.createdAt
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};


exports.registerUser = async (nickname, password) => {
  try {
    
    const existingUser = await documentClient.get({
      TableName: 'users',
      Key: { nickname }
    }).promise();

    if (existingUser.Item) {
      return { success: false, message: 'El nickname ya existe' };
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = {
      nickname,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: 'users',
      Item: userData
    };

  
    await documentClient.put(params).promise();

    const token = generateToken(userData);

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        nickname: userData.nickname,
        createdAt: userData.createdAt
      }
    };

  } catch (error) {
    console.error('Error en registerUser:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
};


exports.loginUser = async (nickname, password) => {
  try {
    const params = {
      TableName: 'users',
      Key: { nickname }
    };

    const result = await documentClient.get(params).promise();

    if (!result.Item) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    const isPasswordValid = await bcrypt.compare(password, result.Item.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Contraseña incorrecta' };
    }

   
    const token = generateToken(result.Item);

    return {
      success: true,
      token,
      user: {
        nickname: result.Item.nickname,
        createdAt: result.Item.createdAt
      }
    };

  } catch (error) {
    console.error('Error en loginUser:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
};


exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};