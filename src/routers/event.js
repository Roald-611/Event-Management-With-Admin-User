const express = require('express');
// const { options } = require('nodemon/lib/config');
const router = new express.Router();
const auth = require('../middleware/authAdmin');
const Events = require('../models/event');
const Users = require('../models/users');
const { invitationEmail } = require('../emails/googleMails');
// const { events } = require('../models/event');


router.post("/events", auth, async (req, res) => {
    const events = new Events({
        ...req.body,
        owner: req.admin._id
    })
    try {
        await events.save();
        res.status(201).send(events);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/events", auth, async (req, res) => {
    // const match = {};
    // const sort = {};
    // if (req.query.completed) {
    //     match.completed = req.query.completed === 'true';
    // }
    // if (req.query.sortBy) {
    //     const parts = req.query.sortBy.split(':');
    //     sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    // }
    // try {
    //     await req.admin.populate({
    //         path: 'events',
    //         match,
    //         options: {
    //             limit: parseInt(req.query.limit),
    //             skip: parseInt(req.query.skip),
    //             sort
    //         }
    //     });
    //     res.send(req.admin.events);
    // } catch (error) {
    //     res.status(500).send();
    // }

    Events.find({}).then((events) => {
        res.send(events);
    }).catch((e) => {
        res.status(500).send(e);
    })

    // res.send(req.admin)
});

router.get('/events/Admin/:id', auth, async (req, res) => {
    const _id = req.params.id;

    Events.find({ owner: _id }).then((events) => {
        res.send(events);
    }).catch((e) => {
        res.status(500).send(e);
    })
});
router.post('/events/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const user = await Users.find({});
    Events.findById({ _id }).then((events) => {
        user.forEach(users => {
            invitationEmail(users.email, events.event, users.name);
            // console.log(users.email + events.event + users.name);
        });
        // console.log(events.event);
        res.send(events.event);
    })
    // console.log(_id);
    // console.log({ owner: req.admin._id });
    // try {
    //     // const events = await Events.findOne({ _id, owner: req.admin.id })
    //     const events = await Events.find({ _id, owner: req.admin._id })
    //     // console.log(events);
    //     if (!events) {
    //         return res.status(404).send();
    //     }
    //     res.send(events);
    // } catch (error) {
    //     res.status(500).send();
    // }

});

router.patch('/events/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['event', 'requirement', 'description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.ststus(400).send({ error: "Inavalid Updates" });
    }

    try {
        const event = await Events.findOne({ _id: req.params.Id, owner: req.admin._id })
        updates.forEach((update) => event[update] = req.body[update])
        await event.save()
        if (!event) {
            return res.ststus(404).send();
        }
        res.send(event)
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/events/:id', auth, async (req, res) => {
    try {
        const event = await Events.findOneAndDelete({
            _id: req.params.id, owner: req.admin._id
        })
        if (!event) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
})

module.exports = router;