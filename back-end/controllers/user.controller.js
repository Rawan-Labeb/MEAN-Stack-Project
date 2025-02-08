
const {getAllUsers,
    getUserById,
    // registerUser,
    updateUser,
    deactivateUser,
    activateUser,
    deleteUser,
    changeUserRole,
    getUserByEmail
} = require ("./../services/user.service")

const {register, login} = require("./../services/auth.service")

const router = require("express").Router();
const express = require("express");


router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

// get all users
router.get("/getAllUsers", async (req, res, next) => {
    const users = await getAllUsers();
    if (users.success)
        return res.send(users.message);
    else 
        return res.status(400).send(users.message);
})


router.get("/getUserById/:id", async (req, res, next) => {
    try {
        console.log(req.params.id)
        const user = await getUserById(req.params.id);
        if (user.success)
            return res.send(user.message);
        else    
            return res.status(400).send(user.message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

router.get("/getUserByEmail/:email", async (req, res, next) => {
    try {
        const user = await getUserByEmail(req.params.email);
        if (user.success)
            return res.send(user.message);
        else
            return res.status(400).send(user.message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

// register user 
router.post("/register", async (req, res, next) => {
    try {
        // console.log(req.body)
        const user = await register(req.body);
        // console.log(user)
        if (user.success)
            return res.status(201).send(user.message);
        else
            return res.status(400).send(user.message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});



router.put("/updateUser/:id", async (req, res, next) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        console.log(updatedUser)
        if (updatedUser.success)
            return res.send(updatedUser.message);
        else
            return res.status(400).send(updatedUser.message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});


router.put("/deactivateUser/:id", async (req, res, next) => {
    try {
        const deactivatedUser = await deactivateUser(req.params.id);
        console.log(deactivatedUser)
        if (deactivatedUser.success)
            return res.send(deactivatedUser.message);
        else
            return res.status(400).send(deactivatedUser.message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});


router.put("/activateUser/:id", async (req, res, next) => {
    try {
        const activatedUser = await activateUser(req.params.id);
        if (activatedUser.success)
            return res.send(activatedUser.message);
        else
            return res.status(400).send(activatedUser.message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

router.delete("/deleteUser/:id", async (req, res, next) => {
    try {
        const deletedUser = await deleteUser(req.params.id);
        if (deletedUser.success)
            return res.send(deletedUser.message);
        else
            return res.status(400).send(deletedUser.message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});


router.put("/changeUserRole/:id", async (req, res, next) => {
    try {
        const updatedUserRole = await changeUserRole(req.params.id, req.body.role);
        if (updatedUserRole.success)
            return res.send(updatedUserRole.message);
        else
            return res.status(400).send(updatedUserRole.message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});


router.post("/login", async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await login(email, password);
        if (user.success)
            return res.status(200).json({token: user.message});
        else
            return res.status(400).json({message: user.message});
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

module.exports =router;



