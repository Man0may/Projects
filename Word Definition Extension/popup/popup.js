console.log("popup");
let query = { active: true, currentWindow: true };
chrome.tabs.query(query, gotTabs);

function gotTabs(tabs) {
  console.log("gotTabs");
  let msg = {
    txt: "popup",
  };

  chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
    console.log("tabs.sendMessage");
    if (!response) {
      document.getElementById("phonetic").innerHTML =
        "Refresh the page and try again.";
    } else if (response.sent === "_TextNotSelected_") {
      document.getElementById("phonetic").innerHTML = "Welcome!";
      document.getElementById("example").innerHTML =
        "Please select a word to find its definition.";
    } else {
      let res = response.sent;
      res = res.replace(/[^a-zA-Z ]/g, "");
      dictionary(res);
    }
  });
}

let wordef,
  word,
  phonetic,
  pos,
  defin,
  index = 0,
  indlimit;

async function dictionary(query) {
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`;
  let response = await fetch(url);
  wordef = await response.json();
  if (wordef && !wordef.title) {
    indlimit = wordef[0].meanings.length;
    word = wordef[0].word;
    phonetic = wordef[0].phonetic ? wordef[0].phonetic : "";
    index = 0;

    setValues();

    if (indlimit > 1) {
      document
        .getElementById("navigatecontainer")
        .classList.remove("hidenavigator");
    }
  } else if (wordef.title) {
    document.getElementById("error").innerHTML = "⚠  " + wordef.title;
  }
}

document.getElementById("prev").addEventListener("click", handlePrevious);
document.getElementById("next").addEventListener("click", handleNext);

function handlePrevious() {
  index = index - 1;
  if (index < 0) index = indlimit - 1;
  setValues();
}

function handleNext() {
  index = index + 1;
  if (index >= indlimit) index = 0;
  setValues();
}

function setValues() {
  pos = wordef[0].meanings[index].partOfSpeech;
  defin = wordef[0].meanings[index].definitions[0].definition;
  example = wordef[0].meanings[index].definitions[0].example
    ? wordef[0].meanings[index].definitions[0].example
    : null;

  document.getElementById(
    "word"
  ).innerHTML = `${word}`;
  document.getElementById("phonetic").innerHTML = `${phonetic}  (${pos})`;
  document.getElementById("definition").innerHTML = defin;
}