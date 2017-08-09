# Butterflies of Rhode Island

A multiple choice trivia style game based on identifying the butterflies of Rhode Island. All the photos presented within the game are from my personal archive of observations and all but a handful were taken in RI. All the butterflies in the quiz can potentially be seen in the state, although some are either rare or vagrants.

## Welcome Page

The game starts on the Welcome Page. In the upper right there are buttons to turn off sound effects, view the Highscore Page and view the Settings Page. In the middle of the page, there is a start button which starts a round of the game using either the default settings or the updated settings (if they were updated on the Settings Page).

## Settings Page

A page that aggregates some optional settings:

- There is an option to select which butterfly families to include in the working set of questions.

- There is an option to select the number of questions per round.

- There is an option to turn on an overlay of the date a photo was taken (some butterfly species can look similar but have different flight times).

- There is an option to turn off sound effects.

- There is an option to select easy/hard mode. Easy mode randomly selects potential choices for each question from the entire working set, regardless of butterfly family. Hard mode restricts the randomly selected choices to the butterfly family. For example, if using the full database (the default) and a photo of a Black Swallowtail is presented, in easy mode you could be given choices which include skippers, while in hard mode all the potential choices would be other swallowtails. The score values differ between easy and hard mode.

## Highscore Page

A page to display the current set of high scores.

I use `http://myjson.com/`, which is a site that provides a free JSON store service, to store the highscore data.
Using Ajax I `GET` and `PUT` the scores, which allows for score continuity across a browser refresh as well as across different clients. This is not particularly robust and would likely drop scores under heavy load.

After a round is completed, if your score is high enough to be included on the high score list an input form is displayed to submit a user name. The user/score is then added to the list locally as well as the JSON store.

There is a button to return to the Welcome Page.

## Quiz Page

A quiz round is started once this page is displayed. It is timed. A photo of a butterfly is presented as well as five multiple choice options (based on settings). Incorrect answer selection disables the choice, shows it in red and plays a wrong answer sound. Each successive incorrect answer reduces the points achievable. Upon selecting the correct answer a "Correct" notification is displayed as well as a correct answer sound. Then a new photo is presented. This repeats until the 'Number per Round' setting is reached. Upon completion, the Highscore Page is shown.

There are buttons on the top right of the page to toggle the sound effects and return to the Welcome Page (this aborts the current round).


## Google Sheets

Initially, I created the database of questions in a Google Spreadsheet and then published it as a CSV file. I would then fetch this file when the program started. However, due to possible "Access-Control-Allow-Origin" errors depending upon browser settings I ultimately opted to just store the database CSV file and fetch it locally.
