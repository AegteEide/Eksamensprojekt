let connection 
let JSONdata 
let dataModel 

function setup() {
noCanvas()
//firestore
dataModel = [];
  database.collection('Crobst')
  .onSnapshot((snapshot) => {
    dataModel.statuses = [];  // reset the array
    snapshot.forEach((doc, index) => {
      console.log(doc.data()) 
    })
  })
  //Opret forbindelse til NEXT MQTT server
  connection = mqtt.connect("wss://mqtt.nextservices.dk")
  //Når serveren svarer
  connection.on("connect", () => {
    console.log("Er nu forbundet til Next's MQTT server")   
  })
  
   //vi abonnerer på et emne 
  connection.subscribe('Crobst')
  //hver gang vi får en besked på emnet 
  connection.on("message", (topic, ms) => {
    console.log("Modtager data: " + ms + " - på emnet: " + topic)
    fill(255)
    debugStr = "Modtager data: " + ms + " - på emnet: " + topic
    JSONdata = JSON.parse(ms.toString())
    if(topic == 'Crobst'){
      player = JSONdata.player
      playerStatus = JSONdata.status
      setData(player, playerStatus)
      if(playerStatus == 'green'){
        background('green')
      }
    }
  })
}

function setData(p, s){
  let playerId = "player1"
      let statusUpdate = {
        "date": new Date(),
        "status": playerStatus,
      }
  
  database
  .collection("Crobst")
  .doc("promisegame")
  .collection("players")
  .doc(playerId)
  .update({
    statuses: firebase.firestore.FieldValue.arrayUnion(statusUpdate)
  })
  .then(() => {
    console.log("Status added for", playerId);
  })
  .catch((error) => {
    console.error("Error updating status:", error);
  });
}


function draw() {
  //background(220);
}