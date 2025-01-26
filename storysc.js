var wordcount = document.getElementById("story").innerHTML.split(' ').length;

document.getElementById("readingtime").innerHTML = Math.round(wordcount / 220);