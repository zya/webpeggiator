var midi = null; //global midi object
var peer = null;
var conn = null;

function midisuccess(access){

	midi = access;

	var inputs = midi.inputs();
	var outputs = midi.outputs();

	/*
	inputs[0].onmidimessage = function(e){
		console.log(e);
	};
	*/
}

function midierror(){
	console.log('midi access failed');
}

//peer

function peerOpen(id){
	console.log('My peer Id is ' + id);
}


window.onload = function(){

	navigator.requestMIDIAccess().then(midisuccess, midierror);

	$('#create').click(function(){
		var id = $('#customID').val();
		peer = new Peer(id, {key: 'pa8gvlxhg0fkzkt9'});
		peer.on('open', peerOpen);

		peer.on('connection',function(conn){
			console.log(conn);
		});
	});

	$('#connect').click(function(){
		peer = new Peer({key:'pa8gvlxhg0fkzkt9'});
		peer.on('open',peerOpen);
		conn = peer.conn('zya');
	});

};