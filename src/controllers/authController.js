import authService from "../services/authService.js";
import bcrypt from "bcrypt";
import passport from "passport";
import folderController from "./folderController.js";

async function signup(req, res) {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({msg: "Please enter all fields"});
    }

    if (password.length < 6) {
        return res.status(400).json({msg: "Password must be at least 6 characters"});
    }

    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) return res.status(400).json({msg: "User already exists"});

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authService.createUser({name, email, password: hashedPassword});
    if (user) {
        const rootFolder = await folderController.createRootFolder(user._id.toString());
    }
    return res.status(200).json({msg: "User created successfully"});
}

const login = async (req,res,next)=>{
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.status(500).json({ message: 'An error occurred during authentication.' });
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.login(user, function(err) {
            if (err) {
                return res.status(500).json({ message: 'An error occurred during login.' });
            }
            return res.status(200).json({success:true,user:user});
        });
    })(req, res, next);
}

const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred during logout.' });
        }
    });
    res.status(200).json({success:true});
}

export default {
    signup,
    login,
    logout
};