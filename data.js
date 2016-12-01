"use strict";

let databaseSize;
let fullGroupTypeArray = [], fullCommonNameArray = [], fullLatinNameArray = [];
let fullImgSrcArray = [], fullDateArray = [];
let dataFileSrc = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpA97t0qk19B00C617SeAF2eKZSJURLlNsy9b_UfgvUxti3Bw6ymc365TfoXHpQNfg7LDxVAYO_6-s/pub?gid=0&single=true&output=csv";
let index, current, working;
let database = {};

function getUnique(inputArray) {
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

    // if(localStorage.data) {
    //
    //   initGame(localStorage.data);
    //
    //
    // } else {

      d3.csv(dataFileSrc, function(data) {

        // localStorage.data = data;
        initGame(data);

      });


    // }


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


let fillChoiceRandom = function(current, array, num) {

    let tmp = getUnique(array)
    let tmpp = tmp.filter(function(ii){
        return ii !== current.commonName;
    });

    return shuffle(tmpp).slice(0,num);
}


let setupQuestion = function() {

    let choices = [];
    current = arrIndexToObj(index,working);
    let workComNamTmp = working.commonName.slice();
    let tmp = fillChoiceRandom(current, workComNamTmp,4);
    tmp.push(current.commonName);
    choices = shuffle(tmp);

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

  let uniqueGroups = getUnique(fullGroupTypeArray);

  for (let i=0;i<uniqueGroups.length;i++) {

      $("fieldset").append('<label>' + uniqueGroups[i] +'</label>');
      $("fieldset").append('<input type="checkbox" class="subgrps" checked=true value="' + uniqueGroups[i] +'">');

      database[uniqueGroups[i]] = { commonName: [], date: [], groupType: [], imgSrc: [], latinName: [] };

  }

   database["full"] = {
     commonName: fullCommonNameArray,
     date: fullDateArray,
     groupType: fullGroupTypeArray,
     imgSrc: fullImgSrcArray,
     latinName: fullLatinNameArray
  };


for (let i = 0; i<uniqueGroups.length; i++) {
    for (let j = 0; j<database.full.groupType.length; j++) {
        if (database.full.groupType[j] === uniqueGroups[i]) {
              database[uniqueGroups[i]].commonName.push(database.full.commonName[j]);
              database[uniqueGroups[i]].date.push(database.full.date[j]);
              database[uniqueGroups[i]].groupType.push(database.full.groupType[j]);
              database[uniqueGroups[i]].imgSrc.push(database.full.imgSrc[j]);
              database[uniqueGroups[i]].latinName.push(database.full.latinName[j]);
        }
    }
}

  working = jQuery.extend(true, {}, database.full); //copy object by value

  index = 0;
  setupQuestion();

}


$('.answerButtons').on('click', function() {
    if($(this).text() == current.commonName) {
        alert('Yes');
        setupQuestion();
      }
        else {alert('No');}
});




$('#propertiesButton').on('click', function() {
    working = { commonName: [], date: [], groupType: [], imgSrc: [], latinName: [] };
    for (let i = 0; i<$(".subgrps").length;i++) {
        if (  $('.subgrps')[i].checked  ) {
            working.commonName = working.commonName.concat(database[$('.subgrps')[i].value].commonName);
            working.date = working.date.concat(database[$('.subgrps')[i].value].date);
            working.latinName = working.latinName.concat(database[$('.subgrps')[i].value].latinName);
            working.groupType = working.groupType.concat(database[$('.subgrps')[i].value].groupType);
            working.imgSrc = working.imgSrc.concat(database[$('.subgrps')[i].value].imgSrc);
        }
    }

    index = 0;
    setupQuestion();

});


$(document).on('change', 'input', function(){
     let allUnchecked = true;

      for (let i = 0; i<$("input").length;i++) {
         if ($("input")[i].checked) {allUnchecked = false;}
      }

      if(allUnchecked) {$('#propertiesButton')[0].disabled=true;}
      else {$('#propertiesButton')[0].disabled=false;}

});





$('#startButton').on('click', function () {
   $('#welcomePane').fadeToggle('slow', function(){
      $('#mainPane').fadeToggle('slow');
   });
});

$('#propertiesButton').on('click', function () {
   $('#propertiesPane').fadeToggle('slow', function(){
      $('#mainPane').fadeToggle('slow');
   });
});





loadDatabase();
