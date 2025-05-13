let connection 
let JSONdata 
let dataModel 

function setup() {
noCanvas()

select('#header-fullscreen').mousePressed( ()=>{
    let fs = fullscreen()
    fullscreen(!fs)
  })



  
dataModel = [];
  // (Goal step 1)
  database.collection('Crobst').doc('promisegame').collection('players')
  .onSnapshot((snapshot) => {
  // (Goal step 2)  
    snapshot.forEach((doc) => {
      console.log(doc.data()) 
      let player = doc.data()
      //select('#player-' + player.id + '-goal').value(player.goal)

     let goalInput = document.getElementById('player-' + player.id + '-goal');
      if (goalInput) {
        if (player.goal && player.goal.trim() !== '') {
          goalInput.value = player.goal;
        } else {
          goalInput.placeholder = "Enter your goal...";
        }
      }

      goalInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && goalInput.value.trim() !== '') {
          let goalValue = goalInput.value.trim();
          let playerId = 'player' + player.id;

          // Update goal in Firebase
          database.collection("Crobst").doc("promisegame").collection("players").doc(playerId)
            .update({ goal: goalValue })
            .then(() => {
              console.log("Goal saved for", playerId);
            })
            .catch((error) => {
              console.error("Error saving goal:", error);
            });
        }
      });
  // (Status Step 1)
      let statusesArray = player.statuses
      for(let i = 0; i < statusesArray.length; i++){
        
        let elementId = 'p' + player.id + 'status' + (i + 1)
        let el = document.getElementById(elementId);
        if (el) {
          //console.log('adding class', statusesArray[i].status)
          //console.log("Looking for element ID:", elementId);
          el.classList.add(statusesArray[i].status);  
        }else {
          console.warn('Element not found:', elementId);
        }
        }
        
       // (Reminder Logic)
        let lastThreeStatuses = statusesArray.slice(-3);
        let allRed = lastThreeStatuses.length === 3 && lastThreeStatuses.every(s => s.status === 'red');
        let allGreen = lastThreeStatuses.length === 3 && lastThreeStatuses.every(s => s.status === 'green')

        // Get the existing reminder div by player ID
        let reminderDiv = document.getElementById('reminder-' + player.id);

        // If the div exists, update it based on the status check
                if (reminderDiv) {
          // Clear existing content
          reminderDiv.innerHTML = '';

          // RED reminder
          if (allRed) {
            let redReminder = document.createElement('div');
            redReminder.textContent = ' ⚠ Reminder: 3 red days in a row! ';
            redReminder.style.backgroundColor = '#ffe5e5';
            redReminder.style.border = '1px solid #a00';
            redReminder.style.borderRadius = '0.5rem';
            redReminder.style.color = 'red';
            redReminder.style.marginBottom = '0.3rem';
            reminderDiv.appendChild(redReminder);
          }

          // GREEN reminder
          if (allGreen) {
            let greenReminder = document.createElement('div');
            greenReminder.textContent = ' Keep up the good work!💪 ';
            greenReminder.style.backgroundColor = '#e0f8e0';
            greenReminder.style.border = '1px solid green';
            greenReminder.style.borderRadius = '0.5rem';
            greenReminder.style.color = 'green';
            reminderDiv.appendChild(greenReminder);
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