import express from "express";
import chargeDetails from '../Models/chargesDetails'
import mongoose from "mongoose";
import activeGame from '../Models/activeGame'
import gameTypes from '../Models/gameTypes'
import games from '../Models/game'

const gameController = require('../Controllers/games')



function formatMoney(amount: number, currencySymbol: string = "$"): string {
    const options = {
        style: "currency",
        currency: "CAD", // Canadian Dollar
        minimumFractionDigits: 2,
    };
    const formatter = new Intl.NumberFormat("en-CA", options);
    return formatter.format(amount);
}

// GET DATE FORMATTED
const getFormattedDate1 = (date: any) => {


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


const getFormattedDate = (date: any) => {
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    date = new Date(date);

    // Adjust 0 before single digit date
    let day = ("0" + date.getDate()).slice(-2);

    // Current month name
    let monthName = monthNames[date.getMonth()];

    // Current year
    let year = date.getFullYear();

    // Current hours (in 12-hour format)
    let hours = date.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12 || 12).toString().padStart(2, '0'); // Convert to 12-hour format and ensure two digits

    // Current minutes
    let minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits

    // Current seconds
    let seconds = date.getSeconds().toString().padStart(2, '0'); // Ensure two digits

    // Create the formatted date object
    const formattedDate = {
        month: monthName,
        day: day,
        year: year,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        ampm: ampm
    };

    return formattedDate;
};


// START GAME
async function startGame(req: any, res: any) {


    let gameInfo = await gameController.findGame(req.body.gameId)

    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType)

    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, 60,true)


    const startgame = new chargeDetails({

        // Game Info
        game: gameInfo,

        // total Amount
        amount: totalAmount,

        // Time that game started
        startDate: Date.now(),

        holdTime: 0,
        
        minimunChargeCondition: true,

        location: gameInfo.location
    })

    try {

        const newstartgame = await startgame.save()
        const STATUS = true
        let game_active = await gameActive(newstartgame._id, gameInfo._id, STATUS)
        let formattedDate = getFormattedDate(newstartgame.startDate)
        return res.json({
            Game: gameInfo.name,
            GameType: gameTypesDetails.name,
            Date: formattedDate,
            totalAmount: totalAmount,

        });


    } catch (err) {
        res.status(400).json({ message: err })
    }

}

// START GAME
async function startGameByMinute(req: any, res: any) {


    let gameInfo = await gameController.findGame(req.body.gameId)

    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType)

    let totalAmount = getAmount(gameTypesDetails.pricePerMinute, gameTypesDetails.pricePerMinute, 0, false)


    const startgame = new chargeDetails({

        // Game Info
        game: gameInfo,

        // total Amount
        amount: totalAmount,

        // Time that game started
        startDate: Date.now(),

        holdTime: 0  ,
        
        minimunChargeCondition: false
    })

    try {

        const newstartgame = await startgame.save()
        const STATUS = true
        let game_active = await gameActive(newstartgame._id, gameInfo._id, STATUS)
        let formattedDate = getFormattedDate(newstartgame.startDate)
        return res.json({
            Game: gameInfo.name,
            GameType: gameTypesDetails.name,
            Date: formattedDate,
            totalAmount: totalAmount,

        });


    } catch (err) {
        res.status(400).json({ message: err })
    }

}

// GET TOTAL DURATION TIME OF A TABLE
async function getDurationTime(startDate: any, endDate: any,) {


    const differenceInMilliseconds = endDate - startDate;
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    const differenceInHours = Math.floor(differenceInMinutes / 60);
   



    const durationTime = {
        hours: differenceInHours,
        minutes:differenceInMinutes,
        differenceInMilliseconds
                    
    }


    return durationTime

}




// GET TOTAL CHARGE
function getAmount(amountPerHour: any, amountPerMinute: any, totalDuration: any, perhour:any) {


    if ( perhour == true && totalDuration <= 60){
     return amountPerHour
    } if (perhour == true && totalDuration >= 60) {
        return totalDuration * amountPerMinute
    } 
     if (perhour == false ){
     return totalDuration * amountPerMinute
    } 
                    




}


// SAVE GAME ACTIVE
async function gameActive(chargesDetailsId: any, gameId: any, status:any) {


    const gameActive = new activeGame({

        gameChargeDetails: chargesDetailsId,
        game: gameId,
        isActive: status

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

            return res.status(200).json({
                gameActiveExist: false,
                message: 'Can not find game',
            }
            )
        }

    } catch (err) {

        return res.status(500).json({ message: err })

    }
    let chargesDetails = await findcharge(gameactive.gameChargeDetails)
    let endDate = Date.now()

    let time = await getValidationTime(chargesDetails?.holdTime,chargesDetails?.startDate, endDate, chargesDetails?.holdTimeStarted)

    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes,chargesDetails?.minimunChargeCondition)
    let formattedDate = getFormattedDate(chargesDetails?.startDate)
    let totalAmountFormatted = formatMoney(totalAmount)
    let holdTimeStarted = getFormattedDate(chargesDetails?.holdTimeStarted)
    let holdTime = await getDurationTime(chargesDetails?.holdTimeStarted, endDate)

    return res.json({
        gameActiveExist: true,
        game: gameInfo.name,
        type: gameTypesDetails.name,
        gameStarted: ` ${formattedDate.month} ${formattedDate.day} - ${formattedDate.hours}:${formattedDate.minutes}${formattedDate.ampm}` , 
        timePlaying: `${time.hours} hours, ${time.minutes} minutes`,
        charge: totalAmountFormatted,
        gameStatus: gameactive?.isActive,
        holdTimeStarted,
        holdTime: `${holdTime.hours} hours, ${holdTime.minutes} minutes`,




    })

}



async function verifyMinimumChargeRequired(minimum:Boolean){
    if (minimum ==  true){
        return true
    } else return false
}


//HOLD GAME
async function holdGame(req: any, res: any, next: any, ) {
    let holdGame
    let gameInfo = await gameController.findGame(req.body.gameId)
    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType)

    try {
        holdGame = await activeGame.findOneAndUpdate({ game: gameInfo },{ $set: { isActive: false },  } )    
        if (holdGame == null) {

            return res.status(404).json({
                message: 'Can not find game',
            })
        }

    } catch (err) {
        return res.status(500).json({ message: err })
    } 
    
    let dateNow = Date.now()
    let holdTimeUpdated = await chargeDetails.updateOne({ _id: holdGame.gameChargeDetails}, { $set: { holdTimeStarted: dateNow },  })
    let formattedDateHold = getFormattedDate(dateNow)
    let chargesDetails = await findcharge(holdGame.gameChargeDetails)   
    let time = await getDurationTime(chargesDetails?.startDate, chargesDetails?.holdTimeStarted) 
    let Holdtime = await getDurationTime(chargesDetails?.holdTimeStarted, dateNow)
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes,chargesDetails?.minimunChargeCondition)
    let timeStarted = getFormattedDate(chargesDetails?.startDate)


    return res.json({
        timeStarted: timeStarted,
        time: `You have been playing for ${time.minutes} minutes and ${time.hours} hours`,
        Holdtime: `You have been playing for ${Holdtime.minutes} minutes and ${Holdtime.hours} hours`, 
        totalAmount     

    })

}

async function test(req:any, res:any)
{
      var aMinuteAgo = new Date( Date.now() - 5 )

      return res.json(getFormattedDate(aMinuteAgo))
}


 async function getValidationTime(chargesDetailsHoldTime: any, chargesDetailStartDated:any, endDate:any, chargesDetailsHoldTimeStarted:any){

    if (chargesDetailsHoldTime== 0){
        let time = await getDurationTime(chargesDetailStartDated, endDate)
        return time
    } else {
        let time = await getDurationTime(chargesDetailStartDated, chargesDetailsHoldTimeStarted )
        return time

    }
}


//RESUME GAME
async function resumeGame(req: any, res: any, next: any, ) {
    let resumeGame
    let gameInfo = await gameController.findGame(req.body.gameId)
    let gameTypesDetails = await gameController.findGameType(gameInfo.gameType)

    try {

        resumeGame = await activeGame.findOneAndUpdate({ game: gameInfo, isActive:false },{ $set: { isActive: true },  } )
     
        if (resumeGame == null) {

            return res.status(404).json({
                message: 'Can not find game',
            })
        }

    } catch (err) {
        return res.status(500).json({ message: err })
    }

    let chargesDetails = await findcharge(resumeGame.gameChargeDetails)    
    let dateNow = Date.now() 
    let holdGameTime = await getDurationTime(chargesDetails?.holdTimeStarted, dateNow)    
    let holdTimeUpdated = await chargeDetails.updateOne({ _id: resumeGame.gameChargeDetails}, { $set: { holdTime: holdGameTime.minutes, holdTimeStarted: null },  })

    return res.json({
      timeInhold: holdGameTime.minutes,
     
    })

}



// CLOSE GAME 

async function closeGame(req: any, res: any, next: any,) {
    let deleteGame
   let gameInfo = await gameController.findGame(req.body.gameId)
   let gameTypesDetails = await gameController.findGameType(gameInfo.gameType)

    try {

         deleteGame = await activeGame.findOne({ game: gameInfo })
         if (deleteGame == null) {

            return res.status(404).json({
                message: 'Can not find game',
            })
        }

    } catch (err) {
        return res.status(500).json({ message: err })
    }
    let chargesDetails = await findcharge(deleteGame.gameChargeDetails)
    let dateNow = Date.now()
    let finalDate =   new Date( dateNow - chargesDetails?.holdTime * 60000 )
    
    let time = await getDurationTime(chargesDetails?.startDate, finalDate)
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes,chargesDetails?.minimunChargeCondition)
    let amountUpdated = await chargeDetails.updateOne({ _id: deleteGame.gameChargeDetails}, { $set: { amount: totalAmount, endDate:dateNow },  })

    let formattedDate = getFormattedDate(chargesDetails?.startDate)
    let totalAmountFormatted = formatMoney(totalAmount)

   let closeGame = await activeGame.findOneAndDelete({game:gameInfo})
    return res.json({
    
       totalTimePlayed: `You have been playing for ${time.minutes} minutes and ${time.hours} hours`,   
        message: 'game closed',
        totalAmountFormatted,
        finalDate
    })

  
}



// FREE GAME 

async function setFreeGame(req: any, res: any, next: any,) {

    let freeGame
   let gameInfo = await gameController.findGame(req.body.gameId)
   let gameTypesDetails = await gameController.findGameType(gameInfo.gameType)

    try {

        freeGame = await activeGame.findOne({ game: gameInfo })
         if (freeGame == null) {

            return res.status(404).json({
                message: 'Can not find game',
            })
        }

    } catch (err) {
        return res.status(500).json({ message: err })
    }
    let chargesDetails = await findcharge(freeGame.gameChargeDetails)
    let dateNow = Date.now()
    let finalDate =   new Date( dateNow - chargesDetails?.holdTime * 60000 )
    
    let time = await getDurationTime(chargesDetails?.startDate, finalDate)
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes,chargesDetails?.minimunChargeCondition)
    let amountUpdated = await chargeDetails.updateOne({ _id: freeGame.gameChargeDetails}, { $set: { amount: 0, endDate:dateNow },  })
 
    let freeamount = await findcharge(freeGame.gameChargeDetails)
    let formattedDate = getFormattedDate(chargesDetails?.startDate)


   let closeGame = await activeGame.findOneAndDelete({game:gameInfo})
    return res.json({
    
       totalTimePlayed: `You have been playing for ${time.minutes} minutes and ${time.hours} hours`,   
        message: 'game closed',
        finalDate,
       
        amount: freeamount?.amount
    })

  
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

        let gameupdated = await activeGame.updateOne({ game: gameInfo01 }, { $set: { game: gameInfo02, isActive: true } })

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




module.exports = { startGame, getGameActive, getGameCharge, closeGame, getActivegame, transferGame,getGameListOfCharges, holdGame,resumeGame, test, setFreeGame,startGameByMinute };