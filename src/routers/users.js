const express = require('express');
// const sharp = require('sharp');

const router = new express.Router();
const User = require('../models/users');
const auth = require("../middleware/auth");
const multer = require('multer');
const sharp = require('sharp')
const { welcomeEmail, goodByEmail, eventEmail } = require('../emails/googleMails');


//space for emails

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        welcomeEmail(user.email, user.name);

        // if (res.status === 201) {

        // }
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        welcomeEmail(user.email, user.name);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

router.get('/users', auth, async (req, res) => {
    try {
        const user = await User.find({})
        res.send(user);
    } catch (error) {

    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.token = req.user.tokens.filter((token) => {
            return token !== req.token;
        })
        goodByEmail(req.user.email, req.user.name);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

// router.post('/users/logoutAll', auth, async (req, res) => {
//     try {
//         req.user.token = [];
//         await req.user.save();
//         res.send();
//     } catch (error) {
//         res.status(500).send();
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" })
    }

    try {
        const user = await User.findById(req.user._id);

        updates.forEach((update) => {
            user[update] = req.body[update]
        });

        await user.save()
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        goodByEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    }, fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please Upload image Jpg|Jpeg|Png'))
        }
        cb(undefined, true);
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
});

module.exports = router;