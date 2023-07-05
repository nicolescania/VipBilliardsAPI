import mongoose, { Schema, Document } from 'mongoose';



interface IgameTypes extends Document {
    name: String;
    pricePerHour: Number;
    pricePerMinute: Number;


}

const UserSchema: Schema<IgameTypes> = new Schema
    ({

        name: { type: String, require: true },
        pricePerHour: { type: Number, require: true },
        pricePerMinute: { type: Number, require: true },


    })



    //  Create a Model using the Schema
const Model = mongoose.model<IgameTypes>("gameTypes", UserSchema);

//  Export the Model -> converts this file into a module
export default Model;