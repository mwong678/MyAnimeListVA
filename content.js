let titleToWatchStatus = {};

async function init(){
  const name = getUserName();
  let offset = 0;

  if (!name) return;

  let url = `https://myanimelist.net/animelist/${name}/load.json?offset=${offset}status=7`,
      profileResponse = await fetch(url),
      profileResponseJSON = await profileResponse.json();

  if (!profileResponseJSON){
    console.log('Failed to get user\'s anime list');
    return;
  }

  while (profileResponseJSON.length > 0){
    parseList(profileResponseJSON);
    offset += profileResponseJSON.length;
    url = `https://myanimelist.net/animelist/${name}/load.json?offset=${offset}status=7`;
    profileResponse = await fetch(url),
    profileResponseJSON = await profileResponse.json();
  }

  highLightTitles();
}

function getUserName() {
  let userName = null;
  let userNameLink = document.getElementsByClassName('header-profile-link')[0];
  if (!userNameLink) return null;
  else return userNameLink.text;
}

function highLightTitles(list) {
  const tables = document.getElementsByTagName('Table'),
        rows = tables[1].getElementsByTagName('TR');

  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++){
      let td = rows[i].getElementsByTagName('TD'),
          aLink = td[1].getElementsByTagName('A'),
          title = aLink[0].text;

      if (titleToWatchStatus[title] && titleToWatchStatus[title] != 6) {
          rows[i].setAttribute('style', 'background-color: yellow;');
      }
    }
  } else {
    console.log('Failed to highlight titles');
  }
}

function parseList(responseJSON){
  if (!responseJSON) return false;
  responseJSON.forEach(function(show){
    titleToWatchStatus[show.anime_title] = show.status;
  });
  return true;
}

document.onload = init();
