# ProjectOne

A multiple choice trivia style game based on identifing the butterflies of RI.

## Google Sheets

Upon launch the database of trivia questions is fetched from a Google spreadsheet. This allows me to update the spreadsheet 
with additional questions without having to touch the web app.

## http://myjson.com/

The highscore list is stored as a json object on `myjson.com` site. Using ajax I `GET` and `PUT` the scores, which allows 
for score continuity across a browser rereash as well as across different clients. This is not particulaly robust and would 
likely drop scores under heavy load.

## Welcome Page

The game starts on the Welcome Page. In the upper right there are buttons to turn off sound effect, view the highscore 
list and view the Settings Page. In the middle of the page there is a start button which starts a round of the game using 
either the default settings or the updated settings (if they were updated on the Settings Page).

## Settings Page

Options to select which butterfly families to include in the working set of questions. An option to select the number of 
questions in the round. An option to turn on an overlay of the date a photo was taken (some butterflies speies can look 
similar but have different flight times). An option to turn off sound efffects. An option to select easy/hard mode. Easy mode 
randomly selects potential choices for each question form the entire working set, regardless of the butterfly family. Hard mode 
restricts the ramdomly selected choice to the butterly family. For example if using the full database (the default) and a photo of 
a Black Swallowtail is presented, in easy mode you could be given choices which include skippers, while in hard mode all the 
potential choice would be other swallowtails.



