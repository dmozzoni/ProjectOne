"use strict";

let databaseSize;
let fullGroupTypeArray = [], fullCommonNameArray = [], fullLatinNameArray = [];
let fullImgSrcArray = [], fullDateArray = [];
let dataFileSrc = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpA97t0qk19B00C617SeAF2eKZSJURLlNsy9b_UfgvUxti3Bw6ymc365TfoXHpQNfg7LDxVAYO_6-s/pub?gid=0&single=true&output=csv";
let jsonSource = "https://api.myjson.com/bins/32q8f"
let index, current, working;
let database = {};
let dateTxtBool = false;

let scoreVals = [10,6,3,1,0];
let numGuesses = 0;
let scoreTotal = 0;
let numPerRound = 2;
let roundIndex = -1;

let highscore = [];










var by = function (path, reverse, primer, then) {
    var get = function (obj, path) {
            if (path) {
                path = path.split('.');
                for (var i = 0, len = path.length - 1; i < len; i++) {
                    obj = obj[path[i]];
                };
                return obj[path[len]];
            }
            return obj;
        },
        prime = function (obj) {
            return primer ? primer(get(obj, path)) : get(obj, path);
        };

    return function (a, b) {
        var A = prime(a),
            B = prime(b);

        return (
            (A < B) ? -1 :
            (A > B) ?  1 :
            (typeof then === 'function') ? then(a, b) : 0
        ) * [1,-1][+!!reverse];
    };
};








function sleep(ms) {
  var dt = new Date();
  dt.setTime(dt.getTime() + ms);
  while (new Date().getTime() < dt.getTime());
}


let timer = {

    seconds: 0,
    timerId: null,
    running: false,

    updateTime() {
      this.seconds++;
//      $("#timer").text("Time elapsed: "+this.seconds);
      $("#timer").text(this.seconds);
    },

    clickStart() {
      this.timerId = setInterval(this.updateTime.bind(this), 1000);
      this.running = true;
    },

    clickPause() {
      clearInterval(this.timerId);
      this.running = false;
    },

    clickReset() {
      clearInterval(this.timerId);
      this.seconds = 0;
      this.running = false;
//      $("#timer").text("Stop Watch");
      $("#timer").text("0");
    },

    go() {
      $("#start").on("click", () => {this.clickStart();} );
      $("#reset").on("click", () => {this.clickReset();} );
      $("#pause").on("click", () => {this.clickPause();} );
    }

};


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


//    d3.csv(dataFileSrc, function(data) {
      d3.csv("data.csv", function(data) {
//    d3.csv("http://localhost:8000/data.csv", function(data) {

        initGame(data);

      });

      // $.ajax({
      //     url: "https://api.myjson.com/bins/32q8f",
      //     type: "GET",
      //     dataType: "json"
      // }).done(function(response){
      //     highscore = response
      // }).fail(function (){
      //     alert ("Failed to retrieve a Highscores...");
      // });


     highscore = [
       {"user":"cyric", "score":"100","time":"200"},
       {"user":"dave", "score":"343","time":"250"},
       {"user":"mary", "score":"2","time":"300"},
       {"user":"dan", "score":"231","time":"350"},
       {"user":"sue", "score":"765","time":"400"},
       {"user":"kyle", "score":"213","time":"450"},
       {"user":"tracy", "score":"500","time":"100"},
       {"user":"marie", "score":"500","time":"102"},
       {"user":"carol", "score":"500","time":"101"},
       {"user":"ryan", "score":"1","time":"650"}
     ];

     highscore.sort( by('score', true, parseFloat, by('time',false, parseFloat)));


    }


let populateHighscoreTable = function() {

   highscore.sort( by('score', true, parseFloat, by('time',true, parseFloat)));

   let t3 = document.getElementById('highscoreTable');
   t3.innerHTML = '<tr><th> User </th><th> Score </th><th> Time </th></tr>';
   for (let i = 0; i < highscore.length; i++) {
       t3.innerHTML += '<tr><td>' + highscore[i].user + '</td><td>' + highscore[i].score + '</td><td> ' + highscore[i].time + '</td></tr>';
   }

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


let fillChoiceRandom = function(answer, array, num) {

    let tmp = getUnique(array).filter(function(ii){
        return ii !== answer;
    });

    return shuffle(tmp).slice(0,num);
}



let startRound = function() {

    if(!timer.running) {
        timer.clickReset();
        timer.clickStart();
    }
    roundIndex++;

    if(roundIndex < numPerRound) {
        setupQuestion();
    } else {
        timer.clickPause();
        roundIndex = -1;
    //    alert("Round complete in: " + timer.seconds + "with a score of: " + scoreTotal);

        $('#mainPane').fadeToggle('slow', function(){
            $('#scorePane').fadeToggle('slow');
        });

        $("#highscoreNote").text('You Scored: '+ scoreTotal + ' points in a time of: ' + timer.seconds + ' seconds');
        populateHighscoreTable();

        if ((scoreTotal > highscore[9].score) || ((scoreTotal === highscore[0]) && (timer.seconds <= highscore.time))) {
          $("#highscoreNote2").toggleClass("hide");
          $("#highscoreForm").toggleClass("hide");
        }






    }

};

$('#highscoreForm').on('submit', function(e){
  e.preventDefault();
  let input = $('#user-field').eq(0).val();
  if (input==='') { input = 'Anonymous';}

  if ((scoreTotal > highscore[9].score) || ((scoreTotal === highscore[0]) && (timer.seconds <= highscore.time))) {
      highscore.pop();
      highscore.push({"user":input,"score":scoreTotal,"time":timer.seconds});
      scoreTotal = 0;
      $('#score').text(scoreTotal);
  }

  populateHighscoreTable();
  $("#highscoreNote2").toggleClass("hide");
  $("#highscoreForm").toggleClass("hide");
});




let setupQuestion = function() {

    let choices = [];
    numGuesses = 0;
    current = arrIndexToObj(roundIndex,working);
    let workComNamTmp = working.commonName.slice();
    let tmp = fillChoiceRandom(current.commonName, workComNamTmp,4);
    tmp.push(current.commonName);
    choices = shuffle(tmp);

    $('#photoPane').css('background-image','url(' + 'img/'+current.imgSrc+')');
    $('#txtDate').eq(0).text(current.date);

    for(let i=0;i<$('.answerButtons').length;i++) {
         $('.answerButtons')[i].disabled = false;
         $('.answerButtons').eq(i).text(choices[i]);
         $('.answerButtons').eq(i).removeClass("wrongAnswer");
         $('.answerButtons').eq(i).removeClass("correctAnswer");
    }
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
      $("fieldset").append('<input type="checkbox" class="subgrps" checked=true value="' + uniqueGroups[i] +'"><br>');
      database[uniqueGroups[i]] = { commonName: [], date: [], groupType: [], imgSrc: [], latinName: [] };
  }

   database["full"] = { commonName: fullCommonNameArray, date: fullDateArray,
     groupType: fullGroupTypeArray, imgSrc: fullImgSrcArray, latinName: fullLatinNameArray
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

  // for (let i = 0; i<$(".subgrps").length;i++) {
  //      num += database[$(".subgrps")[i].value].commonName.length;
  // }
$('#numAvailableQuestions').text(database.full.date.length);

}


$('.answerButtons').on('click', function() {
    if($(this).text() == current.commonName) {
          $(this).toggleClass("correctAnswer");
          scoreTotal += scoreVals[numGuesses]
          $('#score').text(scoreTotal);
          $("#txtAnswer").fadeIn('slow', function() {
              $("#txtAnswer").fadeOut('slow', function() {
                startRound();
//                setupQuestion();
              });
          });
    } else {
          $(this)[0].disabled = true;
          numGuesses++;
          $(this).toggleClass("wrongAnswer");
    }
});




$('#propertiesButton').on('click', function() {
    working = { commonName: [], date: [], groupType: [], imgSrc: [], latinName: [] };
    let num;
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


$(document).on('change', '.subgrps', function(){
     let allUnchecked = true;
     let num=0;

      for (let i = 0; i<$(".subgrps").length;i++) {
         if ($(".subgrps")[i].checked) {
           num += database[$(".subgrps")[i].value].commonName.length;
           allUnchecked = false;
         }
      }

      if(allUnchecked) {$('#propertiesButton')[0].disabled=true;}
      else {$('#propertiesButton')[0].disabled=false;}

      $('#numAvailableQuestions').text(num);

});

$('#checkDate').on('change', function(){
      if($("#checkDate")[0].checked) { $("#txtDate").toggleClass("hide"); }
      else {$("#txtDate").toggleClass("hide");}
});



$('#startButton').on('click', function () {
   $('#welcomePane').fadeToggle('slow', function(){
      $('#mainPane').fadeToggle('slow');
      startRound();
   });
});

$('#propertiesButton').on('click', function () {
   $('#propertiesPane').fadeToggle('slow', function(){
      $('#mainPane').fadeToggle('slow');
   });
});


$('#settingButton').on('click', function () {
   $('#mainPane').fadeToggle('slow', function(){
      $('#propertiesPane').fadeToggle('slow');
   });
});

$('#homeButton').on('click', function () {
   $('#mainPane').fadeToggle('slow', function(){
      $('#welcomePane').fadeToggle('slow');
   });
});

$('#highscoreButton').on('click', function () {
   $('#scorePane').fadeToggle('slow', function(){
      $('#welcomePane').fadeToggle('slow');
   });
});

loadDatabase();
