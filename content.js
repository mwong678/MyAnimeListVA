var txt;
var listOfTitles = [];

window.onload = function(){
	var name = getUserName();
	if (!name){
		return;
	}
	
  var xhttp = new XMLHttpRequest();
  var url = 'http://myanimelist.net/animelist/'+name;
  xhttp.onload = function() {
	if (parseXHTTP(xhttp.responseText)){
		highLightTitles(listOfTitles);
	}else{
		console.log("Failed");
	}
  };
  xhttp.onerror = function() {
    console.log("Error");
  };
  xhttp.open("GET", url, true);
  xhttp.send(null);
}

function getUserName(){
	userName = null;
	var userNameLink = document.getElementsByClassName("header-profile-link")[0];
	if (!userNameLink){
		return null;
	}else{
		userName = userNameLink.text;
	}
	return userName;
}

function highLightTitles(list){
	var tables = document.getElementsByTagName("Table");
	var row = tables[1].getElementsByTagName("TR");
	var titleTable = row[0].getElementsByTagName("Table");
    for (var i = 0, row; row = titleTable[0].rows[i]; i++) {
		for (var j = 0, col; col = row.cells[j]; j++) {
			if (j == 1){
				aLink = col.getElementsByTagName("A");
				if (searchTitle(aLink[0].text)){
					row.setAttribute("style", "background-color: yellow;");
				}
			}
		}  
	}
	
}

function parseXHTTP(text){
	var getInfo = document.createElement('TD');
	getInfo.innerHTML = text;
	var rows = getInfo.getElementsByClassName('list-table')[0];
	txt = rows.getAttribute('data-items');
	var json = JSON.parse(txt);
	if (!json){
		return false;
	}
	for (var i = 0; i < json.length; i++){
		listOfTitles.push(json[i].anime_title);
	}
	return true;
}

function searchTitle(title){
	if (!listOfTitles){
		return false;
	}
	for (var i = 0; i < listOfTitles.length;i++){
		
		if (title == listOfTitles[i]){
			return true;
		}
	}
	
	return false;
}

