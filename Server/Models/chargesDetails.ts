import mongoose, { Schema, Document } from 'mongoose';
import { PassportLocalModel } from 'mongoose';


interface IchargeDetails extends Document {
    name: String;
    game: mongoose.Types.ObjectId;
    amount: Number;
    duration: Number;
    startDate: Date;
    endDate: Date;



}

const chargeDetailsSchema: Schema<IchargeDetails> = new Schema


    ({

       
        game: { type: Schema.Types.ObjectId, ref: 'games', required: true },
        amount: { type: Number, require: true },
        duration: { type: Number, require: true, },
        startDate:{  type: Date, },
        endDate: { type: Date, require: true, }


        /* amount
- duration
- startDate
- endDate
- holdDuration =
- holdDateStarted =post
- isHolded =*/


    })

//  Create a Model using the Schema
const Model = mongoose.model<IchargeDetails>("chargeDetails", chargeDetailsSchema);

//  Export the Model -> converts this file into a module
export default Model;