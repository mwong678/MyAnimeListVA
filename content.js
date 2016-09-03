var txt;
var listOfTitles = [];
var listOfTitlesHash = {};
$(document).ready(function() {
  init();
});

function init() {
  var name = getUserName();
  if (!name) {
    console.log("User is not logged in!");
    return;
  }

  var xhttp = new XMLHttpRequest();
  var url = 'https://myanimelist.net/animelist/' + name;
  xhttp.onload = function() {
    if (parseXHTTP(xhttp.responseText)) {
      //console.log(listOfTitlesHash);
      highLightTitles(listOfTitles);
    } else {
      console.log("Failed to parse user anime list");
    }
  };
  xhttp.onerror = function() {
    console.log("XHTTP ERROR");
  };
  xhttp.open("GET", url, true);
  xhttp.send(null);
  return true;

}

function getUserName() {
  userName = null;
  var userNameLink = document.getElementsByClassName("header-profile-link")[0];
  if (!userNameLink) {
    return null;
  } else {
    userName = userNameLink.text;
  }
  return userName;
}

function highLightTitles(list) {
  var tables = document.getElementsByTagName("Table");
  var row = tables[1].getElementsByTagName("TR");
  var titleTable = row[0].getElementsByTagName("Table");
  if (titleTable.length > 0) {
    for (var i = 0, row; row = titleTable[0].rows[i]; i++) {
      for (var j = 0, col; col = row.cells[j]; j++) {
        if (j == 1) {
          aLink = col.getElementsByTagName("A");
          if (searchTitle(aLink[0].text)) {
            if (listOfTitlesHash[aLink[0].text] != 6){
              //will not highlight planned to watch titles
              row.setAttribute("style", "background-color: yellow;");
            }
          }
        }
      }
    }
  } else {
		//if you pressed back after choosing a character on the page the tables
		//wouldn't load in time, init will try again.
    init();
  }

}

function parseXHTTP(text) {
  var getInfo = document.createElement('TD');
  getInfo.innerHTML = text;
  var rows = getInfo.getElementsByClassName('list-table')[0];
  txt = rows.getAttribute('data-items');
  var json = JSON.parse(txt);
  if (!json) {
    return false;
  }
  for (var i = 0; i < json.length; i++) {
    listOfTitlesHash[json[i].anime_title] = json[i].status;
  }
  return true;
}

function searchTitle(title) {
  if (listOfTitlesHash[title]) {
    return true;
  } else {
    return false;
  }
}
