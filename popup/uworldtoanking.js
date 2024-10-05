const step1Tag = "tag:#AK\_Step1\_v12::#UWorld::Step::";
const step2Tag = "tag:#AK\_Step2\_v12::#UWorld::";

/**
 * Just log the error to the console.
 */
function reportError(error) {
  console.error(`Could not find tags: ${error}`);
}

function displayIds(exam, ids) {
  document.getElementById("question-ids-csv").value = ids.toString();

  let tagFilter = "";

  ids.forEach((id) => {
    if (tagFilter != "") {
      tagFilter = tagFilter.concat(" or ");
    }
    
    if (exam == "STEP1") {
      tagFilter = tagFilter.concat(step1Tag, id);
    } else if (exam == "STEP2") {
      tagFilter = tagFilter.concat(step2Tag, id);
    } else if (exam == "STEP3") {

    } else { }
  });

  console.log(exam);
  console.log(tagFilter);

  document.getElementById("question-ids-filter").value = tagFilter;
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  let copyCsvButton = document.getElementById("csv-copy-button");
  copyCsvButton.addEventListener("click", (e) => {
    navigator.clipboard.writeText(document.getElementById("question-ids-csv").value);
  });

  let copyFilterButton = document.getElementById("filter-copy-button");
  copyFilterButton.addEventListener("click", (e) => {
    navigator.clipboard.writeText(document.getElementById("question-ids-filter").value);
  });
  
  let allIdsButton = document.getElementById("all-ids-button")
  allIdsButton.addEventListener("click", (e) => {
    browser.tabs
           .query({ active: true, currentWindow: true })
           .then((tabs) => {
             browser.tabs.sendMessage(tabs[0].id, {
               command: "getAllIds",
             })
                    .then((response) => {
                      displayIds(response['exam'], response['ids']);
                    });
           })
           .catch(reportError);
    console.log('getAllIds');
  });
  
  let incorrectIdsButton = document.getElementById("incorrect-ids-button")
  incorrectIdsButton.addEventListener("click", (e) => {
    browser.tabs
           .query({ active: true, currentWindow: true })
           .then((tabs) => {
             browser.tabs.sendMessage(tabs[0].id, {
               command: "getIncorrectIds",
             })
                    .then((response) => {
                      displayIds(response['exam'], response['ids']);
                    });
           })
           .catch(reportError);
    console.log('getIncorrectIds');
  });
  
  let correctIdsButton = document.getElementById("correct-ids-button")
  correctIdsButton.addEventListener("click", (e) => {
    browser.tabs
           .query({ active: true, currentWindow: true })
           .then((tabs) => {
             browser.tabs.sendMessage(tabs[0].id, {
               command: "getCorrectIds",
             })
                    .then((response) => {
                      displayIds(response['exam'], response['ids']);
                    });
           })
           .catch(reportError);
    console.log('getCorrectIds');
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to find tags: ${error.message}`);
}

browser.tabs
       .executeScript({ file: "/content_scripts/uworldtoanking.js" })
       .then(listenForClicks)
       .catch(reportExecuteScriptError);
