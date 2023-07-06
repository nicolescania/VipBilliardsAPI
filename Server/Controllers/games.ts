import express from "express";
import gameTypes from '../Models/gameTypes'
import mongoose from "mongoose";


// GET GAME TYPE LIST

async function list(req: any, res: any) {

    try {
        const gameType = await gameTypes.find()
        res.json(gameType)
    } catch (err) {
        res.status(500).json({ message: err })
    }

}


async function create(req: any, res: any) {


    const gameType = new gameTypes({

        name: req.body.name,
        pricePerHour: req.body.pricePerHour,
        pricePerMinute: req.body.pricePerMinute

    })

    try {
        const newGameType = await gameType.save()
        res.status(201).json(newGameType)
    } catch (err) {
        res.status(400).json({ message: err })
    }


}



async function getGameType(req: any, res: any, next: any) {
    let gameType
    try {
        gameType = await gameTypes.findById(req.params.id)


        if (gameType == null) {
            return res.status(404).json({ message: 'Can not find game' }
            )
        }

    } catch (err) {

        return res.status(500).json({ message: err })

    }


    res.gameType = gameType
    next()

}




async function updateGameType(req: any, res: any) {
    if (req.body.name != null) {

        res.gameType.name = req.body.name

        try {

            const updateGameType = await res.gameType.save()
            res.json(updateGameType)

        } catch (error) {
            res.status(400).json({ message: error })

        }

    }

}

async function deleteGameType(req: any, res: any) {
    let id = req.params.id;

    try {

        await res.gameType.deleteOne({ id })
        res.json({ message: 'game deleted' })
    } catch (err) {

        res.status(500).json({ message: err })

    }
}




module.exports = { list, create, getGameType, updateGameType, deleteGameType };
