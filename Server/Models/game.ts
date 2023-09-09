import mongoose, { Schema, Document } from 'mongoose';
import { PassportLocalModel } from 'mongoose';



interface Igame extends Document {
    name: String;
    gameType: mongoose.Types.ObjectId;
    location: mongoose.Types.ObjectId;
}

const gameSchema: Schema<Igame> = new Schema

    ({
        name: { type: String, require: true },
        gameType: { type: Schema.Types.ObjectId, ref: 'gameTypes', required: true },
        location: { type: Schema.Types.ObjectId, ref: 'branches', required: true }
    })





//  Create a Model using the Schema
const Model = mongoose.model<Igame>("games", gameSchema);


//  Export the Model -> converts this file into a module
export default Model;