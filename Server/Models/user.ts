// Step 1 - import mongoose - database adapter
import mongoose, { PassportLocalModel, PassportLocalSchema } from 'mongoose';
import Roles from './roles';
const Schema = mongoose.Schema; // alias for mongoose.Schema
import passportLocalMongoose from 'passport-local-mongoose';

// Step 2 - Create a Schema that matches the data in the collection
const UserSchema = new Schema
({

    id: Number,
    username: String,
    fisrtName: String,
    lastName: String,
    emailAddress: String,
    password: String,
    role: { type: Schema.Types.ObjectId, ref: 'Roles' },
    Created: 
    {
        type: Date,
        default: Date.now()
    },
    Updated: 
    {
        type: Date,
        default: Date.now()
    }
})




// Step 3- Create a Model using the Schema
const Model = mongoose.model("Users", UserSchema);

// Step 4 - Export the Model -> converts this file into a module
export default Model;