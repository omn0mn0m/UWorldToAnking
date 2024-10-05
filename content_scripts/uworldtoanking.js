(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  
  function getAllIds() {
    let table = document.getElementsByTagName("tbody")[0]; // there should only be one

    let allIds = [];

    for (let row of table.rows) {
      allIds.push(row.cells[1].innerText.split(" - ")[1]);
    }

    return allIds;
  }

  function getCorrectIds() {
    let table = document.getElementsByTagName("tbody")[0]; // there should only be one
    
    let correctIds = [];

    for (let row of table.rows) {
      if (row.cells[0].children[1].children[0].classList.contains('fa-check')) {
        correctIds.push(row.cells[1].innerText.split(" - ")[1]);
      }
    }

    return correctIds;
  }


  function getIncorrectIds() {
    let table = document.getElementsByTagName("tbody")[0]; // there should only be one

    let incorrectIds = [];

    for (let row of table.rows) {
      if (row.cells[0].children[1].children[0].classList.contains('fa-times')) {
        incorrectIds.push(row.cells[1].innerText.split(" - ")[1]);
      }
    }
    
    return incorrectIds;
  }

  browser.runtime.onMessage.addListener((message) => {
    let ids = []
    let response = {}

    if (message.command === "getCorrectIds") {
      response['ids'] = getCorrectIds();
    } else if (message.command === "getIncorrectIds") {
      response['ids'] = getIncorrectIds();
    } else if (message.command === "getAllIds") {
      response['ids'] = getAllIds();
    } else {  }

    let qbName = document.getElementsByClassName("qb-name")[0].innerHTML;
    console.log(qbName)

    if (qbName.includes("STEP1")) {
      response['exam'] = "STEP1";
    } else if (qbName.includes("STEP2")) {
      response['exam'] = "STEP2";
    } else {  }

    return Promise.resolve(response);
  })
})();
