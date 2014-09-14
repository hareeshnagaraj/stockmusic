/*

  This class creates the staff used to display the notes on the index page

*/
function drawnotes(notes, canvasID){
  $(".a").append('<canvas id="canvas" width="1115" height="500"></canvas>');
  var canvas = $(".one .a canvas")[0];
  var renderer = new Vex.Flow.Renderer(canvas,
    Vex.Flow.Renderer.Backends.CANVAS);

  var ctx = renderer.getContext();
  var stave = new Vex.Flow.Stave(0, 20, 1100);
  stave.addClef("treble").setContext(ctx).draw();
  
  var vexNotes = []
  for(var n = 0; n < notes.length; n++){
    var currentNote = midiToNote(notes[n]);
    var height = (currentNote[1] % 3) + 4;
    var string = String(currentNote[0]) + "/" + String(height);
    console.log(string)
    vexNotes.push(new Vex.Flow.StaveNote({ keys: [string], duration: "q" }));
  }
   var voice = new Vex.Flow.Voice({
    num_beats: notes.length,
    beat_value: 4,
    resolution: Vex.Flow.RESOLUTION
  });
  // Add notes to voice
  voice.addTickables(vexNotes);

  // Format and justify the notes to 500 pixels
  var formatter = new Vex.Flow.Formatter().
    joinVoices([voice]).format([voice], 1000);
  // Render voice
  voice.draw(ctx, stave);
}
function play(b){
  MIDI.programChange(0, 0);
  for (var n = 0; n < b.length; n ++) {
    var delay = n ; // play one note every quarter second
    var note = MIDI.pianoKeyOffset + parseInt(b[n]); // the MIDI note
    var velocity = n + 100; // how hard the note hits
    // var velocity = 0;
    // play the note
    MIDI.noteOn(1, note, velocity, delay);
    // play the some note 3-steps up
    MIDI.noteOn(1, note + 3, velocity, delay);
  }
}

//midiToNote
function midiToNote(initialNote){
  initialNote = parseInt(initialNote)
  var noteString = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var octave = (initialNote/12) - 1;  
  var noteIndex = (initialNote % 12);
  var note = noteString[noteIndex];
  return [note,noteIndex];
}