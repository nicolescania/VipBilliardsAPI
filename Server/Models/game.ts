import mongoose, { Schema, Document } from 'mongoose';
import { PassportLocalModel } from 'mongoose';



interface Igame extends Document {
    name: String;
    gameType: mongoose.Types.ObjectId;
 

}

const gamechema: Schema<Igame> = new Schema
    ({

        name: { type: String, require: true },
        gameType: { type: Schema.Types.ObjectId, ref: 'gameTypes', required: true }

        


    })



    //  Create a Model using the Schema
const Model = mongoose.model<Igame>("games", gamechema);

//  Export the Model -> converts this file into a module
export default Model;