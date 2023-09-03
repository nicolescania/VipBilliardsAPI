// Step 1 - import mongoose - database adapter
import mongoose, { Schema, Document } from 'mongoose';
import Roles from './roles';
import bcrypt from 'bcrypt';


///const Schema = mongoose.Schema; // alias for mongoose.Schema
import passportLocalMongoose from 'passport-local-mongoose';



interface IUser extends Document {
  firstName: String;
  lastName: String;
  emailAddress: String;
  password: string;
  role: mongoose.Types.ObjectId;
  location: mongoose.Types.ObjectId;




}


// Step 2 - Create a Schema that matches the data in the collection
const UserSchema: Schema<IUser> = new Schema
  ({

    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    emailAddress: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: Schema.Types.ObjectId, ref: 'Roles', required: true },
    location: { type: Schema.Types.ObjectId, ref: 'branches', required: true }




  })



UserSchema.pre<IUser>('save', function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a salt
  const saltRounds = 10;
  const salt: string = bcrypt.genSaltSync(saltRounds);

  // Hash the password
  const hashedPassword: string = bcrypt.hashSync(this.password, salt);

  // Set the hashed password
  this.password = hashedPassword;

  next();
});



// Step 3- Create a Model using the Schema
const Model = mongoose.model<IUser>("Users", UserSchema);

// Step 4 - Export the Model -> converts this file into a module
export default Model;