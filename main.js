import boom from "./sounds/boom.wav";
import clap from "./sounds/clap.wav";
import hat from "./sounds/hi_hat.wav";
import kick from "./sounds/kick.wav";
import open_hat from "./sounds/open_hat.wav";
import ride from "./sounds/ride.wav";
import snare from "./sounds/snare.wav";
import tink from "./sounds/tink.wav";
import tom from "./sounds/tom.wav";

//---------------declaring-------------------------
const key_config = [
  { id: "boom", key: "a", sound: boom },
  { id: "clap", key: "s", sound: clap },
  { id: "hi_hat", key: "d", sound: hat },
  { id: "kick", key: "f", sound: kick },
  { id: "open_hat", key: "g", sound: open_hat },
  { id: "ride", key: "h", sound: ride },
  { id: "snare", key: "j", sound: snare },
  { id: "time", key: "k", sound: tink },
  { id: "tom", key: "l", sound: tom },
];
let app_mode = "";
let record_mode = "";
let recordArr = [];
var start;
var Mcontainer = document.getElementById("Mcontainer");
var formSetting = document.getElementById("form");

formSetting.style.display = "none";

//---------------- start game id/ button --------------------
const start_game_btn = document.getElementById("start_game");
start_game_btn.addEventListener("click", () => {
  if (app_mode === "game") {
    start_game_btn.textContent = "Start Game";
    setting_btn.disabled = false;
    record_game_btn.disabled = false;
    playback_btn.disabled = false;
    app_mode = "";
  } else {
    start_game_btn.textContent = "End Game";
    setting_btn.disabled = true;
    record_game_btn.disabled = true;
    playback_btn.disabled = true;
    app_mode = "game";
  }
});

//---------------------record id/button--------------------------------
const record_game_btn = document.getElementById("record");
record_game_btn.addEventListener("click", () => {
  if (record_mode === "record") {
    record_game_btn.textContent = "Record";
    setting_btn.disabled = false;
    start_game_btn.disabled = false;
    playback_btn.disabled = false;
    record_mode = "";
  } else {
    record_game_btn.textContent = "Stop Record";
    setting_btn.disabled = true;
    start_game_btn.disabled = true;
    playback_btn.disabled = true;
    record_mode = "record";
    start = Date.now();
    recordArr = [];
  }
});

//------------------------playback id/button----------------------------
const playback_btn = document.getElementById("playback");
playback_btn.addEventListener("click", () => {
  key_config.forEach((k) => {
    for (let i = 0; i < recordArr.length; i++) {
      setTimeout(function () {
        if (recordArr[i].key === k.key) {
          const audio = new Audio(k.sound);
          audio.play();
        }
      }, recordArr[i].timestamp); //
    }
  });
});

//------------------------settings id/button----------------------------
const setting_btn = document.getElementById("settings");
setting_btn.addEventListener("click", () => {
  if (app_mode === "settings") {
    Mcontainer.style.display = "block";
    formSetting.style.display = "none";
    start_game_btn.disabled = false;
    record_game_btn.disabled = false;
    playback_btn.disabled = false;
    app_mode = "";
  } else {
    Mcontainer.style.display = "none";
    formSetting.style.display = "block";
    start_game_btn.disabled = true;
    record_game_btn.disabled = true;
    playback_btn.disabled = true;
    app_mode = "settings";
  }
});

// -----------------------Game mood-------------------------------------
const beats = ["f", "d", "f", "d", "f", "f", "d", "f", "d"];
const padding_count = 3;
const empty_array = Array(padding_count).fill(""); //eg ["", "", ""]
let new_array = [...empty_array, ...beats, ...empty_array]; // eg ["","","", f, d, f,d]

let current_index = 0;
let score = 0;
const getActualPosition = () => current_index + padding_count;

const score_element = document.getElementById("score");
const targets = document.getElementById("targets");

const updateTargets = () => {
  targets.innerHTML = "";
  const computed_array = new_array.slice(
    //to take first 7 elemets
    current_index,
    getActualPosition() + 4
  );
  //create the 7 elemets
  computed_array.forEach((item, index) => {
    const target_div = document.createElement("div");
    target_div.setAttribute(
      "class",
      `card sequence-card ${index === 3 ? "active" : ""}`
    );

    target_div.textContent = item;
    targets.appendChild(target_div);

    score_element.textContent = score;
  });
};
updateTargets();

//-----------------------------------controls section---------------------
const parent = document.getElementById("controls");
key_config.forEach((k) => {
  const control_div = document.createElement("div"); // <div id="hi_hat" class="card control">
  control_div.setAttribute("id", k.id);
  control_div.setAttribute("class", "card control");

  const control_label = document.createElement("div"); //<div class="label container">Hat</div>
  control_label.setAttribute("class", "label container");
  control_label.textContent = k.key;

  const control_key = document.createElement("div"); //<div class="key container">A</div>
  control_key.setAttribute("class", "key container");
  control_key.textContent = k.id;

  control_div.appendChild(control_label);
  control_div.appendChild(control_key);
  parent.appendChild(control_div);

  //   <div id="hi_hat" class="card control">
  //     <div class="label container">Hat</div>
  //     <div class="key container">A</div>
  //   </div>;
  control_div.addEventListener("click", (e) => {
    const audio = new Audio(k.sound);
    audio.play();
  });

  document.addEventListener("keydown", (e) => {
    if (app_mode === "settings") {
      return;
    }
    if (e.key.toLocaleLowerCase() === k.key) {
      const audio = new Audio(k.sound);
      audio.play();

      //-------------------game/button functions--------------------------------------------
      // if user key matches current target key then we increment
      if (app_mode === "game" && new_array[getActualPosition()] === e.key) {
        current_index++;
        score++;
      }

      if (record_mode === "record") {
        recordArr.push({
          key: e.key,
          timestamp: Date.now() - start,
        });
        console.log(recordArr);
      }

      if (getActualPosition() >= new_array.length - padding_count - 1) {
      }

      updateTargets();
    }
  });
});
