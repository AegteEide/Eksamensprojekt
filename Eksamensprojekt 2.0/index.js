let connection 
let JSONdata 
let dataModel 

function setup() {
noCanvas()
//firestore
dataModel = [];
  database.collection('Crobst').doc('promisegame').collection('players')
  .onSnapshot((snapshot) => {
    dataModel.statuses = [];  // reset the array
    snapshot.forEach((doc) => {
      console.log(doc.data()) 
      let player = doc.data()
      console.log('#player-' + player.id + '-goal')
      select('#player-' + player.id + '-goal').value(player.goal)

      let statusesArray = player.statuses
      let statusSelect =  select('#p' + player.id + 'status1')
      console.log(player.id)
      console.log('p' + player.id + 'status1')

      for(let i = 0; i < statusesArray.length; i++){
        let statusText = statusesArray[0].status;
        let elementId = 'p' + player.id + 'status' + (i + 1)
        let element = document.getElementById(elementId);
        if (element) {
          element.textContent = statusesArray[i].status;  // Append to existing text
        }else {
          console.warn('Element not found:', elId);
        }
        }
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