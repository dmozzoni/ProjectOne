"use strict";
// let foo;
// let databaseSize;
// let fullGroupTypeArray = [], fullCommonNameArray = [], fullLatinNameArray = [];
// let fullImgSrcArray = [], fullDateArray = [];
// console.log("1");


$(document).ready(function() {


//   console.log("2");
//
// //let foo;
//
//
//  d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQpA97t0qk19B00C617SeAF2eKZSJURLlNsy9b_UfgvUxti3Bw6ymc365TfoXHpQNfg7LDxVAYO_6-s/pub?gid=0&single=true&output=csv", function(data) {
// //   foo = data;
// //   console.log(foo[0]);
// console.log(" inside d3 1");
//
//    databaseSize = data.length;
//    for(let i = 0; i<databaseSize; i++) {
//      fullGroupTypeArray[i] = data[i].groupType;
//       fullCommonNameArray[i] = data[i].commonName;
//       fullLatinNameArray[i] = data[i].latinName;
//       fullImgSrcArray[i] = data[i].imgSrc;
//       fullDateArray[i] = data[i].date;
//    }
//
//    console.log("inside d3 2");
//
//       console.log(data[0]);
//       console.log(fullCommonNameArray[data.length-1]);
//
//
//
//
//  });


 console.log("3");

//while (fullCommonNameArray[0] === undefined) {console.log("wait");}

 //console.log(foo);

//
// foo = [];
// foo[0] = {
//   commonName: "American Copper",
//   date:"7/12/2008",
//   groupType:"Gossamer-wing",
//   imgSrc:"IMG_1894.jpg",
//   latinName:"Lycaena phlaeas",
//   suggest : ""
// };
// foo[1] = {
//   commonName: "American Lady",
//   date:"7/11/2009",
//   groupType:"Brush-footed",
//   imgSrc:"IMG_3677.jpg",
//   latinName:"Vanessa virginiensis",
//   suggest : ""
// };
// foo[2] = {
//   commonName: "Butterfly One",
//   date:"7/11/2009",
//   groupType:"Skipper",
//   imgSrc:"IMG_3677.jpg",
//   latinName:"Vanessa virginiensis",
//   suggest : ""
// };
// foo[3] = {
//   commonName: "Butterfly Two",
//   date:"7/11/2009",
//   groupType:"Skipper",
//   imgSrc:"IMG_3677.jpg",
//   latinName:"Vanessa virginiensis",
//   suggest : ""
// };
// foo[4] = {
//   commonName: "Butterfly Three",
//   date:"7/11/2009",
//   groupType:"Brush-footed",
//   imgSrc:"IMG_3677.jpg",
//   latinName:"Vanessa virginiensis",
//   suggest : ""
// };
console.log("4");



console.log("5");

console.log(fullGroupTypeArray);
let uniqueGroups = GetUnique(fullGroupTypeArray);
console.log(uniqueGroups);
console.log("6");

let full = {
  commonName: fullCommonNameArray,
  date:fullDateArray,
  groupType:fullGroupTypeArray,
  imgSrc:fullImgSrcArray,
  latinName:   fullLatinNameArray
};

// let database = {};
// for (let i=0; i<uniqueGroups.length; i++) {
//   database += { [uniqueGroups[i]]: {} };
// }




let working = full;
let current;


let arrIndexToObj = function(index,obj) {
  let current = {
    commonName: obj.commonName[index],
    date: obj.date[index],
    groupType: obj.groupType[index],
    imgSrc: obj.imgSrc[index],
    latinName: obj.latinName[index]
  };
  return current;
};

let index = 0;

let setupQuestion = function() {

  current = arrIndexToObj(index,working);
  console.log("next question");
  console.log(current);

  $('img').attr("src", "img/"+current.imgSrc);
  $('#button1').text(current.commonName);
  $('#button2').text("Test");
  $('#button3').text("Test");
  $('#button4').text("Test");
  $('#button5').text("Test");
  index++;

};

//for(let i = 0; i<3; i++) {


//  current = arrIndexToObj(index,working);

//  console.log(current);

setupQuestion();

//  $("#mainPane").trigger("nextQuestion", setupQuestion );



  // $('img').attr("src", "img/"+foo[0].imgSrc);
  // $('#button1').text(current.commonName);
  // $('#button2').text(foo[1].commonName);
  // $('#button3').text(foo[2].commonName);
  // $('#button4').text(foo[3].commonName);
  // $('#button5').text(foo[4].commonName);

//}

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


//$("#mainPane").on("nextQuestion", setupQuestion);




























});
