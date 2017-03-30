var duration;
var cutVid;

var cuts = []; //simulate database
var currCut = 0;


var apiKey = "c2hwyx1oB663CdmaNPMA7bsHLhDG4MfU";
var db = "bryan_osc";
var coll = "osc_collection";

function preload() {

  fullVid = createVideo("bobross.mp4");
  fullVid.size(720, 480);
  fullVid.showControls();
  fullVid.play();
  
  cutVid = createVideo("bobross.mp4");
  cutVid.size(720, 480);
  
  btn1 = createButton('PUSH CURRENT MOMENT');
  btn1.mousePressed(pushClip);
  
  dbtn = createButton('CLEAR ALL MOMENTS');
  dbtn.mousePressed(clearArray);
  
  initScene();
  console.log("test2");
  //load array with data on mlab
}

var isPlaying = false;

function setup()
{
  frameRate(1); //1 
}

function draw()
{
  if(cuts.length > 0)
  {
    if(!isPlaying)
    {
      cutVid.time(cuts[0]);
    }
    
    cutVid.play();
    isPlaying = true;
  }
  else
  {
    cutVid.pause();
    cutVid.time(0);
  }
  
  if(isPlaying)
  {
    var n = 2; 
    
    if(frameCount % n === 0) //1 frame per second
    {
      nextClip(); // next movie every n seconds
    }
  }
}

function nextClip()
{
  if(currCut == cuts.length - 1)
  {
    currCut = 0;
  }
  else
  {
    currCut++;
  }
  startMovie();
}

function startMovie()
{
  cutVid.time(cuts[currCut]);
}

function pushClip()
{
  var timestamp = fullVid.time();
  cuts.push(timestamp);
  saveIt(timestamp)
  
}

function clearArray()
{
  cuts = [];
  killIt();
}

function saveIt(timestamp)
{
  //serialize info from dom element so you can send it to the database
  var thisElementArray = {}; //make an array for sending
  thisElementArray._id = cuts.length;
  thisElementArray.timestamp = timestamp;
  var data = JSON.stringify(thisElementArray);
  var query =  "q=" + JSON.stringify({_id:cuts.length}) + "&";
  $.ajax( { url: "https://api.mlab.com/api/1/databases/"+ db +"/collections/"+coll+"/?" +  query + "u=true&apiKey=" + apiKey,
  data: data,
  type: "PUT",
  contentType: "application/json",
  success: function(data){console.log("saved" );},
  failure: function(data){  console.log("didn't save" );}
  });
}

// function killIt(){
//   $.ajax( { url: "https://api.mlab.com/api/1/databases/"+ db +"/collections/"+coll+"?apiKey=" + apiKey,
//   type: "DELETE",
//   contentType: "application/json",
//   success: function(data){console.log("saved" + data);},
//   failure: function(data){console.log("didn't save" + data);}
// });

}

function initScene(){

  $.ajax( { url: "https://api.mlab.com/api/1/databases/"+ db +"/collections/"+coll+"/?&apiKey=" + apiKey,
  type: "GET",
  success: function (data){  //create the select ui element based on what came back from db
    $.each(data, function(index,obj){
      console.log(obj.timestamp);
      cuts.push(obj.timestamp);
      // newElement(obj._id,obj.timestamp);
    })
  },
  contentType: "application/json" } );
}

// function newElement(elementID,timestamp){
//   //called either by dropping or pulling in elements from the database
//   numberOfElements++;
//   var dom_element = createImg(url);
//   if (w == -1){  //just dropped
//     w = dom_element.size().width/2;  //pictures tend to be too big
//     h = dom_element.size().height/2;
//   }
//   //deserialize info
//   selectedElement = dom_element;
//   dom_element.id(elementID);
//   dom_element.position(x,y);
//   dom_element.size(w, h);
//   dom_element.mousePressed(function(){
//     dragging = true;
//     selectedElement = this;
//   });
//   dom_element.mouseMoved( function(){
//     if(this == selectedElement && dragging == true){
//       this.position(mouseX-this.width/2,mouseY-this.height/2);
//     }
//   });
//   dom_element.mouseReleased(function(){
//     dragging = false;
//     saveIt(selectedElement);
//   });
//   //disable all the default drag events for this element.
//   $('#'+elementID).on("dragenter dragstart dragend dragleave dragover drag drop", function (e) {e.preventDefault();});
//   saveIt(dom_element);
//   allElements.push(dom_element);
// }
