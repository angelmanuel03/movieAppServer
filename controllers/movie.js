const Movie = require("../models/Movie");
const User = require("../models/User");
const { errorHandler } = require("../auth.js");

module.exports.addMovie = (req, res) => {

    let newMovie = new Movie({
        title: req.body.title,
        director : req.body.director,
        year : req.body.year,
        description: req.body.description,
        genre: req.body.genre,
    });

    Movie.findOne({ title: req.body.title })
    .then(existingMovie =>{
        if(existingMovie){

            return res.status(409).send({ message: 'Movie already exists'})
        
        }else{
            return newMovie.save()
            .then(result => {
                res.status(201).send(result)
            })
            .catch(error => errorHandler(error, req, res))
        }

    })
    .catch(error => errorHandler(error, req, res))
}


module.exports.getMovies = (req, res) => {
    return Movie.find({})
        .then(movies => {
            if (movies.length > 0) {
                return res.status(200).send({movies: movies});
            }
            return res.status(404).send({
                message: 'No movies found'
            });
        })
        .catch(error => errorHandler(error, req, res));
};


module.exports.getMovie = (req, res) => {
    Movie.findById(req.params.movieId)
    .then(movie => {
        if(movie) {
            return res.status(200).send(movie);
        } else {
            return res.status(404).send({ message: 'Movie not found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); 
};


module.exports.updateMovie = (req, res) => {

    let updatedMovie = {
        title: req.body.title,
        director : req.body.director,
        year : req.body.year,
        description: req.body.description,
        genre: req.body.genre
    }

    return Movie.findByIdAndUpdate(req.params.movieId, updatedMovie)
    .then(movie => {
        if(movie){
            res.status(200).send({ 
                message: 'Movie updated successfully', 
                updatedMovie: movie
            });
        }else{
            res.status(404).send({ message: 'Movie not found'});
        }

    })
    .catch(error => errorHandler(error, req, res));
}


module.exports.deleteMovie = (req, res) => {
    return Movie.findByIdAndDelete(req.params.movieId)
    .then(movie => {
        if(movie) {
            return res.status(200).send({
                message: 'Movie deleted successfully'
            });
        } else {
            return res.status(404).send({ message: 'Movie not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.addComment = (req, res) => {

    MoviesCollection.findById(req.params.movieId)
    .then(movie => {
        console.log(movie)
        if (!movie){
            return res.status(404).send({message: 'ID not found'})
        }else {
            movie.comments.push({
                userId: req.user.id,
                comment: req.body.comment
            })

            return movie.save()
           .then(updatedMovie => {
            res.status(200).send({message: "comment added successfully", updatedMovie: updatedMovie})
           }).catch(error => errorHandler(error, req, res))


        }
    }).catch(error => errorHandler(error, req, res))
}


module.exports.getComments = (req, res) => {
    return Movie.findById(req.params.movieId)
        .then(movie => {
            if (movie) {
                res.status(200).send({
                    comments: movie.comments
                });
            } else {
                res.status(404).send({ message: 'Movie not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};
