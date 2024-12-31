const User = require('../model/User');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
   const cookies = req.cookies;

   // Check if cookies exist
   if (!cookies?.jwt) return res.sendStatus(401);
   const refreshToken = cookies.jwt;

   const foundUser = await User.findOne({ refreshToken }).exec();

   // Forbidden
   if (!foundUser) return res.sendStatus(403);

   // Evaluate JWT
   jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
         if (err || foundUser.email !== decoded.email) {
            return res.sendStatus(403);
         }

         const roles = Object.values(foundUser.roles);
         const accessToken = jwt.sign(
            {
               "UserInfo": {
                  "email": foundUser.email,
                  "roles": roles
               }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
         );

         res.json({ accessToken });
      }
   );
}

module.exports = { handleRefreshToken };