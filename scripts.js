// Julien Bigras + Soo Y Shim – Project 4

//Pseudo Code


// - create an app namespace called movieApp that will hold all methods
const movieApp = {};

// - collect user input: there will be a number input, and user will type in a year (there will be error handling to ensure that user types in a valid year) TYPE YEAR or TYPE DATE or number and assign a range
// - save user input to variable- make AJAX request with variable representing user input


movieApp.userSubmission = function() {
  $('input[type=submit]').on('click', function(e) {
    e.preventDefault();

    //prevents default result from appearing if user attempts to submit an empty string
    if($('input[type=number]').val() !== '') {
      const userInput = $('input[type=number]').val();
      movieApp.getMovies(userInput);

      movieApp.scroll('main');

      //empty the search box
      $('input[type=number]').val('');
    } else {
      movieApp.errorHandler();
    }
  });
};

//gets called in the if/else statement of user submission
movieApp.errorHandler = function() {
  //displays error message
  $('.warning').removeClass('hide');
  //removes error message when user clicks into text field
  $('input[type=number]').on('click', function(){
    $('.warning').addClass('hide');
  })
}

// movieApp.scrollToResult = function () {
//   $('html, body').animate({
//     scrollTop: "100vh"
//   });
// }

movieApp.scroll = function(section) {
  $('html, body').animate({
    scrollTop: ($(section).offset().top)
  }, 1000);
}

// movieApp.scrollToTop = function () {
//   $('html, body').animate({
//     scrollTop: 0
//   }, 1000);
// }

// Make an ajax call to Movie API
// - “primary_release_year” is the parameter of the query
movieApp.url = 'https://api.themoviedb.org/3/discover/movie';
movieApp.configUrl = 'https://api.themoviedb.org/3/configuration';
movieApp.key = '852b1b7792f98b1e44b5aa474ea2ed2b';

movieApp.getMovies = function(userInput) {
  //Promise1: Make an ajax call to call movie data for userInput
  movieApp.movieCall = $.ajax({
    url: movieApp.url,
    method: 'GET',
    dataType: 'json',
    data: {
      api_key: movieApp.key,
      primary_release_year: userInput,
      sort_by: "vote_count.desc"
      //by default, data is sorted by descending order of popularity in the API
    }
  })
  
  //Promise2: Make an ajax call for configuration data for posters (images url & poster sizes)
  movieApp.configCall =
  $.ajax({
    url: movieApp.configUrl,
    method: 'GET',
    dataType: 'json',
    data: {
      api_key: movieApp.key
    }
  });

  $.when(movieApp.movieCall, movieApp.configCall)
    .then(function (data1, data2) {
      $(".movieInfo").empty();
      $(".poster").empty();

      //movie data
      const movies = data1[0];
      const userMovie = movies.results[0];
      const posterPath = userMovie.poster_path;
      //call displayMovie to update the DOM
      movieApp.displayMovie(userMovie, userInput);
      
      //config data for posters
      const posterConfig = data2[0];
      const baseUrl = posterConfig.images.base_url;
      //poster width of 500px
      const posterSize = posterConfig.images.poster_sizes[4];

      //call displayPoster function
      movieApp.displayPoster(baseUrl, posterSize, posterPath, userMovie);
  
    })
}

//display the data on the page- jquery append movie name and other basic movie info to a previously hidden section, which we will auto-scroll to
movieApp.displayMovie = function(movie, userInput) {
  const $movieYear = $('.userYear').text(userInput);
  const $movieTitle = $(`<h3>`).text(movie.title);
  const $voteCount = $(`<p>`).text(`vote count: ${movie.vote_count}`);
  const $voteAverage = $(`<p>`).text(`vote average: ${movie.vote_average}`);
  const $overview = $(`<p>`).text(movie.overview);
  $('.movieInfo').append($movieTitle, $voteCount, $voteAverage, $overview);
}

//update poster to the DOM
movieApp.displayPoster = function(url, size, path, movie) {
  const movieTitle = movie.title;    
  const posterLink = url + size + path;
  const $posterContainer = $(`<div>`);
  //!!!!!!!!!!!!!!!!!!REVISIT ALT TEXT!!!!!!!!!!!!!!!!!!!!!!!!!!
  const $posterImg = $(`<img src=${posterLink} alt=${movieTitle}/>`);
  $posterContainer.append($posterImg);
  $('.poster').append($posterContainer);
}

// reset 
movieApp.reset = function() {
  $('button').on("click", function() {
    // location.reload(true);
    $('.movieInfo').empty()
    $('.poster').empty();
    $('.userYear').empty();
    movieApp.scroll('header');
  })
}

// - create an init to start movieApp, which will initiate on “click” of submit button
movieApp.init = function() {
  movieApp.userSubmission();
  movieApp.reset();
}

//document ready
$(function() {
  movieApp.init();
});