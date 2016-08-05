document.addEventListener('DOMContentLoaded', function() {
  test();
});


function test(){
	
	 var professor = chrome.extension.getBackgroundPage().txt;
	var p = document.getElementById('text');
	p.innerHTML = professor;
	 
}
