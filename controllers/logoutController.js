const User = require('../model/User');

const handleLogout = async (req, res) => {
   // On client, also delete the accessToken

   const cookies = req.cookies;
   // No content
   if (!cookies?.jwt) return res.sendStatus(204);
   const refreshToken = cookies.jwt;

   // Check if refreshToken is in DB
   const foundUser = await User.findOne({ refreshToken }).exec();

   // Clear Cookie
   if (!foundUser) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
      return res.sendStatus(204);
   }

   // Delete refreshToken in DB
   foundUser.refreshToken = '';
   await foundUser.save();

   // Delete the cookie
   res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
   res.sendStatus(204);
}

module.exports = { handleLogout };