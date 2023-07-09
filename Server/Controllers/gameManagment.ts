import express from "express";
import chargeDetails from '../Models/chargesDetails'
import mongoose from "mongoose";
import activeGame from '../Models/activeGame'
import gameTypes from '../Models/gameTypes'
import games from '../Models/game'

const gameController = require('../Controllers/games')




// START TIMER


let startTime;
let elapsepTime = 8
let timerInterval;


const startDate = (req: any, res: any) => {

    startTime = Date.now() - elapsepTime;
    timerInterval = setInterval(updateDate, 10)
    return timerInterval

};


const updateDate = (startTime: any, elapsedTime: any) => {

    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

};


const endDate = (req: any, res: any) => {

    res.json({ elapsed: elapsepTime });

};


// WORK IN GET, GAME PRICE

const getGamePrice = () => {
    let finalAmount = elapsepTime * 20
    return finalAmount
};




const duration = () => {
    let duration = elapsepTime
    return duration
};


const getFormattedDate = (date:any) => {


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


    const startgame = new chargeDetails({

        // Mesa
        game: await gameController.findGame(req.body.game),
       
        // default price
        amount: getGamePrice(),

        // Time that game started
        startDate: Date.now(),



    })

    try {

        const newstartgame = await startgame.save()        
        res.status(201).json(newstartgame)
    } catch (err) {
        res.status(400).json({ message: err })
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








module.exports = { startDate, updateDate, endDate, startGame, gameListOfCharges, getGameCharge };

