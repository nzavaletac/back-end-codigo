const jwt = require("jsonwebtoken");
const generarToken = ({ dni }) => {
  // destructuracion de todo mi elector en mi zona de parametro
  const payload = {
    elector_dni: dni,
  };
  const secret = process.env.JWT || "votaciones";
  const token = jwt.sign(
    payload,
    secret,
    { expiresIn: 60 },
    { algorithm: "RS256" }
  );
  return token;
};

module.exports = {
  generarToken,
};
