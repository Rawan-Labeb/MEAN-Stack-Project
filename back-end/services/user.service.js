

const {
    getUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deactivateUser,
    activateUser,
    deleteUser,
    changeUserRole
} = require("./../repos/user.repo")

const bcrypt = require("bcrypt");


// get all users
module.exports.getAllUsers =async () => 
{
    try{
        const users = await getUsers();
        return {success: true, Message: users};
    }catch (error)
    {
        return {success: false, Message: error.Message};
    }
}

// get User By Id
module.exports.getUserById = async (userId) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, Message: validation.Message };
        }
        return { success: true, Message: validation.Message };
    } catch (error) {
        return { success: false, Message: error.message };
    }
}


// get User By Email
module.exports.getUserByEmail = async (email) => {
    try {
        if (!email) {
            return { success: false, Message: "Email Should Be Passed" };
        }
        const user = await getUserByEmail(email);
        if (!user) {
            return { success: true, Message: "No User With that Email" };
        }
        return { success: true, Message: user };
    } catch (error) {
        return { success: false, Message: error.message };
    }
}


// register user 
module.exports.registerUser = async (userData) => {
    try {
        const validation = await validateUserData(userData, true);
        if (!validation.valid) {
            return { success: false, Message: validation.Message };
        }

        const userSalt = await bcrypt.genSalt(10);
        userData.salt = userSalt;

        userData.password = await bcrypt.hash(userData.password, userSalt);
        console.log(userData.password)
        const user = await createUser(userData);
        return { success: true, Message: user };
    } catch (error) {
        return { success: false, Message: error.message };
    }
}


// update user
module.exports.updateUser = async (userId, userData) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, Message: validation.Message };
        }

        const userValidation = await validateUserData(userData, false);
        if (!userValidation.valid) {
            return { success: false, Message: userValidation.Message };
        }

        if (userData.password) {
            const userSalt = await bcrypt.genSalt(10);
            userData.salt = userSalt;
            userData.password = await bcrypt.hash(userData.password, userSalt);
        }

        const updatedUser = await updateUser(userId, userData);
        return { success: true, Message: updatedUser };
    } catch (error) {
        return { success: false, Message: error.message };
    }
}

// validation on creation or update
const validateUserData = async (data, isNewUser) => {
    const { firstName, lastName, email, password } = data;

    if (isNewUser) {
        if (!firstName || !lastName || !email || !password) {
            return { valid: false, Message: "All fields must be provided" };
        }
    }

    if (email && isNewUser) {
        // validate email
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return { valid: false, Message: "Invalid email format" };
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return { valid: false, Message: "Email already exists" };
        }
    }

    if (password || isNewUser) {
        // validate password complexity
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return { valid: false, Message: "Password must be complex" };
        }
    }
    return { valid: true, Message: "Valid" };
}

// deactivate user
module.exports.deactivateUser = async (userId) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, Message: validation.Message };
        }

        const updatedUser = await deactivateUser(userId);
        return { success: true, Message: updatedUser };
    } catch (error) {
        return { success: false, Message: error.message };
    }
}


// activate user
module.exports.activateUser = async (userId) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, Message: validation.Message };
        }

        const updatedUser = await activateUser(userId);
        return { success: true, Message: updatedUser };
    } catch (error) {
        return { success: false, Message: error.message };
    }
}

// delete user
module.exports.deleteUser = async (userId) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, Message: validation.Message };
        }

        await deleteUser(userId);
        return { success: true, Message: "User deleted successfully" };
    } catch (error) {
        return { success: false, Message: error.message };
    }
}

// validate userId
const validateUserId = async (userId) => {
    if (!userId) {
        return { valid: false, Message: "User Id Should Be Passed" };
    }

    const user = await getUserById(userId);
    if (!user) {
        return { valid: false, Message: "No User With that Id" };
    }

    return { valid: true, Message: user };
}

// change user role
module.exports.changeUserRole = async (userId, newRole) => {
    try {
        const validation = await validateUserId(userId);
        if (!validation.valid) {
            return { success: false, Message: validation.Message };
        }

        if (!newRole) {
            return { success: false, Message: "New Role Should Be Passed" };
        }

        const updatedUser = await changeUserRole(userId, newRole);
        return { success: true, Message: updatedUser };
    } catch (error) {
        return { success: false, Message: error.message };
    }
}
