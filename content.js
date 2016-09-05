var txt;
var listOfTitles = [];
var listOfTitlesHash = {};
var listOfStatusHeadersHash = {}; // title to number of entries
var order = ["Currently Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"];
//$(document).ready(function() {init();});
document.onload = init();

function init() {
  var name = getUserName();
  //var name = "Memor"
  if (!name) {
    console.log("User is not logged in!");
    return;
  }

  var xhttp = new XMLHttpRequest();
  var url = 'https://myanimelist.net/animelist/' + name;
  xhttp.onload = function() {
    if (parseXHTTP(xhttp.responseText)) {
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
  if (!rows){
    //classic theme
    rows = getInfo.getElementsByClassName('status_not_selected');
    for (var i = 0; i < rows.length;i++){
      listOfStatusHeadersHash[rows[i].getElementsByTagName('A')[0].innerText.trim()] = rows[i].getElementsByTagName('A')[0].getAttribute('title').split(" ")[0];
      //console.log(rows[i].getElementsByTagName('A')[0].innerText.trim()+ "     " + rows[i].getElementsByTagName('A')[0].getAttribute('title').split(" ")[0]);
    }

    count = 0;
    statusNum = 1;
    rows = getInfo.getElementsByClassName('animetitle');
    for (var i = 0; i < order.length; i++){
      status = order[i];
      switch (status){
        case "Currently Watching":
          statusNum = 1;
          break;
        case "Completed":
          statusNum = 2;
          break;
      case "On Hold":
        statusNum = 3;
        break;
      case "Dropped":
        statusNum = 4;
        break;
      case "Plan to Watch":
        statusNum = 6;
        break;
      }
      for (var j = 0; j < listOfStatusHeadersHash[status]; j++){
        listOfTitlesHash[rows[count].innerText.trim()] = statusNum;
        //console.log(rows[count].innerText.trim() + "  "+ statusNum);
        count++;
      }
    }
    return true;
  }else{
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
}

function searchTitle(title) {
  if (listOfTitlesHash[title]) {
    return true;
  } else {
    return false;
  }
}
