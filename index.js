const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const cors = require("cors");

const userRoutes = require("./routes/user.js");
const movieRoutes = require("./routes/movie.js")


dotenv.config();

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: true}));

const corsOptions = {
	origin: ['http://localhost:4000'],
    credentials: true,
    optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Error in the database connection!"));
db.once("open", ()=> console.log("Now connected to MongoDB Atlas."));

app.use('/users', userRoutes);
app.use('/movies', movieRoutes)


if(require.main === module){
	app.listen(process.env.PORT || 3000, ()=> {
		console.log(`API is now running at port ${process.env.PORT || 3000}`);
	})
}

module.exports = {app, mongoose};