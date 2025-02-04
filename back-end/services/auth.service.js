
const bcrypt = require("bcrypt");
const {registerUser,getUserById, getUserByEmail} = require("./user.service");
const {signToken} = require("./../utils/jwttoken.manager")
const Userr= require("../models/user.model")

const createClaims = (user) => {
    return {
        sub: user.user_id,
        email: user.email,
        role: user.role
    };
};

const register = async (userData) => {
    try {
        const result = await registerUser(userData);
        if (!result.success)
            return {success: false, message: result.message};

        const claims = createClaims(result.message);
        const token = signToken({claims})
        return {success: true, message: token};
    } catch (error) {
        return { success: false, message: "Error registering user: " + error.message };
    }
};

const getUserCalims = async (userId) => {
    try {
        const chk = await getUserById(userId);

        if (!chk.success)
            return {success: false, message: chk.message};

        const claims = createClaims(chk.message);
        return {success: true, message: claims.message};
    } catch (error) {
        return {success: false, message: error.message};
    }
};

const login = async (email, password) => {
    try {
        const user = await getUserByEmail(email);
        if (!user.success) {
            return { success: false, message: "Email Or Password Not Valid" };
        }

        const isPasswordValid = await (user.message).comparePassword(password);
        if (!isPasswordValid) {
            return { success: false, message: "Email Or Password Not Valid" };
        }

        const claims = createClaims(user.message);

        const token = signToken({claims});

        return { success: true, message: token };
    } catch (error) {
        return { success: false, message: "Error logging in: " + error.message };
    }
};



module.exports = {
    register,
    getUserCalims,
    login   
};



