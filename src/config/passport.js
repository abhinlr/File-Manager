import {Strategy} from 'passport-local';
import authService from "../services/authService.js";
import bcrypt from "bcrypt";
import passport from "passport";

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await authService.getUserById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(new Strategy({usernameField: 'email'}, async (email, password, done) => {
    try {
        let user = await authService.getUserByEmail(email);
        if (!user) {
            return done(null, false, {message: 'User does not exist'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return done(null, user);
        } else {
            return done(null, false, {message: 'Password incorrect'});
        }
    } catch (error) {
        return done(error);
    }
}));