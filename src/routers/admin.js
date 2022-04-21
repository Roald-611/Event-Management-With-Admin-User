const express = require('express');
const sharp = require('sharp');

const router = new express.Router();
const Admin = require('../models/admin');
const Users = require('../models/users');
const auth = require("../middleware/authAdmin");
const authUsers = require("../middleware/auth");
const multer = require('multer');
const { welcomeEmail, goodByEmail, eventEmail } = require('../emails/googleMails');


//space for emails

router.post('/admin', async (req, res) => {
    const admin = new Admin(req.body);
    try {
        await admin.save();
        const token = await admin.generateAuthToken();
        welcomeEmail(admin.email, admin.name);

        // if (res.status === 201) {

        // }
        res.status(201).send({ admin, token });
    } catch (error) {
        res.status(400).send(error);
    }
});


router.post('/admin/users', auth, async (req, res) => {
    try {
        const user = await Users.find({});
        user.forEach(users => {
            // welcomeEmail(users.email, users.name);
            // goodByEmail(users.email, users.name);
            eventEmail(users.email, users.name);
            // console.log(users.email + "   " + users.name);
        });

        // welcomeEmail(user.email, user.name);
        // goodByEmail(user.email, user.name);
        // eventEmail(user.email, user.name);

        res.send(user);
    } catch (error) {

    }
});

router.post('/admin/users', async (req, res) => {
    const users = new Users(req.body);
    try {
        await users.save();
        welcomeEmail(users.email, users.name);
        const token = await users.generateAuthToken();

        // if (res.status === 201) {

        // }
        res.status(201).send({ users, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password);
        const token = await admin.generateAuthToken();
        welcomeEmail(admin.email, admin.name);
        res.send({ admin, token });
    } catch (error) {
        res.status(400).send();
    }
});

router.get('/admin', auth, async (req, res) => {
    // try {
    //     const admin = await Admin.find({})
    res.send(req.admin);
    // } catch (error) {

    // }
});

router.post('/admin/logout', auth, async (req, res) => {
    try {
        // console.log("1");
        req.admin.token = req.admin.tokens.filter((tokens) => {
            return tokens.token !== req.token;
        })
        goodByEmail(req.admin.email, req.admin.name);
        await req.admin.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

router.post('/admin/logoutAll', auth, async (req, res) => {
    try {
        req.admin.token = [];
        goodByEmail(req.admin.email, req.admin.name);
        await req.admin.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

router.post('/admin/logoutAll/users', authUsers, async (req, res) => {
    try {
        req.users.token = [];
        goodByEmail(req.users.email, req.users.name);
        await req.users.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

router.delete('/admin/me', auth, async (req, res) => {
    try {
        await req.admin.remove();
        goodByEmail(req.admin.email, req.admin.name);
        res.send(req.admin);
    } catch (error) {
        res.status(500).send();
    }
})

router.delete('/admin/users/:id', authUsers, async (req, res) => {
    try {
        await req.users.remove();
        goodByEmail(req.users.email, req.users.name);
        res.send(req.users);
    } catch (error) {
        res.status(500).send();
    }
})

router.patch('/admin/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" })
    }

    try {
        const admin = await Admin.findById(req.admin._id);

        updates.forEach((update) => {
            admin[update] = req.body[update]
        });

        await admin.save()
        if (!admin) {
            return res.status(404).send();
        }
        res.send(admin);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.patch('/admin/users/:id', authUsers, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" })
    }

    try {
        const users = await Admin.findById(req.users._id);

        updates.forEach((update) => {
            users[update] = req.body[update]
        });

        await users.save()
        if (!users) {
            return res.status(404).send();
        }
        res.send(users);
    } catch (error) {
        res.status(400).send(error);
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000,
    }, fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please Upload image Jpg|Jpeg|Png'))
        }
        cb(undefined, true);
    }
})

router.post('/admin/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();

    req.admin.avatar = buffer;
    await req.admin.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.get('/admin/:id/avatar', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin || !admin.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/jpg')
        res.send(admin.avatar);
    } catch (error) {
        res.status(404).send();
    }
});

router.delete('/admin/me/avatar', auth, async (req, res) => {
    try {
        req.admin.avatar = undefined;
        await req.admin.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
});

module.exports = router;