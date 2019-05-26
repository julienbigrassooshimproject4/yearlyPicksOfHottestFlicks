// Julien Bigras + Soo Y Shim – Project 4

//create an app namespace called movieApp that will hold all methods
const movieApp = {};

// on submit, collect user input: there will be a number input
movieApp.userSubmission = function() {
  $('input[type=submit]').on('click', function(e) {
    //prevent default behavior of submit
    e.preventDefault();

    //error handling: 
    //prevents API's default result from appearing if user attempts to submit an empty string
    if (
      $("input[type=number]").val() !== "" &&
      parseInt($("input[type=number]").val()) < 2020 &&
      parseInt($("input[type=number]").val()) > 1877
    ) {
      // save user input to variable
      const userInput = $("input[type=number]").val();

      movieApp.getMovies(userInput);

      //empty the search box
      $("input[type=number]").val("");
    } else {
      movieApp.errorHandler();
    }
  });
};

//error handling:
//gets called in the if/else statement of user submission
movieApp.errorHandler = function() {
  //displays error message
  $('.warning').removeClass('hide');
  //removes error message when user clicks or selects into input field
  $('input[type=number]').on('select click focus', function(){
    $('.warning').addClass('hide');
  })
}

//scroll: to movie section
movieApp.scrollToResult = function() {
  $("html, body").animate({
      scrollTop: $('main').offset().top
    },1000);
};

//scroll: to top
movieApp.scrollToTop = function() {
  $("html, body").animate({
      scrollTop: 0
    },1000);
};

// make an ajax call to Movie API
// -“primary_release_year” is the parameter of the query
movieApp.url = 'https://api.themoviedb.org/3/discover/movie';
movieApp.configUrl = 'https://api.themoviedb.org/3/configuration';
movieApp.key = '852b1b7792f98b1e44b5aa474ea2ed2b';

//make AJAX requests with user input
movieApp.getMovies = function(userInput) {
  //Promise1: make an ajax call to call movie data for userInput
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
  
  //Promise2: make an ajax call for configuration data for posters (images url & poster sizes)
  movieApp.configCall =
  $.ajax({
    url: movieApp.configUrl,
    method: 'GET',
    dataType: 'json',
    data: {
      api_key: movieApp.key
    }
  });

  //when calls the two promises
  $.when(movieApp.movieCall, movieApp.configCall)
    //when the both results come back, to the following:
    .then(function (data1, data2) {
      //clean up movie Info before loading a new info
      $(".movieInfo").empty();
      $(".poster").empty();
      $('.userYear').empty();

      //displays the main section which contains the results of the ajax call
      $('main').removeClass('hide');
      $('footer').removeClass('hide');

      //scroll to the result section
      movieApp.scrollToResult();

      //Promise1 result
      //save received movie data in variables
      const movies = data1[0];
      const userMovie = movies.results[0];
      const posterPath = userMovie.poster_path;

      //call displayMovie to update the DOM
      movieApp.displayMovie(userMovie, userInput);
      
      //Promise2 result
      //save config data for posters to variables
      const posterConfig = data2[0];
      const baseUrl = posterConfig.images.base_url;
      //poster width of 342px
      const posterSize = posterConfig.images.poster_sizes[3];

      //call displayPoster to update the DOM
      movieApp.displayPoster(baseUrl, posterSize, posterPath, userMovie);
  
    })
    .fail(function(err1, err2) {
      alert(`Try again later please!!!`)
    })
}

//display the data on the page
//jquery append movie name and other basic movie info to a previously hidden section, which we will auto-scroll to
movieApp.displayMovie = function(movie, userInput) {
  $('.userYear').text(userInput);
  const $movieTitle = $(`<h3>`).text(movie.title);
  const $voteCount = $(`<p class="voteCount">`).text(`Vote Count: ${movie.vote_count}`);
  const $voteAverage = $(`<p class="voteAverage">`).text(`Vote Average: ${movie.vote_average}`);
  const $overviewTitle = $(`<p class="overview">`).text(`Overview:`);
  const $overview = $(`<p>`).text(movie.overview);
  $('.movieInfo').append($movieTitle, $voteCount, $voteAverage, $overviewTitle, $overview);
}

//update poster to the DOM
movieApp.displayPoster = function(url, size, path, movie) {
  const movieTitle = movie.title;      
  const posterLink = url + size + path;
  const $posterContainer = $(`<div>`);
  const img = `<img src=${posterLink} alt='hey'/>`;
  const $posterImg = $(img);
  $posterContainer.append($posterImg);
  $posterImg.attr("alt", movieTitle);
  $('.poster').append($posterContainer);
}

// on click reset, go to top and empty the current movie info
movieApp.reset = function() {
  $('button').on("click", function() {
    
    //scroll to top
    movieApp.scrollToTop('header');
  })
}

//create an init to start movieApp, which will initiate on “click” of submit button
movieApp.init = function() {
  movieApp.userSubmission();
  movieApp.reset();
}

//document ready
$(function() {
  movieApp.init();
});