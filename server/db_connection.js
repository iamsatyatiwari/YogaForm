const mongoose = require("mongoose")

// require("dotenv").config();

mongoose.set("strictQuery", false);
const URL = "mongodb+srv://satya:satya@dytedb.lyiwcul.mongodb.net/?retryWrites=true&w=majority";
try {

    mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log("Connected To Database");

} catch (error) {

    console.log("error while loadind the data base", error);

}