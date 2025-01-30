
const {getAllUsers,
    getUserById,
    registerUser,
    updateUser,
    deactivateUser,
    activateUser,
    deleteUser,
    changeUserRole,
    getUserByEmail
} = require ("./../services/user.service")
const router = require("express").Router();
const express = require("express");


router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

// get all users
router.get("/getAllUsers", async (req, res, next) => {
    const users = await getAllUsers();
    if (users.success)
        return res.send(users.Message);
    else 
        return res.status(400).send(users.Message);
})


router.get("/getUserById/:id", async (req, res, next) => {
    try {
        console.log(req.params.id)
        const user = await getUserById(req.params.id);
        if (user.success)
            return res.send(user.Message);
        else    
            return res.status(400).send(user.Message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

router.get("/getUserByEmail/:email", async (req, res, next) => {
    try {
        const user = await getUserByEmail(req.params.email);
        if (user.success)
            return res.send(user.Message);
        else
            return res.status(400).send(user.Message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

// register user 
router.post("/register", async (req, res, next) => {
    try {
        // console.log(req.body)
        const user = await registerUser(req.body);
        // console.log(user)
        if (user.success)
            return res.status(201).send(user.Message);
        else
            return res.status(400).send(user.Message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});



router.put("/updateUser/:id", async (req, res, next) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        console.log(updatedUser)
        if (updatedUser.success)
            return res.send(updatedUser.Message);
        else
            return res.status(400).send(updatedUser.Message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});


router.put("/deactivateUser/:id", async (req, res, next) => {
    try {
        const deactivatedUser = await deactivateUser(req.params.id);
        console.log(deactivatedUser)
        if (deactivatedUser.success)
            return res.send(deactivatedUser.Message);
        else
            return res.status(400).send(deactivatedUser.Message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});


router.put("/activateUser/:id", async (req, res, next) => {
    try {
        const activatedUser = await activateUser(req.params.id);
        if (activatedUser.success)
            return res.send(activatedUser.Message);
        else
            return res.status(400).send(activatedUser.Message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

router.delete("/deleteUser/:id", async (req, res, next) => {
    try {
        const deletedUser = await deleteUser(req.params.id);
        if (deletedUser.success)
            return res.send(deletedUser.Message);
        else
            return res.status(400).send(deletedUser.Message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});


router.put("/changeUserRole/:id", async (req, res, next) => {
    try {
        const updatedUserRole = await changeUserRole(req.params.id, req.body.role);
        if (updatedUserRole.success)
            return res.send(updatedUserRole.Message);
        else
            return res.status(400).send(updatedUserRole.Message);
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

module.exports =router;



