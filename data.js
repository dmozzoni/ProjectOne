"use strict";
let databaseSize;
let fullGroupTypeArray = [], fullCommonNameArray = [], fullLatinNameArray = [];
let fullImgSrcArray = [], fullDateArray = [];
let dataFileSrc = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpA97t0qk19B00C617SeAF2eKZSJURLlNsy9b_UfgvUxti3Bw6ymc365TfoXHpQNfg7LDxVAYO_6-s/pub?gid=0&single=true&output=csv";
let index, current, working;


function GetUnique(inputArray) {
    let outputArray = [];
    for (let i = 0; i < inputArray.length; i++) {
        if ((jQuery.inArray(inputArray[i], outputArray)) == -1) {
            outputArray.push(inputArray[i]);
        }
    }
    return outputArray;
}


function shuffle(array) { // Ripped from StackOverflow
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}



function loadDatabase() {
    d3.csv(dataFileSrc, function(data) {
      initGame(data);
    });
}


let arrIndexToObj = function(index,obj) {
  return {
    commonName: obj.commonName[index],
    date: obj.date[index],
    groupType: obj.groupType[index],
    imgSrc: obj.imgSrc[index],
    latinName: obj.latinName[index]
  };
};



let fillChoiceRandom = function(array, num) {
    return shuffle(array).slice(0,num);
}



let setupQuestion = function() {

let choices = [];
current = arrIndexToObj(index,working);
 let workComNamTmp = working.commonName.slice();
 console.log(working.commonName);
let tmp = fillChoiceRandom(workComNamTmp,4);
console.log(working.commonName);

tmp.push(current.commonName);

choices = shuffle(tmp);

  console.log(choices);
  console.log(current);

  $('img').attr("src", "img/"+current.imgSrc);
  $('#button1').text(choices[0]);
  $('#button2').text(choices[1]);
  $('#button3').text(choices[2]);
  $('#button4').text(choices[3]);
  $('#button5').text(choices[4]);
  index++;

};





function initGame(data) {
  databaseSize = data.length;
  for(let i = 0; i<databaseSize; i++) {
     fullGroupTypeArray[i] = data[i].groupType;
     fullCommonNameArray[i] = data[i].commonName;
     fullLatinNameArray[i] = data[i].latinName;
     fullImgSrcArray[i] = data[i].imgSrc;
     fullDateArray[i] = data[i].date;
  }

  let uniqueGroups = GetUnique(fullGroupTypeArray);

for (let i=0;i<uniqueGroups.length;i++) {
    $("#buttonBar").append("<button class='buttonBar'>" + uniqueGroups[i] +"</button>");
}


// <fieldset data-role="controlgroup" data-type="horizontal">
//        <legend>Choose as many favorite colors as you'd like:</legend>
//          <label for="red">Red</label>
//          <input type="checkbox" name="favcolor" id="red" value="red">
//          <label for="green">Green</label>
//          <input type="checkbox" name="favcolor" id="green" value="green">
//          <label for="blue">Blue</label>
//          <input type="checkbox" name="favcolor" id="blue" value="blue">
//      </fieldset>
//
//



  let full = {
    commonName: fullCommonNameArray,
    date:fullDateArray,
    groupType:fullGroupTypeArray,
    imgSrc:fullImgSrcArray,
    latinName:   fullLatinNameArray
  };

   working = full;
   index = 0;
  setupQuestion();

}


$('.answerButtons').on('click', function() {
  console.log(this);
  console.log(current);
  if($(this).text() == current.commonName) {
      alert('Yes');
setupQuestion();

//      $("#mainPane").trigger("nextQuestion",setupQuestion);

}
  else {alert('No');}
});


loadDatabase();
