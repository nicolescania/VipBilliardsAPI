import express from "express";
import chargeDetails from '../Models/chargesDetails'
import mongoose from "mongoose";
import activeGame from '../Models/activeGame'
import gameTypes from '../Models/gameTypes'
import games from '../Models/game'

const gameController = require('../Controllers/games')





// GET DATE FORMATTED


const getFormattedDate = (date: any) => {


    date = new Date(date);

    // adjust 0 before single digit date
    let day = ("0" + date.getDate()).slice(-2);

    // current month
    let month = ("0" + (date.getMonth() + 1)).slice(-2);

    // current year
    let year = date.getFullYear();

    // current hours
    let hours = date.getHours();

    // current minutes
    let minutes = date.getMinutes();

    // current seconds
    let seconds = date.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return (month + "-" + day + "-" + year + " " + hours + ":" + minutes + ":" + seconds);




};

async function startGame(req: any, res: any) {



    let gameInfo = await gameController.findGame(req.body.gameId)

    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType)

    let totalAmount = amount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, 65)
   

    const startgame = new chargeDetails({

        // Game Info
        game: gameInfo,

        // total Amount
        amount: totalAmount,

        // Time that game started
        startDate: Date.now()

    })

    try {

        const newstartgame = await startgame.save()
       
        let game_active = await gameActive( newstartgame._id, gameInfo._id)
           return res.json({
            Game: gameInfo.name,
            Game_Type: gameTypesDetails.name,
            Date: newstartgame.startDate,
            total_Amount: totalAmount, 

        });

     
    } catch (err) {
        res.status(400).json({ message: err })
    }




}





function amount(amountPerHour: any, amountPerMinute: any, totalDuration: any) {


    if (totalDuration <= 60) {
        return amountPerHour

    }
    return totalDuration * amountPerMinute

}

async function gameActive( chargesDetailsId: any, gameId: any) {


    const gameActive = new activeGame({

        gameChargeDetails: chargesDetailsId,
        game: gameId

    })

    try {

        const newGameActive = await gameActive.save()
        return newGameActive


    } catch (err) {
        return ({ message: err })
    }
}





// GET LIST OF CHARGES
async function gameListOfCharges(req: any, res: any) {

    try {
        const finalcharge = await chargeDetails.find()
        res.json(finalcharge)
    } catch (err) {
        res.status(500).json({ message: err })
    }

}




// GET GAME charge
async function getGameCharge(req: any, res: any, next: any) {
    let gameCharge
    try {
        gameCharge = await chargeDetails.findById(req.params.id)




        if (gameCharge == null) {
            return res.status(404).json({ message: 'Can not find game' }
            )
        }

    } catch (err) {

        return res.status(500).json({ message: err })

    }


    res.gameCharge = gameCharge
    next()

}








module.exports = { startGame, gameListOfCharges, getGameCharge, };