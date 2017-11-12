function setPoints(tot, up, down) {
  var pTot = document.getElementById("count-total");
  var pUp = document.getElementById("count-up");
  var pDown = document.getElementById("count-down");
  pTot.innerHTML = tot.toString();
  pUp.innerHTML = up.toString();
  pDown.innerHTML = down.toString();
}

function showMenu() {
  var menu = document.getElementById("team-menu");
  menu.setAttribute("style", "height:auto;visibility:show;");
  var changeTeam = document.getElementById("change-team");
  changeTeam.setAttribute("style", "visibility:hidden;");
}

function hideMenu() {
  var menu = document.getElementById("team-menu");
  menu.setAttribute("style", "height:0;visibility:hidden;");
  var changeTeam = document.getElementById("change-team");
  changeTeam.setAttribute("style", "visibility:show");
}

function showUpboat() {
  var upboat = document.getElementById("btn-upboat");
  upboat.setAttribute("style", "height:auto;visibility:show;");
}

function showDownboat() {
  var downboat = document.getElementById("btn-downboat");
  downboat.setAttribute("style", "height:auto;visibility:show;");
}

function showButtons() {
  var changeTeam = document.getElementById("change-team");
  changeTeam.setAttribute("style", "visibility:show");
  if (Cookies.get("team") === "upvote") {
	showUpboat();
	console.log("aawjdlkJ");
  } else {
	showDownboat();
  }
}

function chooseUp() {
  Cookies.set("team", "upvote");
  var team = document.getElementById("team");
  team.innerHTML = "Team Upvote";
  hideMenu();
  showButtons();
}

function chooseDown() {
  Cookies.set("team", "downvote");
  var team = document.getElementById("team");
  team.innerHTML = "Team Downvote";
  hideMenu();
  showButtons();
}

function changeTeam() {
  Cookies.remove("team");
  location.reload();
}

var cookie = Cookies.get("team");
if (cookie === undefined) {
  showMenu();
} else {
  showButtons();
}

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = update;

xhr.open("GET", "/stats", true);
xhr.send();

function up() {
  xhr.open("GET", "/upvote", true);
  xhr.send();
}

function down() {
  xhr.open("GET", "/downvote", true);
  xhr.send();
}

function update(e) {
  if (xhr.readyState == 4 && xhr.status == 200) {
	var resp = JSON.parse(xhr.responseText);
	console.log(resp);
	setPoints(resp["Total"], resp["Upvotes"], resp["Downvotes"]);
  }
}
