const express = require('express')
const { notifyModel } = require('../models/notification')
const { auth_request } = require('../middlewares/authorize')
const redisClient = require('../utils/redisConfig')

const notifyRouter = express.Router()

notifyRouter.get('/v1/getMyNotifications', auth_request, async (req, res) => {
    try {
        const user_notification = await notifyModel.find({ userId: req.user ,status:'unseen'})
        await notifyModel.updateMany({
            userId: req.user
        },
            {
                $set: { status: 'seen' }
            }
        )
        if (!user_notification) {
            throw new Error("Not found any new Notifications")
        }
        else {
            res.status(200).json({
                notifications: user_notification
            })
        }
    }
    catch (err) {
        res.status(500).json({
            notifications: []
        })
    }
})

notifyRouter.get('/v1/countMyNotifications', auth_request, async (req, res) => {

    // redisClient

    try {
        const user_notification_count = await notifyModel.find({ userId: req.user, status: 'unseen' })
        if (!user_notification_count) {
            throw new Error("Not found any new Notifications")
        }
        else {
            res.status(200).json({
                notifications: user_notification_count.length
            })
        }
    }
    catch (err) {
        res.status(500).json({
            notifications: 0
        })
    }
})

module.exports = {
    notifyRouter
}