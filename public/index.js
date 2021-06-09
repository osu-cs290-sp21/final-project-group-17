/*
 * 
 * 
 */
function getPersonIdFromURL() {
  var path = window.location.pathname;
  var pathParts = path.split('/');
  if (pathParts[1] === 'list') {
      return '/list/' + pathParts[2];
  } else if (pathParts[1] === 'item') {
      return '/item/' + pathParts[2];
  } else if (pathParts[1] === 'esports') {
      return '/esports/' + pathParts[2];
  } else {
      return null;
  }
}

function handleModalAcceptClick() {

  var photoURL = document.getElementById('photo-url-input').value.trim();
  var caption = document.getElementById('photo-caption-input').value.trim();

  
  if (!photoURL || !caption) {
    alert("You are missing either the url or caption, Please try again");
  } else {

    var req = new XMLHttpRequest();
    var reqUrl = getPersonIdFromURL() + '/addPhoto';
    
    console.log("== reqUrl:", reqUrl)
    req.open('POST', reqUrl)

    var photo = {
      url: photoURL,
      caption: caption
    }
    var reqBody = JSON.stringify(photo)
    console.log("== reqBody:", reqBody)
    console.log("== reqBody.url:", reqBody.url)
    console.log("== typeof(reqBody):", typeof(reqBody))

    req.setRequestHeader('Content-Type', 'application/json')

    req.addEventListener('load', function (event) {
      if (event.target.status === 200) {
        var photoCardTemplate = Handlebars.templates.photoCard;
        var newPhotoCardHTML = photoCardTemplate(photo);
        var photoCardContainer = document.querySelector('.photo-card-container');
        photoCardContainer.insertAdjacentHTML('beforeend', newPhotoCardHTML);
      } else {
        alert("Failed to add photo to database; error:\n\n" + event.target.response)
      }
    })
   
    req.send(reqBody)

    hideModal();
   
  }
}

function showModal() {

  var modal = document.getElementById('add-photo-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  modal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');

}

function clearModalInputs() {

  var modalInputElements = document.querySelectorAll('#add-photo-modal input')
  for (var i = 0; i < modalInputElements.length; i++) {
    modalInputElements[i].value = '';
  }

}

function hideModal() {

  var modal = document.getElementById('add-photo-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  modal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');

  clearModalInputs();

}

/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */
window.addEventListener('DOMContentLoaded', function () {

  var addPhotoButton = document.getElementById('add-photo-button');
  addPhotoButton.addEventListener('click', showModal);

  var modalAcceptButton = document.getElementById('modal-accept');
  modalAcceptButton.addEventListener('click', handleModalAcceptClick);

  var modalHideButtons = document.getElementsByClassName('modal-hide-button');
  for (var i = 0; i < modalHideButtons.length; i++) {
      modalHideButtons[i].addEventListener('click', hideModal);
  }

});


$(document).ready(function () {
  // search every keyup in the search bar.
  $('#search-bar').keyup(function () {
    var searchInput = this.value.toLowerCase(); 
    var list = $('.person-card');
    for (var i = 0; i < list.length; ++i) {
      let id = list[i].id;
      let idLower = id.toLowerCase();
      if (idLower.includes(searchInput) === false) {
          $("[id='" + id + "']").css('display', 'none');
      } else {
          $("[id='" + id + "']").css('display', 'block');
      }
    }
  });
})

