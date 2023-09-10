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
        .populate('gameType')
        .populate('location')
        .exec()
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
        res.gameType.pricePerMinute = req.body.pricePerMinute

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
   

       res.render('index', { title: 'Administrator', page: 'administrator', games:gamesCollection  });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export async function DisplayEditPage(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>
{
  let id = req.params.id;

  try {
    // Use findById to find a document by its ID
    const result = await games.findById(id);
    console.log(result)
    res.render('index', { title: 'Edit', page: 'edit', game:result  });

  } catch (error) {
    // Handle errors (e.g., database connection error)
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function ProcessEditPage(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>

{


    try {
        const id = req.params.id;
        
        const oldGame = await games.findById(id)
       

      
        let updatedGame = new games
        ({
            "_id": id,
          "name": req.body.gameName,
          "gameType":req.body.gameType,
          "location": req.body.location
          
        });
    
        games.updateOne({_id: id}, updatedGame)
        {
         
      // edit was successful -> go to the movie-list page
            res.redirect('/administrator');
      
        }


 
         
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
export function DisplayAddPage(req: express.Request, res: express.Response, next: express.NextFunction): void 
{
  res.render('index', { title: 'Add', page: 'edit', game: '', })
}

export async function ProcessAddPage(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>


{
    const game = new games

    ({
        "name": req.body.gameName,
        "gameType":req.body.gameType,
        "location": req.body.location
      });


      try {
        const newgame = await game.save()
        res.redirect('/administrator');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

}








export async function ProcessDeletePage(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>

{
    try {
        const id = req.params.id;
        
        await games.deleteOne({ _id: id });
        res.redirect('/administrator');
         
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}





module.exports = { getGameTypeList, createGameType, getGameType, updateGameType, deleteGameType, getGameList, createGame, getGame,  updateGame, deleteGame, gameInfo, findGame, findGameType,DisplayGameListPage,createLocation,findLocation,DisplayEditPage,ProcessDeletePage,ProcessAddPage,DisplayAddPage,ProcessEditPage };