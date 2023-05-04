// Step 1 - import mongoose - database adapter
import mongoose from 'mongoose';
const Schema = mongoose.Schema; // alias for mongoose.Schema

// Step 2 - Create a Schema that matches the data in the collection
const RoleSchema = new Schema
({

    id: {
        type: Number,
    
    },

    name: {
        type: String,
        require: true   } 
  
})
/*
{
    collection: "roles"
});
*/
// Step 3- Create a Model using the Schema

const Model = mongoose.model("Roles", RoleSchema);
//module.exports = mongoose.model("Role", RoleSchema);

// Step 4 - Export the Model -> converts this file into a module
export default Model;