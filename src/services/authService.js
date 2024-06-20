import User from '../models/User.js';

async function createUser(data) {
    const user = new User(data);
    await user.save();
    return user;
}
async function getUserByEmail(email) {
    const user = await User.findOne({email: email});
    return user;
}

async function getUserById(id) {
    const user = await User.findById(id);
    return user;
}

export default {
    createUser,
    getUserByEmail,
    getUserById
};