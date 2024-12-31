const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginUser = async (req, res) => {
   const { email, password } = req.body;

   const foundUser = await User.findOne({ email: email }).exec();

   //Unauthorized 
   if (!foundUser) return res.sendStatus(401);

   // evaluate password 
   const match = await bcrypt.compare(password, foundUser.password);

   if (match) {
      const roles = Object.values(foundUser.roles);

      // create JWTs
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

      const refreshToken = jwt.sign(
         { "email": foundUser.email },
         process.env.REFRESH_TOKEN_SECRET,
         { expiresIn: '15d' }
      );

      // Saving Refresh Token with current user
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      // Sending the Refresh Token as a cookie
      res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

      // Sending the Access Token to the front-end
      res.json({ accessToken });
   } else {
      res.sendStatus(401);
   }
}

module.exports = { loginUser };