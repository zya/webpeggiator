var midi = null; //global midi object
var peer = null;
var connections = []; //an array to hold the peers
var voices = [];

var context = new webkitAudioContext();
function midisuccess(access){

	midi = access;

	var inputs = midi.inputs();
	console.log(inputs);
	var outputs = midi.outputs();

	inputs[0].onmidimessage = function(e){
		//midi to frequency
		
		if(connections.length > 0){
			
			var random = Math.floor(Math.random() * connections.length);
			var selected = connections[random];
			var frequency = Math.pow(2, (e.data[1] - 69)/ 12) * 440;
			switch (e.data[0] & 0xf0) {
        		case 0x90:
	          		if (e.data[2]!== 0){ // if velocity != 0, this is a note-on message
	            		//noteOn(event.data[1]);
	            		var message = [true, frequency];
	            		selected.send(message);
	            		var rc1 = Math.random() * 256;


	         		}
         		break;
           		// if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
        		case 0x80:
         		//noteOff(event.data[1]);
         			
         			var message2 = [false, frequency];
	            	selected.send(message2);
         			
          		break;	
          			
      		}
		}
		
		
	};


	
}

function midierror(){
	console.log('midi access failed');
}

//peer open 
function peerOpen(id){
	console.log('My peer Id is ' + id);
}


//create a room and get midi
function peerCreate(){
	var id = $('#customID').val();
	peer = new Peer(id, {key: 'pa8gvlxhg0fkzkt9'});
	peer.on('open', peerOpen);

	peer.on('connection',function(conn){
		console.log(conn);
		connections.push(conn);
		console.log(connections);
	});

	navigator.requestMIDIAccess().then(midisuccess, midierror);

	$('#status').hide();


}

function Voice(frequency){
	this.frequency = frequency;
}

Voice.prototype.noteOn = function(){
	
	this.osc = context.createOscillator();
	this.env =context.createGain();
	this.osc.frequency.value = this.frequency;
	var now = context.currentTime;
	this.osc.connect(this.env);
	this.env.connect(context.destination);
	
	
	this.env.gain.setValueAtTime(this.env.gain.value, now);
	this.env.gain.linearRampToValueAtTime(0.8, now + 0.4);
	this.env.gain.linearRampToValueAtTime(0, now + 0.6);
	this.osc.start(now);
	this.osc.stop(now + 1);


	


	
};

Voice.prototype.noteOff = function(){

};

function onData(data){

	if(data[0]){
		//noteOn
		$('#title').animate({
			opacity: 0
		},100,function(){
			$('#title').animate({
				opacity: 1
			},100);
		});
		
		var voice = new Voice(data[1]);
		voice.noteOn();
		voices.push(voice);
	
	}else{
		//noteOff
		for(var i = 0; i < voices.length; i++){
			voices[i].noteOff();
		}

	}
}

//connect to the id
function peerConnect(){
	peer = new Peer({key:'pa8gvlxhg0fkzkt9'});
	peer.on('open',peerOpen);
	conn = peer.connect('zya');
	$('#status').html('You are now connected');
	conn.on('data',onData);

}

function show(){
	$('#creator').show();
}

window.onload = function(){

	$('#creator').hide();
	$('#create').click(peerCreate);
	$('#connect').click(function(){
		peerConnect();
	});

};