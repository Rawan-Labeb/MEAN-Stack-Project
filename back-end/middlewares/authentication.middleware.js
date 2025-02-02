const {verifyToken, decodedToken} = require("../uility/jwtTokenManager");


const authenticaitonMiddleware = async (req, res, next) => 
{
    try {
        // because the toke consist of two parts on Bearer and another token 
        const token = req.headers.authorization.split(" ")[1];
        // if the token not verified => will be return issue => go to catch
        verifyToken(token);
        const claims = decodedToken(token);
        req.user = claims;
        next();

    }catch(error)
    {
        res.status(401).json({message: "Unauthenticated"});
    }
}


module.exports = {
    authenticaitonMiddleware
}

