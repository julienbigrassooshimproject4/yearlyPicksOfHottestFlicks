# Yearly Picks of Hottest Flicks

## Goal

This app will give users the ability to search for the best movie of any given year, based on vote count and average vote.

## Method

Users enter a year into the input field. The year must be between 1887-2019 to be valid. With this year, the app will make an AJAX call to the Movie Database API, using primary_release_year as the query parameter. This returns data including the movie title, the release year, the rating, as well as the file path to the movie poster.

The API requires use to combine the base URL, the image size, and the file path (stored in the movie data from the initial AJAX call) in order to display the poster. The app makes a secondary AJAX call to obtain the base url and the image size data from a different endpoint. We could have simply hard-coded this URL and image size data, but chose instead to use two promises and the $.when method to piece all the necessary information together.

Based on the two AJAX calls and the user's year input, the app displays the poster and some basic information about the top-rated movie of that particular year, including the title, rating, and a short overview.

## Programming Languages

- HTML
- CSS / SASS
- JavaScript / jQuery

