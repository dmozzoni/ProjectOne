// var obj = {
//     "key": "value",
//     "key2": "value2"
// };
// var highscore = [
//        {"user":"Rand al'Thor",      "score":"50", "time":"100"},
//        {"user":"Egwene al'Vere",    "score":"45", "time":"100"},
//        {"user":"Matrim Cauthon",    "score":"40", "time":"100"},
//        {"user":"Moiraine Damodred", "score":"35", "time":"100"},
//        {"user":"Perrin Aybara",     "score":"30", "time":"100"},
//        {"user":"Nynaeve al'Meara",  "score":"25", "time":"100"},
//        {"user":"Lan Mandragoran",   "score":"20", "time":"100"},
//        {"user":"Elayne Trakand",    "score":"15", "time":"100"},
//        {"user":"Thom Merrilin",     "score":"10", "time":"100"},
//        {"user":"Siuan Sanche",      "score":"5",  "time":"100"}
//      ];
//
//
//
// var data = JSON.stringify(highscore);
//
//     $.ajax({
//         url: "https://api.myjson.com/bins",
//         type: "POST",
//         data: data,
//         contentType: "application/json; charset=utf-8",
//         dataType: "json",
//         success: function (data, textStatus, jqXHR) {
//
//             var updatedObj = {
//                 "key": "updated value",
//                 "key2": "updated value2"
//             };

    var newhighscore = [
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

            var updatedData = JSON.stringify(newhighscore);
// console.log(data);
// console.log(data.uri);
            // do update
            $.ajax({
                url: "https://api.myjson.com/bins/32q8f",
                type: "PUT",
                data: updatedData,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    var json = JSON.stringify(data);
                    $("#data").val(json);
                }
            });
    //     }
    // });
