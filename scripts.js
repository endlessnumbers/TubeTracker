window.onload = function getLineStatus() {
  let url = "https://api.tfl.gov.uk/line/mode/tube/status";
  fetch(url)
  .then(data=>{return data.json()})
  .then(res=>{createTables(res)});
}


function createTables(json) {
  let div = document.createElement("div");
  div.classList.add("statusTable");
  for (let i = 0; i < json.length; i++) {
    let accordion = document.createElement("button");
    accordion.id = json[i].name;
    accordion.innerHTML = json[i].name;
    accordion.classList.add("accordion");
    let panel = document.createElement("div");
    panel.classList.add("panel");
    let details =
      document.createElement("p");
    details.appendChild(document.createTextNode(json[i].lineStatuses[0].statusSeverityDescription));
    panel.appendChild(details);

    let statusSeverity = json[i].lineStatuses[0].statusSeverity;

    if (statusSeverity < 10) {
      accordion.innerHTML += '<i class="fas fa-circle light-icon" style="color: orange;"></i>';
      if (statusSeverity == 0) {
        accordion.innerHTML += '<i class="fas fa-circle light-icon" style="color: red;"></i>';
      }
      var reason = document.createTextNode(json[i].lineStatuses[0].reason);
      panel.appendChild(document.createElement("br"));
      panel.appendChild(reason);
    } else {
      accordion.innerHTML += '<i class="fas fa-circle light-icon" style="color: green;"></i>';
    }

    div.appendChild(accordion);
    div.appendChild(panel);
  }
  let title = document.getElementById("footer");
  document.body.insertBefore(div, title);
  accordionEvents();
}

function accordionEvents() {
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      this.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        // get next three arrivals
        getArrivals(this.id, panel);
        //updateArrivals(this.id, panel);
        panel.style.display = "block";
      }
    });
  }
}

function getArrivals(lineId, panel) {
  let url = `https://api.tfl.gov.uk/line/${lineId}/arrivals`;
  fetch(url)
  .then(data=>{return data.json()})
  .then(res=>{updateArrivals(lineId, panel, res)});
}

function updateArrivals(lineId, panel, json) {
  // sort by time to arrival and display the three next arrivals
  json.sort(function(a, b) {
    return a.timeToStation - b.timeToStation;
  });

  var arrivalTimes = document.getElementById(`${lineId}Arrivals`);
  if (!arrivalTimes) {  // create if not exists
    arrivalTimes = document.createElement("div");
    arrivalTimes.id = `${lineId}Arrivals`;
    panel.appendChild(arrivalTimes);
  } else {
    while (arrivalTimes.firstChild) {
      arrivalTimes.removeChild(arrivalTimes.firstChild);
    }
  }

  for (let i = 0; i < 3; i++) {
    // put into panel
    arrivalTimes.appendChild(document.createElement("br"));
    arrivalTimes.appendChild(document.createTextNode(`Arriving at: ${json[i].stationName}`));
    arrivalTimes.appendChild(document.createElement("br"));
    arrivalTimes.appendChild(document.createTextNode(`Towards: ${json[i].towards}`));
    arrivalTimes.appendChild(document.createElement("br"));
    arrivalTimes.appendChild(document.createTextNode(`Current Location: ${json[i].currentLocation}`));
    arrivalTimes.appendChild(document.createElement("br"));
    let arriveTime = new Date(json[i].expectedArrival);
    arrivalTimes.appendChild(document.createTextNode
      (`Expected Arrival: ${arriveTime.getHours().toString().padStart(2, '0')}:${arriveTime.getMinutes().toString().padStart(2, '0')}:${arriveTime.getSeconds().toString().padStart(2, '0')}`));
    arrivalTimes.appendChild(document.createElement("br"));
  }
};

function openLineStatus(lineId) {
  document.getElementById(lineId).click();
}
