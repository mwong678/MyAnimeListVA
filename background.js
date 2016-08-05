var txt;
var listOfTitles = [];
chrome.runtime.onMessage.addListener(
  function(request, sender, callback) {
  //alert(request);
  
  var xhttp = new XMLHttpRequest();
  var url = 'http://myanimelist.net/animelist/'+request;
  //alert(url);
  xhttp.onload = function() {
	if (parseXHTTP(xhttp.responseText)){
		var x = setTimeout(function() {
		console.log("succ");
        callback(listOfTitles);
        }, 5000);
	}else{
		console.log("Failed");
	}
	/*
	var x = setTimeout(function() {
		console.log(listOfTitles);
        callback(listOfTitles);
        }, 1000);
	*/
  };
  xhttp.onerror = function() {
    callback("Error");
  };
  xhttp.open("GET", url, true);
  xhttp.send(null);
  //return true;
});

chrome.tabs.onUpdated.addListener(function(id, info, tab) {
  if (tab.url.toLowerCase().indexOf("myanimelist.net/animelist/") > -1) {
    //load the icon in the student center
    chrome.pageAction.show(tab.id);
  }
});

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
		//console.log(json[i].anime_title);
		listOfTitles.push(json[i].anime_title);
	}
	return true;
}