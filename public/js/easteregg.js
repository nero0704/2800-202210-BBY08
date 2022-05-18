'use strict';
let searchString = "";
document.addEventListener("keyup", (e) => {
    searchString += e.key.toLowerCase();
    console.log(searchString);
    if (searchString.includes("mancave")) {
        window.location.href= "https://nero0704.github.io/HACKATHON/app/html/main.html"
    }
})