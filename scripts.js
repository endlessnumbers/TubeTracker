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
        panel.style.display = "block";
      }
    });
  }
}

function openLineStatus(lineId) {
  document.getElementById(lineId).click();
}
