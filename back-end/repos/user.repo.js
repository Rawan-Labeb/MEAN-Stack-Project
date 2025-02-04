
const User = require("./../models/user.model");

// getAllUsers
module.exports.getUsers = async () => {
    try{
        const Users = await User.find({});
        return Users
    }catch (error)
    {
        console.log({
            Message: erro.Message,
            error
        })
    }
}

// getUserbyId
module.exports.getUserById = async(userId) => {
    try{
        const user = User.findOne({user_id: userId});
        return user;
    }catch(error)
    {
        console.log(error.Message);
    }
}

// getUserbyEmail
module.exports.getUserByEmail = async(userEmail) => {
    try{
        const user = User.findOne({email: userEmail});
        return user;
    }catch(error)
    {
        console.log(error.Message);
    }
}





module.exports.updateUser = async (userId, updatedData) => {
    try{
        return await User.updateOne({user_id: userId},
            {$set: updatedData}
        )
    }catch(error)
    {
        console.log(error.Message);
    }
}

// deactivate user
module.exports.deactivateUser = async (userId) => {
    try {
        var chk = await User.updateOne(
            { user_id: userId },
            { $set: { isActive: false } }
        );
        console.log(chk);
        console.log("User Deactivated Successfully!");
        return chk;
    } catch (error) {
        console.log(error.Message);
    }
}



// createUser
module.exports.createUser = async (data) =>{
    try{
        const user = await User.create(data);
        return user
    }catch(error)
    {
        console.log({
            Message: error.Message,
            error
        })
    }
}


// activateUser
module.exports.activateUser = async (userId) => {
    try {
        const activatedUser = await User.updateOne(
            { user_id: userId },
            { $set: { isActive: true } }
        );
        console.log("User Activated Successfully!");
        return activatedUser;
    } catch (error) {
        console.log(error.Message);
    }
}

// deleteUser
module.exports.deleteUser = async (userId) => {
    try {
        const deletedUser = await User.deleteOne({ user_id: userId });
        console.log("User Deleted Successfully!");
        return deletedUser;
    } catch (error) {
        console.log(error.Message);
    }
}

// changeUserRole
module.exports.changeUserRole = async (userId, newRole) => {
    try {
        const updatedUser = await User.updateOne(
            { user_id: userId },
            { $set: { role: newRole } }
        );
        console.log("User Role Updated Successfully!");
        return updatedUser;
    } catch (error) {
        console.log(error.Message);
    }
}