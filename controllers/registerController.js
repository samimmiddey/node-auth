const User = require('../model/User');
const bcrypt = require('bcrypt');

const registerNewUser = async (req, res) => {
    // Extract the email & password
    const { email, password } = req.body;

    // Check if we have email and password
    if (!email || !password) return res.status(400).json({ 'message': 'Email & password are required!' });

    // Check for duplicate emails in the DB
    const duplicate = await User.findOne({ email: email }).exec();

    // If duplicate found
    if (duplicate) { return res.sendStatus(409); }

    try {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create & store the new user
        await User.create({
            "email": email,
            "password": hashedPassword
        });

        res.status(201).json({ 'Success': 'New user created!' });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

module.exports = { registerNewUser };