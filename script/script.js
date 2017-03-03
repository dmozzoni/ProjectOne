"use strict";

let databaseSize, current, working, highscoreJson;
let fullGroupTypeArray = [], fullCommonNameArray = [], fullLatinNameArray = [];
let fullImgSrcArray = [], fullDateArray = [], indexArray = [], highscore = [];
let dataFileSrc = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpA97t0qk19B00C617SeAF2eKZSJURLlNsy9b_UfgvUxti3Bw6ymc365TfoXHpQNfg7LDxVAYO_6-s/pub?gid=0&single=true&output=csv";
let jsonSource = "https://api.myjson.com/bins/32q8f";
let database = {};
let scoreVals = [10,6,3,1,0], scoreValsHard = [15,9,5,2,0];
let numGuesses = 0, scoreTotal = 0;
let numPerRound = 10, roundIndex = -1;
let playAudio = true, diffHard = false, dateTxtBool = false;


//
// Function to sort array of objects
// http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
//
var by = function(path, reverse, primer, then) {
    var get = function(obj, path) {
            if (path) {
                path = path.split('.');
                for (var i = 0, len = path.length - 1; i < len; i++) {
                    obj = obj[path[i]];
                }
                return obj[path[len]];
            }
            return obj;
        },
        prime = function(obj) {
            return primer ? primer(get(obj, path)) : get(obj, path);
        };

    return function(a, b) {
        var A = prime(a), B = prime(b);
        return (
            (A < B) ? -1 :
            (A > B) ? 1 :
            (typeof then === 'function') ? then(a, b) : 0
        ) * [1, -1][+!!reverse];
    };
};


// Timer Object
let timer = {
    seconds: 0,
    timerId: null,
    running: false,

    updateTime() {
        this.seconds++;
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
        $("#timer").text("0");
    }
};


function getUnique(inputArray) {
    let outputArray = [];
    for (let i = 0; i < inputArray.length; i++) {
        if ((jQuery.inArray(inputArray[i], outputArray)) == -1) outputArray.push(inputArray[i]);
    }
    return outputArray;
}


// Function to randomize an array. Ripped from StackOverflow
function shuffle(array) {
    let counter = array.length;
    while (counter > 0) { // While there are elements in the array
        let index = Math.floor(Math.random() * counter); // Pick a random index
        counter--; // Decrease counter by 1
        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}


function loadDatabase() {
      d3.csv(dataFileSrc, function(data) {
      //  d3.csv("http://localhost:8000/data.csv", function(data) {
      //  d3.csv("data.csv", function(data) {
            initGame(data);
       });
       $.ajax({
           url: jsonSource,
           type: "GET",
           dataType: "json"
       }).done(function(response){
           highscore = response;
//           console.log('Ajax - loadDatabase: Retrieved Highscores...');
           highscore.sort( by('score', true, parseFloat, by('time',false, parseFloat)));
           populateHighscoreTable();
       }).fail(function (){
           console.log("Failed to retrieve Highscores... Using default...");
           highscore = [
             {"user":"Rand al'Thor",      "score":"50", "time":"100"},
             {"user":"Egwene al'Vere",    "score":"45", "time":"100"},
             {"user":"Matrim Cauthon",    "score":"40", "time":"100"},
             {"user":"Moiraine Damodred", "score":"35", "time":"100"},
             {"user":"Perrin Aybara",     "score":"30", "time":"100"},
             {"user":"Nynaeve al'Meara",  "score":"25", "time":"100"},
             {"user":"Lan Mandragoran",   "score":"20", "time":"100"},
             {"user":"Elayne Trakand",    "score":"15", "time":"100"},
             {"user":"Thom Merrilin",     "score":"10", "time":"100"},
             {"user":"Siuan Sanche",      "score":"5",  "time":"100"}
           ];
           highscore.sort( by('score', true, parseFloat, by('time',false, parseFloat)));
           populateHighscoreTable();
       });
}


let populateHighscoreTable = function() {
    highscore.sort(by('score', true, parseFloat, by('time', true, parseFloat)));
    let t3 = document.getElementById('highscoreTable');
    t3.innerHTML = '<tr><th> User </th><th> Score </th><th> Time </th></tr>';
    for (let i = 0; i < highscore.length; i++) {
        t3.innerHTML += '<tr><td>' + highscore[i].user + '</td><td>' + highscore[i].score + '</td><td> ' + highscore[i].time + '</td></tr>';
    }
};


let arrIndexToObj = function(index, obj) {
    return {
        commonName: obj.commonName[index],
        date: obj.date[index],
        groupType: obj.groupType[index],
        imgSrc: obj.imgSrc[index],
        latinName: obj.latinName[index]
    };
};


let fillChoiceRandom = function(answer, array, num) {
    let tmp = getUnique(array).filter( (ii) => { return ii !== answer; });
    return shuffle(tmp).slice(0, num);
};


let startRound = function() {
    if (!timer.running) {
        timer.clickReset();
        timer.clickStart();
        scoreTotal = 0;
        $('#score').text(scoreTotal);
    }
    roundIndex++;
    if(roundIndex < numPerRound) {
        setupQuestion();
    } else {
        timer.clickPause();
        roundIndex = -1;
        $('#mainPane').fadeToggle('slow', function(){
            $('#scorePane').fadeToggle('slow');
        });
        $("#highscoreNote").text('You Scored: '+ scoreTotal + ' points in a time of: ' + timer.seconds + ' seconds.');
        $.ajax({
            url: jsonSource,
            type: "GET",
            dataType: "json"
        }).done(function(response){
            highscore = response;
 //           console.log('Ajax - loadDatabase: Retrieved Highscores...');
            highscore.sort( by('score', true, parseFloat, by('time',false, parseFloat)));
            populateHighscoreTable();
            if ((scoreTotal > highscore[9].score) || ((scoreTotal === highscore[0]) && (timer.seconds <= highscore.time))) {
              $("#highscoreNote2, #highscoreForm").removeClass("hide");
            }
        }).fail(function (){
            console.log("Failed to retrieve Highscores... Using default...");
            populateHighscoreTable();
            if ((scoreTotal > highscore[9].score) || ((scoreTotal === highscore[0]) && (timer.seconds <= highscore.time))) {
              $("#highscoreNote2, #highscoreForm").removeClass("hide");
            }
        });
    }
};


$('#highscoreForm').on('submit', function(e) {
    e.preventDefault();
    let input = $('#user-field').eq(0).val();
    if (input === '') input = 'Anonymous';
    if ((scoreTotal > highscore[9].score) || ((scoreTotal === highscore[0]) && (timer.seconds <= highscore.time))) {
        highscore.pop();
        highscore.push({
            "user": input,
            "score": scoreTotal,
            "time": timer.seconds
        });
    }
    populateHighscoreTable();
    $("#highscoreNote2, #highscoreForm").addClass("hide");

    let updatedHighscore = JSON.stringify(highscore);
    $.ajax({
        url: jsonSource,
        type: "PUT",
        data: updatedHighscore,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
            console.log('Ajax - PUT successful...');
        }
    }).fail(function() {
        console.log("Ajax - Failed to PUT Highscores...");
    });
});


let createIndexArray = function(size) { // Returns an array populated with its index values
   return Array(size).fill(0).map( (p,i) => {return i;} );
};


let setupQuestion = function() {
    let choices = [], workComNamTmp = [];
    numGuesses = 0;
    current = arrIndexToObj(indexArray[0], working);
    indexArray.push(indexArray.shift());
    workComNamTmp = (diffHard) ? database[current.groupType].commonName.slice() : working.commonName.slice();
    let tmp = fillChoiceRandom(current.commonName, workComNamTmp, 4);
    tmp.push(current.commonName);
    choices = shuffle(tmp);
    $('#photoPane').css('background-image', 'url(' + 'img/' + current.imgSrc + ')');
    $('#txtDate').eq(0).text(current.date);
    for (let i = 0; i < $('.answerButtons').length; i++) {
        $('.answerButtons')[i].disabled = false;
        $('.answerButtons').eq(i).text(choices[i]);
        $('.answerButtons').eq(i).removeClass("wrongAnswer correctAnswer");
    }
};


function initGame(data) {
    databaseSize = data.length;
    for (let i = 0; i < databaseSize; i++) {
        fullGroupTypeArray[i] = data[i].groupType;
        fullCommonNameArray[i] = data[i].commonName;
        fullLatinNameArray[i] = data[i].latinName;
        fullImgSrcArray[i] = data[i].imgSrc;
        fullDateArray[i] = data[i].date;
    }

    let uniqueGroups = getUnique(fullGroupTypeArray);
    for (let i = 0; i < uniqueGroups.length; i++) {
        $("#fieldset1").append('<input type="checkbox" class="subgrps" checked=true value="' + uniqueGroups[i] + '">');
        $("#fieldset1").append('<label>' + uniqueGroups[i] + '</label><br>');
        database[uniqueGroups[i]] = {
            commonName: [],
            date: [],
            groupType: [],
            imgSrc: [],
            latinName: []
        };
    }

    database["full"] = {
        commonName: fullCommonNameArray,
        date: fullDateArray,
        groupType: fullGroupTypeArray,
        imgSrc: fullImgSrcArray,
        latinName: fullLatinNameArray
    };

    for (let i = 0; i < uniqueGroups.length; i++) {
        for (let j = 0; j < database.full.groupType.length; j++) {
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
    indexArray = shuffle(createIndexArray(working.commonName.length));

    $("#qprInput").attr('max', indexArray.length);
    $('#numAvailableQuestions').text(database.full.date.length);
}


$('.answerButtons').on('click', function() {
    if ($(this).text() == current.commonName) {
        $(this).toggleClass("correctAnswer");
        if (playAudio) $('#audioRight')[0].play();
        scoreTotal += (diffHard) ? scoreValsHard[numGuesses] : scoreVals[numGuesses];
        $('#score').text(scoreTotal);
        $("#txtAnswer").fadeIn('slow', () => {
            $("#txtAnswer").fadeOut('slow', () => { startRound(); });
        });
    } else {
        $(this)[0].disabled = true;
        numGuesses++;
        if (playAudio) $('#audioWrong')[0].play();
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
    indexArray = shuffle(createIndexArray(working.commonName.length));
});


$(document).on('change', '.subgrps', function() {
    let allUnchecked = true;
    let num = 0;
    for (let i = 0; i < $(".subgrps").length; i++) {
        if ($(".subgrps")[i].checked) {
            num += database[$(".subgrps")[i].value].commonName.length;
            allUnchecked = false;
        }
    }
    $("#qprInput").attr('max', num);
    if (num < $("#qprInput").val()) $("#qprInput").val(num);
    if (num === 0) $("#qprInput").val(5);
    $('#propertiesButton')[0].disabled = (allUnchecked) ? true : false;
    $('#numAvailableQuestions').text(num);
    numPerRound = $("#qprInput").val();
});


$('#qprInput').on('change', () => { numPerRound = $("#qprInput").val(); });


$('#checkDate').on('change', () => { $("#txtDate").toggleClass("hide"); });


$('#checkDiff').on('change', () => { diffHard = ($("#checkDiff")[0].checked) ? false : true; });


$('#checkSound').on('change', function() {
    if ($("#checkSound")[0].checked) {
        playAudio = true;
        $("#audioButtonWelcome, audioButtonMain").removeClass("half");
    } else {
        playAudio = false;
        $("#audioButtonWelcome, audioButtonMain").addClass("half");
    }
});


$('#audioButtonMain, #audioButtonWelcome').on('click', function() {
    if ($("#checkSound")[0].checked) {
        playAudio = false;
        $("#checkSound")[0].checked = false;
        $("#audioButtonWelcome, #audioButtonMain").addClass("half");
    } else {
        playAudio = true;
        $("#checkSound")[0].checked = true;
        $("#audioButtonWelcome, #audioButtonMain").removeClass("half");
    }
});


$('#startButton').on('click', () => {
    $('#welcomePane').fadeToggle('slow', () => {
        $('#mainPane').fadeToggle('slow');
        startRound();
    });
});


$('#homeButtonMain').on('click', () => {
    $('#mainPane').fadeToggle('slow', () => {
        $('#welcomePane').fadeToggle('slow');
        roundIndex = -1;
        timer.clickPause();
    });
});


$('#propertiesButton').on('click', () => {
    $('#propertiesPane').fadeToggle('slow', () =>  { $('#welcomePane').fadeToggle('slow'); });
});


$('#settingButtonMain').on('click', () => {
    $('#mainPane').fadeToggle('slow', () => { $('#propertiesPane').fadeToggle('slow'); });
});


$('#highscoreButton').on('click', () => {
    $('#scorePane').fadeToggle('slow', () => { $('#welcomePane').fadeToggle('slow'); });
    $("#highscoreNote").text('');
});


$('#settingButtonWelcome').on('click', () => {
    $('#welcomePane').fadeToggle('slow', () => { $('#propertiesPane').fadeToggle('slow'); });
});


$('#highscoreButtonWelcome').on('click', () => {
    $('#welcomePane').fadeToggle('slow', () => { $('#scorePane').fadeToggle('slow'); });
});


loadDatabase();
