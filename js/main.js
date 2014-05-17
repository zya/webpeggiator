var midi = null; //global midi object

function midisuccess(access){

	midi = access;

	var inputs = midi.inputs();
	var outputs = midi.outputs();

	console.log(inputs);
	console.log(outputs);

	inputs[0].onmidimessage = function(e){
		console.log(e);
	};
}

function midierror(){
	console.log('midi access failed');
}

window.onload = function(){

	navigator.requestMIDIAccess().then(midisuccess, midierror);

};