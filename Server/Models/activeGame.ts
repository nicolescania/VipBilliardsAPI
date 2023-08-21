import mongoose, { Schema, Document } from 'mongoose';
import { PassportLocalModel } from 'mongoose';


interface IactiveGame extends Document {
    gameChargeDetails: mongoose.Types.ObjectId;
    game: mongoose.Types.ObjectId;
    isActive:Boolean


}


const activeGameSchema: Schema<IactiveGame> = new Schema


    ({


        gameChargeDetails: { type: Schema.Types.ObjectId, ref: 'chargeDetails', required: true },
        game: { type: Schema.Types.ObjectId, ref: 'games', required: true },
        isActive: { type: Boolean, require: true, },

    })



const Model = mongoose.model<IactiveGame>("activeGame", activeGameSchema);

//  Export the Model -> converts this file into a module
export default Model;