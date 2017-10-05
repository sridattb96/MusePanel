
var songTable = {};
var keyTable = {};
var keyToRank = {
	"C": 0,
	"Db": 0.5,
	"D": 1,
	"Eb": 1.5,
	"E": 2,
	"F": 2.5,
	"Gb": 3,
	"G": 3.5,
	"Ab": 4,
	"A": 4.5,
	"Bb": 5,
	"B": 5.5
}

$(document).ready(function(){

	$.getJSON("http://spreadsheets.google.com/feeds/list/19jOfDa3ZK9DOsowIwtMc0j9FjjqFx4VVaGSdseRKI6s/od6/public/values?alt=json", function(data) {

 		var source = [];
 		data.feed.entry.map(function(obj){
 			if (obj["gsx$song"]["$t"].length > 0 && obj["gsx$key"]["$t"].length > 0 && obj["gsx$artist"]["$t"].length > 0){
	 			var song = obj["gsx$song"]["$t"];
	 			var key = spellKey(obj["gsx$key"]["$t"]);
	 			var artist = obj["gsx$artist"]["$t"];
	 			var note = key.split(" ")[0];
	 			var keyType = key.split(" ")[1];
	 			var rank = keyToRank[note];

	 			source.push({
	 				value: song, 
	 				artist: artist,
	 				key: key
	 			});

	 			var hash = hashSong(song, artist);

	 			songTable[hash] = {
	 				title: song, 
	 				artist: artist,
	 				key: key,
	 				note: note,
	 				keyType: keyType,
	 				rank: rank
	 			}

	 			if (!(key in keyTable)){
	 				console.log(key);
	 				keyTable[key] = [];
	 			}
	 			keyTable[key].push(hash);

	 			localStorage.setItem("songTable", JSON.stringify(songTable));
	 			localStorage.setItem("keyTable",  JSON.stringify(keyTable));
	 		}
 		})

 		console.log(keyTable);

 		console.log(songTable);
 		console.log(source.length);

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
		return key.slice(0, -1) + (key[key.length-1] == key[key.length-1].toLowerCase() ? " minor" : " Major");
	}
});


