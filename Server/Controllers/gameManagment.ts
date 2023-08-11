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

    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, 65)


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

        let game_active = await gameActive(newstartgame._id, gameInfo._id)
        let formattedDate = getFormattedDate(newstartgame.startDate)
        return res.json({
            Game: gameInfo.name,
            Game_Type: gameTypesDetails.name,
            Date: formattedDate,
            total_Amount: totalAmount,

        });


    } catch (err) {
        res.status(400).json({ message: err })
    }




}



async function getDurationTime(startDate: any, endDate: any,) {


    const differenceInMilliseconds = endDate - startDate;
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    const differenceInHours = Math.floor(differenceInMinutes / 60);


    const durationTime = {
        hours: differenceInHours,
        minutes:differenceInMinutes
    }


    return durationTime

    //return [differenceInHours, differenceInMinutes]
   //  return [` you been playing for ${differenceInMinutes} Minutes and ${differenceInHours} Hours `]


}





// GET TOTAL CHARGE
function getAmount(amountPerHour: any, amountPerMinute: any, totalDuration: any) {


    if (totalDuration <= 60) {
        return amountPerHour
    }
    return totalDuration * amountPerMinute

}


// SAVE GAME ACTIVE
async function gameActive(chargesDetailsId: any, gameId: any) {


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


// GET GAME ACTIVE
async function getGameActive(req: any, res: any, next: any) {

    let gameactive

    let gameInfo = await gameController.findGame(req.body.gameId)

    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType)

    try {

        gameactive = await activeGame.findOne({ game: gameInfo })

        if (gameactive == null) {

            return res.status(404).json({
                message: 'Can not find game',
            }
            )
        }

    } catch (err) {

        return res.status(500).json({ message: err })

    }
    let chargesDetails = await findcharge(gameactive.gameChargeDetails)
    let endDate = Date.now()
    let time = await getDurationTime(chargesDetails?.startDate, endDate)
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes)
    let formattedDate = getFormattedDate(chargesDetails?.startDate)

    return res.json({
        game: gameInfo.name,
        type: gameTypesDetails.name,
        game_started: formattedDate,
        time_playing: `You have been playing for ${time.minutes} minutes and ${time.hours} hours`,
        charge: totalAmount


    })

}


// CLOSE GAME 

async function closeGame(req: any, res: any, next: any, gameInfo: any) {

    gameInfo = await gameController.findGame(req.body.gameId)
    //let game1= await getGameActive(req, res, next)
    try {


        res.json({
            message: 'Game closed'
        })

    } catch (err) {

        res.status(500).json({ message: 'the rrror is in close game' })

    }
    await res.game.deleteOne(gameInfo)

}




// GET LIST OF CHARGES
async function getGameListOfCharges(req: any, res: any) {

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

        return res.status(500).json({ message: 'the error is in active game' })

    }


    return res.json(gameCharge)
    next()

}

// FIND CHARGE
async function findcharge(id: any) {

    return await chargeDetails.findById(id)

}


// MILDWARE GAME ACTIVE
async function getActivegame(req: any, res: any, next: any) {
   
    let game
    let gameInfo = await gameController.findGame(req.body.gameId)

    try {

      let game = await activeGame.findOne({ game: gameInfo })

        if (game == null) {
            return res.status(404).json({ message: 'Can not find game' }
            )
        }

    } catch (err) {

        return res.status(500).json({ message: err })

    }


    res.game = game
    next()

}



// TRANSFER GAME

async function transferGame(req: any, res: any, next: any) {


    let gameInfo01 = await gameController.findGame(req.body.gameId01)
    let gameInfo02 = await gameController.findGame(req.body.gameId02)

    try {

        let gameupdated = await activeGame.updateOne({ game: gameInfo01 }, { $set: { game: gameInfo02 } })

        if (gameupdated == null) {

            return res.status(404).json({
                message: 'Can not find game',
            })
        }

    } catch (err) {

        return res.status(500).json({ message: err })

    }

    return res.json({ message: 'Game transfered successfully' })

}




module.exports = { startGame, getGameActive, getGameCharge, closeGame, getActivegame, transferGame,getGameListOfCharges };