var giph_api_key = 'nlV1KCUTn1bwI9H6j5GQV2RvYfdETWdc'; // Not a good practice.. Should be moved to server and have proxy APIs
var random_id = Math.floor(Math.random() * 1000000000);

function fetchTrendingGifs(page, isModal) {
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
        '<div class="col-3 giphy-wrapper"> <div class="giphy-item" ' +
        (isModal
          ? 'onclick="selectGiphy(\'' +
            response.data[i].images.downsized.url +
            '\')"'
          : '') +
        ' > <img src="' +
        response.data[i].images.downsized.url +
        '"> </div> </div>';
    }
    if (!page)
      $('#giphy-images' + (isModal ? 'modal' : '')).html(generatedItems);
    else $('#giphy-images' + (isModal ? 'modal' : '')).append(generatedItems);
    window.nextPage = page ? page++ : 2;
  });
}

function searchGiphyImages(page, isModal) {
  var q = $('#giphy-search-input' + (isModal ? 'modal' : '')).val();
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
        '<div class="col-3 giphy-wrapper"> <div class="giphy-item" ' +
        (isModal
          ? 'onclick="selectGiphy(\'' +
            response.data[i].images.downsized.url +
            '\')"'
          : '') +
        '> <img src="' +
        response.data[i].images.downsized.url +
        '"> </div> </div>';
    }
    if (!page)
      $('#giphy-images' + (isModal ? 'modal' : '')).html(generatedItems);
    else $('#giphy-images' + (isModal ? 'modal' : '')).append(generatedItems);
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

function selectGiphy(url) {
  window.quillEditorWithGiphy.insertEmbed(
    window.quillEditorWithGiphy.scroll.length(),
    'image',
    url
  );
  $('#giphyModal').modal('hide');
}

$(document).ready(function () {
  fetchTrendingGifs();
  window.quillEditor = new Quill('#quill-editor', {
    modules: { toolbar: '#toolbar' },
    theme: 'snow',
  });

  window.quillEditorWithGiphy = new Quill('#quill-editor-withgiphy', {
    modules: { toolbar: '#toolbar-withgiphy' },
    theme: 'snow',
  });

  $('#giphyModal').on('show.bs.modal', function (e) {
    $('#giphy-search-inputmodal').val('');
    fetchTrendingGifs(null, true);
  });
});
