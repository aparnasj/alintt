var giph_api_key = 'nlV1KCUTn1bwI9H6j5GQV2RvYfdETWdc'; // Not a good practice.. Should be moved to server and have proxy APIs
var random_id = Math.floor(Math.random() * 1000000000);

function fetchTrendingGifs(page) {
  $.ajax({
    method: 'GET',
    url:
      'http://api.giphy.com/v1/gifs/trending?limit=20&api_key=' +
      giph_api_key +
      '&random_id=' +
      random_id +
      (page ? '&offset=' + page * 20 : ''),
  }).done(function (response) {
    var generatedItems = '';
    for (let i = 0; i < response.data.length; i++) {
      generatedItems +=
        '<div class="col-3 giphy-wrapper"> <div class="giphy-item"> <img src="' +
        response.data[i].images.downsized.url +
        '"> </div> </div>';
    }
    if (!page) $('#giphy-images').html(generatedItems);
    else $('#giphy-images').append(generatedItems);
    window.nextPage = page ? page++ : 2;
  });
}

function searchGiphyImages(page) {
  var q = $('#giphy-search-input').val();
  $.ajax({
    method: 'GET',
    url:
      'http://api.giphy.com/v1/gifs/search?limit=20&api_key=' +
      giph_api_key +
      '&q=' +
      q +
      '&random_id=' +
      random_id +
      (page ? '&offset=' + page * 20 : ''),
  }).done(function (response) {
    var generatedItems = !page
      ? '<div class="search-title">Search results for \'<span class="search-title-key">' +
        q +
        '</span>\' <span onclick="clearSearch()" class="clear-search">Clear</span></div>'
      : '';
    for (let i = 0; i < response.data.length; i++) {
      generatedItems +=
        '<div class="col-3 giphy-wrapper"> <div class="giphy-item"> <img src="' +
        response.data[i].images.downsized.url +
        '"> </div> </div>';
    }
    if (!page) $('#giphy-images').html(generatedItems);
    else $('#giphy-images').append(generatedItems);
    window.nextPage = page ? page++ : 1;
  });
}

function clearSearch() {
  $('#giphy-search-input').val('');
  fetchTrendingGifs();
}

function loadMoreGifs() {
  if ($('#giphy-search-input').val().length <= 0) {
    fetchTrendingGifs(window.nextPage);
  } else {
    searchGiphyImages(window.nextPage);
  }
}

$(document).ready(function () {
  fetchTrendingGifs();
});
