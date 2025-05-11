let connection 
let JSONdata 
let dataModel 

function setup() {
noCanvas()

dataModel = [];
  // (Goal step 1)
  database.collection('Crobst').doc('promisegame').collection('players')
  .onSnapshot((snapshot) => {
  // (Goal step 2)  
    snapshot.forEach((doc) => {
      console.log(doc.data()) 
      let player = doc.data()
      select('#player-' + player.id + '-goal').value(player.goal)
  // (Status Step 1)
      let statusesArray = player.statuses
      for(let i = 0; i < statusesArray.length; i++){
        let elementId = 'p' + player.id + 'status' + (i + 1)
        let element = document.getElementById(elementId);
        if (element) {
          element.textContent = statusesArray[i].status;  
        }else {
          console.warn('Element not found:', elementId);
        }
        }
    })
  })
  // (MQTT Step 1)
  connection = mqtt.connect("wss://mqtt.nextservices.dk")
  // (MQTT Step 2)
  connection.on("connect", () => {
    console.log("Er nu forbundet til Next's MQTT server")   
  })
  // (MQTT Step 3)
  connection.subscribe('Crobst')
  connection.on("message", (topic, ms) => {
    console.log("Modtager data: " + ms + " - på emnet: " + topic)
  // (MQTT Step 5)
    JSONdata = JSON.parse(ms.toString())
  // (MQTT Step 6)
    if(topic == 'Crobst'){
      player = JSONdata.player
      playerStatus = JSONdata.status
      setData(player, playerStatus)
    }
  })
}

// (setData Step 1)
function setData(player, status){
  let playerId = "player" + player.id
      let statusUpdate = {
        "date": new Date(),
        "status": playerStatus,
      }
// (setData Step 2)  
  database.collection("Crobst").doc("promisegame").collection("players").doc(playerId)
  .update({
    statuses: firebase.firestore.FieldValue.arrayUnion(statusUpdate)
  })
// (setData Step 3)
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