import * as sql from '../models/User.models.js';
import { jwtSign } from '../util/jwt.js';
import { hashPass, comparePass } from '../util/bcrypt.js';

// Registro de usuario
export const register = (req, res) => {
  const { nombre, email, contraseña } = req.body;
  hashPass(contraseña)
    .then(hashedPass => sql.register({ nombre, email, contraseña: hashedPass }))
    .then(result => {
      if (result.code) {
        res.status(500).json({ status: false, code: 500, message: 'No se ha podido registrar usuario' });
        return;
      }
      res.status(201).json({ status: true, code: 201, message: 'Usuario creado' });
    })
    .catch(error => res.status(500).json({ status: false, code: 500, message: error.message }));
};

// Inicio de sesión de usuario
export const login = (req, res) => {
  const { email, contraseña } = req.body;
  sql.login({ email })
    .then(usuarios => {
      if (usuarios.length === 0) {
        res.status(401).json({ status: false, code: 401, message: 'Usuario y/o contraseña incorrectas' });
        return;
      }
      const usuario = usuarios[0];
      return comparePass(contraseña, usuario.contraseña)
        .then(contraseñaMatch => {
          if (!contraseñaMatch) {
            res.status(401).json({ status: false, code: 401, message: 'Usuario y/o contraseña incorrectas' });
            return;
          }

          const token = jwtSign({ email: usuario.email });
          res.status(200).json({ status: true, code: 200, message: { token } });
        });
    })
    .catch(error => {
      res.status(500).json({ status: false, code: 500, message: error.message });
    });
};

// Buscar perfil de usuario
export const findProfile = (req, res) => {
  const email = req.usuario.email;
  sql.findProfile({ email })
    .then(profile => {
      if (!profile) {
        res.status(404).json({ status: false, code: 404, message: 'Usuario no encontrado' });
        return;
      }
      res.status(200).json({ status: true, code: 200, message: profile });
    })
    .catch(error => {
      res.status(500).json({ status: false, code: 500, message: error.message });
    });
};

// Actualizar perfil de usuario
export const updateProfile = (req, res) => {
  const id = req.params.id;
  const { nombre, email, contraseña } = req.body;

  let updatedData = { nombre, email };

  if (contraseña) {
    hashPass(contraseña)
      .then(hashedPass => {
        updatedData.contraseña = hashedPass;
        return sql.updateProfile(id, updatedData);
      })
      .then(result => {
        if (result.code) {
          res.status(500).json({ status: false, code: 500, message: 'No se ha podido actualizar el perfil' });
          return;
        }
        res.status(200).json({ status: true, code: 200, message: 'Usuario actualizado' });
      })
      .catch(error => res.status(500).json({ status: false, code: 500, message: error.message }));
  } else {
    sql.updateProfile(id, updatedData)
      .then(result => {
        if (result.code) {
          res.status(500).json({ status: false, code: 500, message: 'No se ha podido actualizar usuario' });
          return;
        }
        res.status(200).json({ status: true, code:200, message: 'Usuario actualizado'});
        })
        .catch(error => res.status(500).json({ status:false, code:500, message: error.message}));
  }
};