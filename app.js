const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));

///////////// MONGOOSE SECTION ///////////
mongoose.set("strictQuery", true);
const url =
  "mongodb+srv://" +
  process.env.DATABASE_USERNAME +
  ":" +
  process.env.DATABASE_PASSWORD +
  "@cluster0.fzfjyqq.mongodb.net/bestMoviesIn2022?authSource=admin";

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to database !!");
  })
  .catch((err) => {
    console.log("Connection failed !! " + err.message);
  });
// schema
const bestMoviesSchema = new mongoose.Schema({
  no: Number,
  name: String,
  summary: String,
});
// model
const Movie = new mongoose.model("Movie", bestMoviesSchema);

/////////////// TARGETING ALL MOVIES ////////////////////
app
  .route("/best-movies-2022")
  //////////// READ MOVIES////////////////
  .get(function (req, res) {
    Movie.find({}, function (err, foundMovies) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundMovies);
      }
    });
  })
  ///////////// ADD NEW MOVIE ////////////
  .post(function (req, res) {
    const newMovies = new Movie({
      no: req.body.no,
      name: req.body.name,
      summary: req.body.summary,
    });
    newMovies.save(function (err) {
      if (!err) {
        res.send("successfully save new movie in Database");
      }
    });
  })

  //////////// DELETE ALL IN MOVIE /////////////////
  .delete(function (req, res) {
    Movie.deleteMany({}, function (err) {
      if (!err) {
        res.send("successfully delete ALL movies");
      }
    });
  });

/////////////// TARGETING ALL SPEFIC MOVIE  ////////////////////
app
  .route("/best-movies-2022/:moviesTitle")

  // READ SPECIFIC MOVIES
  .get(function (req, res) {
    Movie.findOne({ name: req.params.moviesTitle }, function (err, foundMovie) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundMovie);
      }
    });
  })
  // UPDATE SPECIFIC MOVIE LIST
  .put(function (req, res) {
    Movie.updateOne(
      { name: req.params.moviesTitle },
      { $set: req.body },
      function (err) {
        if (err) {
          res.send(err);
        } else {
          res.send("successfully update list movie");
        }
      }
    );
  })
  //DELETE SPECIFIC MOVIE LIST
  .delete(function (req, res) {
    Movie.deleteOne({ name: req.params.moviesTitle }, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("successfully delete one movie");
      }
    });
  });
////////// CONNECTION ///////////
let port = process.env.PORT;
if (port == null || port == "") {
  port = 1111;
}
app.listen(port, function () {
  console.log("Server started successfully");
});
