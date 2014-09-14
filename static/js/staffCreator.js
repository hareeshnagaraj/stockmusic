/*

  This class creates the staff used to display the notes on the index page

*/
function drawnotes(notes){
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
    // console.log(string)
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

