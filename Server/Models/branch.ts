// Step 1 - import mongoose - database adapter

import mongoose, { Schema, Document } from 'mongoose';



interface IBranches extends Document {
    name: string;
   
  }
  


// Step 2 - Create a Schema that matches the data in the collection
const brancheSchema: Schema<IBranches> = new Schema
({

        name: {
        type: String,
        require: true   }
  
})

// Step 3- Create a Model using the Schema

const Model = mongoose.model<IBranches>("branches", brancheSchema);


// Step 4 - Export the Model -> converts this file into a module
export default Model;