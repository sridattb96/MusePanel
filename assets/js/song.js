
var songTable = {};
var keyTable = {};

$(document).ready(function(){

	$("#back").attr("href", window.location.origin);

	if (localStorage.getItem("songTable")){
		songTable = JSON.parse(localStorage.getItem("songTable"));
		keyTable = JSON.parse(localStorage.getItem("keyTable"));
		initPage();
	} else {
		$.getJSON("http://spreadsheets.google.com/feeds/list/19jOfDa3ZK9DOsowIwtMc0j9FjjqFx4VVaGSdseRKI6s/od6/public/values?alt=json", function(data) {

	 		data.feed.entry.map(function(obj){
	 			var song = obj["gsx$song"]["$t"];
	 			var key = spellKey(obj["gsx$key"]["$t"]);
	 			var artist = obj["gsx$artist"]["$t"];

	 			var hash = hashSong(song, artist);

	 			songTable[hash] = {
	 				title: song, 
	 				artist: artist,
	 				key: key
	 			}

	 			if (!(key in keyTable)) keyTable[key] = [];
	 			keyTable[key].push(hash);

	 			localStorage.setItem("songTable", JSON.stringify(songTable));
	 			localStorage.setItem("keyTable",  JSON.stringify(keyTable));
	 		})

	 		initPage();
		});
	}
});

function initPage(){
	var songObj = getSongObj();
	$("#song-title").html(songObj["title"]);
	$("#song-artist").html(songObj["artist"]);
	$("#song-key").html(songObj["key"]);

}

function getSongObj(){
	var search = location.search.substring(1);
	var params = search?JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
	                 function(key, value) { return key===""?value:decodeURIComponent(value) }):{}

	return songTable[hashSong(params["title"], params["artist"])];
}

function hashSong(song, artist){
	return song.replace(' ', '') + "-" + artist.replace(' ', '');
}

function spellKey(key){
	return key.slice(0, -1) + (key[key.length-1] == key[key.length-1].toLowerCase() ? " minor" : " major")
}

