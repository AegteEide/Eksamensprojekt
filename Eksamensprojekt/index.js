let connection 
let JSONdata 
let dataModel 
let plingSound
let negativeSound


// (Sound Step 1)
function preload(){
  plingSound = loadSound('assets/pling.wav')
  negativeSound = loadSound('assets/negative.wav')
}

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
      //console.log(doc.data()) 
      let player = doc.data()

    // (Goalinput Step 1)
     let goalInput = document.getElementById('player-' + player.id + '-goal');
    // (Goalinput Step 2)
      if (goalInput) {
        if (player.goal && player.goal.trim() !== '') {
          goalInput.value = player.goal;
        } else {
          goalInput.placeholder = "Enter your goal...";
        }
      }
    // (Goalinput Step 3)
      goalInput.addEventListener('keydown', function (e) {
        if (e.key === 'Delete' || e.key === 'Enter' && goalInput.value.trim() !== '') {
          let goalValue = goalInput.value.trim();
          let playerId = 'player' + player.id;

    // (Goalinput Step 4)
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
          el.classList.add(statusesArray[i].status);  
        }else {
          console.warn('Element not found:', elementId);
        }
        }
        
       // (Reminder Step 1)
        let lastThreeStatuses = statusesArray.slice(-3);
        let allRed = lastThreeStatuses.length === 3 && lastThreeStatuses.every(s => s.status === 'red');
        let allGreen = lastThreeStatuses.length === 3 && lastThreeStatuses.every(s => s.status === 'green')

        // (Reminder Step 2)
        let reminderDiv = document.getElementById('reminder-' + player.id);
        // (Reminder Step 3)
          if (reminderDiv) {
          reminderDiv.innerHTML = '';

          // (Reminder Step 4)
          if (allRed) {
            let redReminder = document.createElement('div');
            redReminder.textContent = ' ⚠️ Reminder: 3 red days in a row! ';
            redReminder.style.backgroundColor = '#ffe5e5';
            redReminder.style.border = '1px solid #a00';
            redReminder.style.borderRadius = '0.5rem';
            redReminder.style.color = 'red';
            redReminder.style.marginBottom = '0.3rem';
            reminderDiv.appendChild(redReminder);
          }

          // (Reminder Step 5)
          if (allGreen) {
            let greenReminder = document.createElement('div');
            greenReminder.textContent = ' Nice work!💪 ';
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
  //  console.log("Modtager data: " + ms + " - på emnet: " + topic)
  // (MQTT Step 4)
    JSONdata = JSON.parse(ms.toString())
  // (MQTT Step 5)
    if(topic == 'Crobst'){
      let playerIdentification = JSONdata.player
      console.log(playerIdentification)
      let playerStatus = JSONdata.status
      console.log('MQTT message for player:', playerIdentification, 'status:', playerStatus);
      setData(playerIdentification, playerStatus)
    }
  })
}

// (setData Step 1)
function setData(playerIdentification, playerStatus){
  let docId = "player" + playerIdentification
  console.log('Updating Firestore doc:', docId, 'with status:', playerStatus);
  let statusUpdate = {
    "date": new Date(),
    "status": playerStatus,
  }
 
  // (Sound Step 2)
  if(playerStatus === 'green'){
    plingSound.play()
  }

  if(playerStatus === 'red'){
    negativeSound.play()
  }
  
// (setData Step 2)  
  database.collection("Crobst").doc("promisegame").collection("players").doc(docId)
  .update({
    statuses: firebase.firestore.FieldValue.arrayUnion(statusUpdate)
  })
// (setData Step 3)
  .then(() => {
    console.log("Status added for", docId);
  })
  .catch((error) => {
    console.error("Error updating status:", error);
  });
}




function draw() {
  //background(220);
}