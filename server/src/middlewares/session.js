const { verifyToken } = require("../utils/jwt.handle.js");

const checkJwt = (req, res, next) => {
    try {
        const jwtByUser = req.headers.authorization;
        const jwt = jwtByUser.split(" ").pop();
        const verified = verifyToken(`${jwt}`);

        if (verified) {
            req.user = verified;
            // console.log(req.user);
            next();
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = checkJwt;
