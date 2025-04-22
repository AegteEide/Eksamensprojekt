let connection 
let sensorData = 0

function setup() {
  createCanvas(400, 400);
  background('yellow')
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
    sensorData = ms.toString()
    
      if(topic == 'Crobst'){
    if(sensorData == 'Hej'){
      background('purple')
      }
    }
  })
}

function draw() {
  //background(220);
}