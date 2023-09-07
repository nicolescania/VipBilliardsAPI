import express from "express";
import gameTypes from '../Models/gameTypes'
import mongoose from "mongoose";
import games from '../Models/game'
import branches from '../Models/branch'

import activeGame from '../Models/activeGame'


// GET GAME TYPES LIST
async function getGameTypeList(req: any, res: any) {

    try {
        const gameType = await gameTypes.find()
        res.json(gameType)
    } catch (err) {
        res.status(500).json({ message: err })
    }

}

// GET GAME LIST
async function getGameList(req: any, res: any) {

    try {
        const game = await games.find()
        res.json(game)
    } catch (err) {
        res.status(500).json({ message: err })
    }

}

// CREATE GAMETYPE
async function createGameType(req: any, res: any) {


    const gameType = new gameTypes({

        name: req.body.name,
        pricePerHour: req.body.pricePerHour,
        pricePerMinute: req.body.pricePerMinute,


    })

    try {
        const newGameType = await gameType.save()
        res.status(201).json(newGameType)
    } catch (err) {
        res.status(400).json({ message: err })
    }


}

// CREATE GAMETYPE
async function createLocation(req: any, res: any) {

    const location = new branches({

        name: req.body.name,

    })

    try {
        const newLocation = await location.save()
        res.status(201).json(newLocation)
    } catch (err) {
        res.status(400).json({ message: err })
    }


}



// CREATE GAME
async function createGame(req: any, res: any) {


    const game = new games({

        name: req.body.name,
        gameType: await findGameType(req.body.gameType),
        location: await findLocation(req.body.locationId),



    })

    try {
        const newgame = await game.save()
        res.status(201).json(newgame)
    } catch (err) {
        res.status(400).json({ message: err })
    }


}

// GET GAME TYPE
async function findGameType(id: any) {

    return await gameTypes.findById(id)

}


// GET LOCATION
async function findLocation(id: any) {

    return await branches.findById(id)

}


// GET GAME 
async function findGame(id: any) {

    return await games.findById(id)


}





// GET GAME INFO
async function gameInfo(req: any, gameinfo: any) {
    let gameType

    try {

        return ({
            name: gameinfo.name,
            gameType: await findGameType(gameinfo.gameType),
            location: await findLocation(gameinfo.location),



        })

    } catch (error) {
        return error
    }


}


// GET GAME TYPE
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

// GET GAME 
async function getGame(req: any, res: any, next: any) {
    let game
    try {
        game = await games.findById(req.params.id)


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

// UPDATE GAME TYPE
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

// UPDATE GAME 
async function updateGame(req: any, res: any) {
    if (req.body.name != null) {

        res.game.name = req.body.name

        try {

            const updateGame = await res.game.save()
            res.json(updateGame)

        } catch (error) {
            res.status(400).json({ message: error })

        }

    }

}


// DELETE GAME TYPE
async function deleteGameType(req: any, res: any) {
    let id = req.params.id;

    try {

        await res.gameType.deleteOne({ id })
        res.json({ message: 'game deleted' })
    } catch (err) {

        res.status(500).json({ message: err })

    }
}

// DELETE GAME

async function deleteGame(req: any, res: any) {
    let id = req.params.id;

    try {

        await res.game.deleteOne({ id })
        res.json({ message: 'game deleted' })
    } catch (err) {

        res.status(500).json({ message: err })

    }
}


// ADMINISTRATOR VIEW

export async function DisplayGameListPage(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>
{
    try {

     
         const gamesCollection = await games.find()
         .populate('gameType')
         .populate('location')
         .exec();
         //console.log(gamesCollection)

       res.render('index', { title: 'Administrator', page: 'administrator', games:gamesCollection  });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export async function DisplayEditPage(req: express.Request, res: express.Response, next: express.NextFunction): void 
{
  let id = req.params.id;

  // pass the id to the db and read the movie into the edit page


  try {
    // Use findById to find a document by its ID
    const result = await games.findById(id);

    res.render('index', { title: 'Administrator', page: 'edit',  });

  } catch (error) {
    // Handle errors (e.g., database connection error)
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



module.exports = { getGameTypeList, createGameType, getGameType, updateGameType, deleteGameType, getGameList, createGame, getGame,  updateGame, deleteGame, gameInfo, findGame, findGameType,DisplayGameListPage,createLocation,findLocation,DisplayEditPage };