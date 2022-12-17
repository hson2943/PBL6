const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd, phone, qr } = req.body;
    if (!user || !pwd || !phone || !qr) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    const duplicate_phone = await User.findOne({ qr: qr }).exec();
    if (duplicate_phone) return res.sendStatus(409); //Conflict 

    const duplicate_qr = await User.findOne({ qr: qr }).exec();
    if (duplicate_qr) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd,
            "phonenumber": phone,
            "qr": qr,
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };