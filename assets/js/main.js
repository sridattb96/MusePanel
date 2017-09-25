
var songTable = {};
var keyTable = {};

$(document).ready(function(){

	$.getJSON("http://spreadsheets.google.com/feeds/list/19jOfDa3ZK9DOsowIwtMc0j9FjjqFx4VVaGSdseRKI6s/od6/public/values?alt=json", function(data) {

 		var source = [];
 		data.feed.entry.map(function(obj){
 			var song = obj["gsx$song"]["$t"];
 			var key = spellKey(obj["gsx$key"]["$t"]);
 			var artist = obj["gsx$artist"]["$t"];

 			source.push({
 				value: song, 
 				artist: artist,
 				key: key
 			});

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

 		initAutocomplete(source);
	});

	function initAutocomplete(source){
		$("#songSearch").autocomplete({
		    source: function(req, res) {
	            var results = $.ui.autocomplete.filter(source, req.term);        
	            res(results.slice(0, 5));
	        },    
	        select: function(event, ui) {
	        	event.preventDefault();
	        	window.location.href += "song?title=" + ui.item.value + "&artist=" + ui.item.artist;
	        }
		}).data("ui-autocomplete")._renderItem = function (ul, item) {
			var resultTemplate = "<span style='color:#76C51F;'>%s</span>";
			var inp = properCaps(item.value, $("#songSearch").val().toLowerCase());
			var newTitle = item.value.replace(inp, resultTemplate.replace('%s', inp));

		    return $("<li class='song-panel'></li>")
		       		.data("ui-autocomplete-item", item)
		           .append("<div class='song-title'>" + newTitle + "</div>")
		           .append("<div class='song-key'>" + item.key + "</div>")
		           .append("<div class='song-artist'>" + item.artist + "</div>")
		           .appendTo(ul);
		};
	}

	function properCaps(song, inp){
		return song.substr(song.toLowerCase().indexOf(inp), inp.length)
	}

	function hashSong(song, artist){
		return song.replace(' ', '') + "-" + artist.replace(' ', '');
	}

	function spellKey(key){
		return key.slice(0, -1) + (key[key.length-1] == key[key.length-1].toLowerCase() ? " minor" : " major")
	}
});


