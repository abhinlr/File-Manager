function authCheck(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ success:false , message: 'Unauthorized' });
    }
}

export default authCheck;