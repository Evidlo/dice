# DnD Dice Roller

I want to build a static, web-based, single-page, DnD dice roller.  I would like to have these features

- one HTML file and one JS file
- support for arbitrary dice notation using dice-roller github project
  - this is entered as a string
- help button on the top that opens a modal concisely explaining dice roller notations
- ability to add/remove dice
- each entry should have its own roll button
- entries should look like:
  - first row: label, "Roll" button, "Remove" button
  - next row: loading_bar/roll_results
- last row: label, dice_input, "Add"
- when "Roll" is pressed, briefly show a loading bar for 0.5s, then show the dice results, each dice in its own button (not clickable)
- use Pico CSS framework
- do not use nodejs/npm - fetch JS dependencies manually
- do not rely on CDNs

Styling preferences
- "Add" button is green
- "Remove" button is red
- "Roll" button is blue
- dice_input is prefilled with "1d6"
- dice results for each entry are all on one row