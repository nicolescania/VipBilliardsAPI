import express from "express";
import chargeDetails from '../Models/chargesDetails'
import mongoose from "mongoose";
import activeGame from '../Models/activeGame'
import gameTypes from '../Models/gameTypes'
import games from '../Models/game'
import { json } from "stream/consumers";
import { param } from "jquery";

import moment from 'moment-timezone';





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

function zoneTimeChanged() {

    const torontoTimezone = 'America/Toronto';

    // Get the current date and time in the 'America/Toronto' time zone
    const now = new Date();
    const options = { timeZone: torontoTimezone };
    const torontoDate = new Date(now.toLocaleString('en-US', options));
  
    return torontoDate;

}

// START GAME
async function startGame(req: any, res: any) {


    const gameInfo = await games.findOne({_id: req.body.gameId }) 
    .populate('gameType')
    .populate('location')
    .exec()
    

    let totalAmount = getAmount(gameInfo.gameType.pricePerHour, gameInfo.gameType.pricePerMinute, 60,true)


    const startgame = new chargeDetails({

        // Game Info
        game: gameInfo,

        // total Amount
        amount: totalAmount,

        // Time that game started
        startDate: zoneTimeChanged(), // Convert moment object to Date

        //startDate:  Date.now(),

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


    const gameInfo = await games.findOne({_id: req.body.gameId }) 
    .populate('gameType')
    .populate('location')
    .exec()
    

    let totalAmount = getAmount(gameInfo.gameType.pricePerHour, gameInfo.gameType.pricePerMinute, 60,false)



    const startgame = new chargeDetails({

        // Game Info
        game: gameInfo,

        // total Amount
        amount: totalAmount,

        // Time that game started
        startDate: zoneTimeChanged(),

        holdTime: 0  ,
        
        minimunChargeCondition: false,

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

// GET TOTAL DURATION TIME OF A TABLE
async function getDurationTime(startDate: any, endDate: any,) {


    const differenceInMilliseconds = endDate - startDate;
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    const differenceInHours = Math.floor(differenceInMinutes / 60);
   



    const durationTime = {

        hours: differenceInHours, 
        minutes: differenceInMinutes, 
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



// CALCULATE REMAINING MINUTES

function getRemainingMinutes(minutes: any, hours: any)
{
    const remainingMinutes = minutes - (hours * 60);

    const durationTime = {

        hours: hours + Math.floor(remainingMinutes / 60),
        minutes: remainingMinutes % 60,    
                    
    }

    return durationTime
}

// GET GAME ACTIVE
async function getGameActive1(req: any, res: any, next: any) {

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
    let endDate = zoneTimeChanged()

    let time = await getValidationTime(chargesDetails?.holdTime,chargesDetails?.startDate, endDate, chargesDetails?.holdTimeStarted)

    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes,chargesDetails?.minimunChargeCondition)
    let formattedDate = getFormattedDate(chargesDetails?.startDate)
    let totalAmountFormatted = formatMoney(totalAmount)
    let holdTimeStarted = getFormattedDate(chargesDetails?.holdTimeStarted)
    let holdTime = await getDurationTime(chargesDetails?.holdTimeStarted, endDate)
    let remainingTime = getRemainingMinutes(time.minutes, time.hours)
    let remainingHoldTime = getRemainingMinutes(holdTime.minutes, holdTime.hours)
    


    return res.json({
        gameActiveExist: true,
        game: gameInfo.name,
        type: gameTypesDetails.name,
        gameStarted: ` ${formattedDate.month} ${formattedDate.day} - ${formattedDate.hours}:${formattedDate.minutes}${formattedDate.ampm}` , 
        timePlaying: `${remainingTime.hours} hours, ${remainingTime.minutes} minutes`,
        charge: totalAmountFormatted,
        gameStatus: gameactive?.isActive,
        holdTimeStarted,
        holdTime: `${remainingHoldTime.hours} hours, ${remainingHoldTime.minutes} minutes`,
        




    })

}


// GET GAME ACTIVE
async function getGameActive(req: any, res: any, next: any) {
  let gameactive

    try {

        gameactive = await activeGame.findOne({ game: req.body.gameId }) 
        .populate('gameChargeDetails')
        .populate({
            path: 'game',
            populate: [
              { path: 'gameType' },
              { path: 'location' }
            ]
          })
        .exec();

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

     let endDate = zoneTimeChanged()
     let time = await getValidationTime(gameactive.gameChargeDetails.holdTime,gameactive.gameChargeDetails.startDate, endDate, gameactive.gameChargeDetails.holdTimeStarted)   
     let totalAmount = getAmount(gameactive.game.gameType.pricePerHour, gameactive.game.gameType.pricePerMinute, time.minutes,gameactive.gameChargeDetails.minimunChargeCondition)   
     let formattedDate = getFormattedDate(gameactive.gameChargeDetails.startDate)
     let totalAmountFormatted = formatMoney(totalAmount)
     let remainingTime = getRemainingMinutes(time.minutes, time.hours)

//    if (gameactive.isActive == false) {
    let holdTimeStarted = getFormattedDate(gameactive.gameChargeDetails.holdTimeStarted)
    let holdTime = await getDurationTime(gameactive.gameChargeDetails.holdTimeStarted, endDate)  
   let remainingHoldTime = getRemainingMinutes(holdTime.minutes, holdTime.hours)

    //  return res.json({
    //     // holdTimeStarted,
    //     //holdTime: `${remainingHoldTime.hours} hours, ${remainingHoldTime.minutes} minutes`,
    //  })
//    }
  


    
    //return res.json(gameactive)

    return res.json({
        gameActiveExist: true,
        game: gameactive.game.name,
        type: gameactive.game.gameType.name,
        gameStarted: ` ${formattedDate.month} ${formattedDate.day} - ${formattedDate.hours}:${formattedDate.minutes}${formattedDate.ampm}` , 
        timePlaying: `${remainingTime.hours} hours, ${remainingTime.minutes} minutes`,
        charge: totalAmountFormatted,
        gameStatus: gameactive?.isActive,
      
        holdTimeStarted,
        holdTime: `${remainingHoldTime.hours} hours, ${remainingHoldTime.minutes} minutes`,
        

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
    
    let dateNow = zoneTimeChanged()
    let formattedDateHold = getFormattedDate(dateNow)
    let chargesDetails = await findcharge(holdGame.gameChargeDetails)   
    let time = await getDurationTime(chargesDetails?.startDate, chargesDetails?.holdTimeStarted) 
    let Holdtime = await getDurationTime(chargesDetails?.holdTimeStarted, dateNow)
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes,chargesDetails?.minimunChargeCondition)

    let holdTimeUpdated = await chargeDetails.updateOne({ _id: holdGame.gameChargeDetails}, { $set: { holdTimeStarted: dateNow,  },  })

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
    // const startDate = new Date("2023-09-17T08:00:00");
    // const endDate = new Date("2023-09-17T10:30:00");
    // const duration = await getDurationTime(startDate, endDate);

    // return res.json(duration)
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
    let dateNow = zoneTimeChanged()
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
    let dateNow = zoneTimeChanged()
    let finalDate =   new Date( dateNow - chargesDetails?.holdTime * 60000 )
    
    let time = await getDurationTime(chargesDetails?.startDate, finalDate)
   
    let totalAmount = getAmount(gameTypesDetails.pricePerHour, gameTypesDetails.pricePerMinute, time.minutes,chargesDetails?.minimunChargeCondition)
    const ONTARIOTAXES = 0.13
    let taxesResults = ONTARIOTAXES * totalAmount
    let totalAmountAfterTaxes = taxesResults + totalAmount
   let formattedResult = totalAmountAfterTaxes.toFixed(2)
    let amountUpdated = await chargeDetails.updateOne({ _id: deleteGame.gameChargeDetails}, { $set: { amount: formattedResult, endDate:dateNow, duration: time.minutes },  })

    let formattedDate = getFormattedDate(chargesDetails?.startDate)
    let totalAmountFormatted = formatMoney(totalAmount)

   let closeGame = await activeGame.findOneAndDelete({game:gameInfo})
    return res.json({
    
       totalTimePlayed: `You have been playing for ${time.minutes} minutes and ${time.hours} hours`,   
        message: 'game closed',
        totalAmountFormatted,
        finalDate,
     
    })

  
}

async function deleteChargeById(req: any, res:any){
    {
        try {
            const id = req.params.id;
            
            await chargeDetails.findByIdAndDelete({ _id: id });
            res.json('charge deleted');
             
        } catch (error) {
            res.status(500).json({ message: error })

        }
    }
    
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
    let dateNow = zoneTimeChanged()
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



const getFormattedDateNow = (date:any) => {


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

// Función para buscar múltiples registros en la base de datos
async function getGameListOfCharges(req: any, res:any) {

    try {
      // Utiliza el método find() para buscar múltiples registros
      const charges = await chargeDetails.find({ location: req.query.locationId,  startDate: { $gte: req.query.startDate },
        endDate: { $lte: req.query.endDate }  }).sort({ endDate: -1 })
        .populate('location')
        .populate('game')
        .exec();
  

      // Format the date fields in the charges array
      const formattedCharges = charges.map((charge) => ({
        ...charge.toObject(),
        startDate: getFormattedDateNow(charge.startDate),
        endDate: getFormattedDateNow(charge.endDate),
      }));
  
      return res.json(formattedCharges);

    } catch (error) {
      console.error('Error al buscar cargos:', error);
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




module.exports = { startGame, getGameActive, getGameCharge, closeGame, getActivegame, transferGame,getGameListOfCharges, holdGame,resumeGame, test, setFreeGame,startGameByMinute ,deleteChargeById, getDurationTime};