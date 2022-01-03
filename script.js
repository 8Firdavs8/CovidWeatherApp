/* jshint esversion: 8 */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */




// CS330-Internet Programming
// MidTerm Project: Mashup: CoviLocWeather Application
// CM Nafi and Firdavs Atabaev
// Professor Yasinovskyy





'use strict';

// Greetings 
var today = new Date();
var hourNow = today.getHours();
var greeting;

if (hourNow > 20) {
    greeting = 'Good evening, Welcome to our CoviLocWeather application!';
} else if (hourNow > 11) {
    greeting = 'Good afternoon, Welcome to our CoviLocWeather application!';
} else if (hourNow > 0) {
    greeting = 'Good morning Welcome to our CoviLocWeather application!';
} else {
    greeting = 'Welcome to our CoviLocWeather application!';
}
document.getElementById("greeting").innerHTML = greeting;

// Fetch the Data
async function getData(url) {
    return fetch(url)
    .then(response => response.json())
    .catch(error => console.log(error));
}


// Getting started with the Weather and the Location Information section of the project
async function getInfo() {

    let vals = JSON.parse(localStorage.getItem('post1'));
    if (vals != null){
        let menu = document.querySelector('#post > tbody');
        menu.innerHTML = "";
        let row = document.createElement("tr");
        let city = document.createElement("td");  
        var myDictionary = vals[0];

        // Appending from localStorage
        var name = myDictionary["cityName"];
        city.innerHTML = name
        row.appendChild(city);
        menu.appendChild(row);
        
        let temp2 = document.createElement("td");
        var weather = myDictionary["temperature"];
        temp2.innerHTML = weather;
        row.appendChild(temp2);
        menu.appendChild(row);
      
        let descr2 = document.createElement("td");
        var title = myDictionary["weather"];
        descr2.innerHTML = title;
        row.appendChild(descr2);
        menu.appendChild(row);
        
        var y = document.createElement("IMG");
        var icon2 = myDictionary["x"];
        y.setAttribute("src", icon2);
        row.appendChild(y);
        menu.appendChild(row);

        let descr4 = document.createElement("td");
        var title = myDictionary["myArray"];
        descr4.innerHTML = title;
        row.appendChild(descr4);
        menu.appendChild(row);
    }

    // Assigning my own APIKEY to a String
    // Source: https://openweathermap.org/api
    var api = "545fa6e4eff879afca0b6f2bb8947667";

    // Merging the apis together based on the selected city from the Covid Info section of the Project
    // This takes the selected city name and passes it to map api and weather api
    let cityName = document.getElementById("exampleFormControlSelect1").value;
    
    if (cityName != ""){

        // Fetching and getting a Json File
        let post = await fetch("https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+ api+"&units=metric")
        .then(response => response.json())
        .catch(error => console.log(error,"The City Does not Exist"));

        // Adding information to the table
        let allPostsDiv = document.querySelector("#post > tbody");
        allPostsDiv.innerHTML = "";
        let row = document.createElement("tr");
        let city = document.createElement("td");

        // Adding cityname to the table
        city.innerHTML = cityName;
        row.appendChild(city);

        // Adding temperature to the table
        let temp = document.createElement("td");
        const temperature = post.main.temp;
        temp.innerHTML = temperature;
        row.appendChild(temp);
        allPostsDiv.appendChild(row);

        // Adding description to the table
        let descr = document.createElement("td");
        const weather = post.weather[0].description
        descr.innerHTML = weather;
        row.appendChild(descr);

        // Adding an Icon to the table
        let io = document.querySelector("#td");
        var x = document.createElement("IMG");
        const icon = post.weather[0].icon
        const imageURl = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
        x.setAttribute("src", imageURl);
        row.appendChild(x);

        // Adding latitude and long to the paragraph for a later use
        let lat = document.createElement("td");
        let par = document.querySelector("#get2")
        var myArray = []
        const coordinator2 = post.coord.lon
        const coordinator = post.coord.lat
        myArray.push(coordinator);
        myArray.push(coordinator2)
        lat.innerHTML = myArray;
        par.innerHTML = myArray;
        row.appendChild(lat);

        // Removing everything from the localStorage
        localStorage.removeItem("post1");

        // Let's Set up a LocalStorage
        let menu = localStorage.getItem("post1");
        menu = menu ? JSON.parse(menu) : [];
        // Instead of writing line by line, one can write it using a for loop if wanted
        var myStore = {};
        myStore["cityName"] = cityName;
        myStore["temperature"] = temperature;
        myStore["weather"] = weather;
        myStore["x"] = imageURl;
        myStore["myArray"] = myArray;
        menu.push(myStore);
        localStorage.setItem("post1", JSON.stringify(menu));
        
        // Getting longitude and latitude
        let getNumbers = document.querySelector("#get2").innerHTML;
        var array = JSON.parse("[" + getNumbers + "]");
        var options = {
            zoom: 10,
            center: {lat:array[0], lng:array[1]}
        }
        // map
        var map = new
        google.maps.Map(document.getElementById('map'),options);

        //  marker
        var marker = new google.maps.Marker({
            position:{lat:array[0], lng:array[1]},
            map:map
        });
    }
}



// Started Covid Cases in the world part of the porject!

// Created a variable for the api of the Covid Cases

let covidData = 'https://www.trackcorona.live/api/cities';
async function getCovidData(covidData) {
    const response = await fetch(covidData);
    const cityCovid = await response.json();
    const cleanData = cityCovid.data;
    let readyInput = document.getElementById("clickFor").addEventListener("click", function(){
        selectName();
    });
//    Show the information of the selected cities/counties information on the table
    function showCovidCases(cityData){
       
                document.getElementById("location").textContent = cityData.location;
                document.getElementById("totalConfirmed").textContent = cityData.confirmed || 0;
                document.getElementById("totalDead").textContent = cityData.dead || 0;
                document.getElementById("updated").textContent = cityData.updated;
    }
// Getting the city names from the api indexes
    async function getCityData(city) {
        const cityURL = covidData + "/" + city;
        const dataResponse = await fetch(cityURL);
        const cityData = await dataResponse.json();
        return cityData.data[0];
    }
// Populating the drop down menu with the options for the names of the city
    function listOfCities(){
        for (let i=0; i<cleanData.length; i++){

            const iteratedArray = cleanData[i].location;
            var x = document.getElementById("exampleFormControlSelect1");
            var option = document.createElement("option");
            option.text = iteratedArray;
            x.add(option);

        }

    }

    // Select location and pass it to the table:
    async function selectName(){
        let e = document.getElementById("exampleFormControlSelect1");
        let strUser = e.value;
        console.log(strUser);
        const cityData = await getCityData(strUser);
        showCovidCases(cityData);

    }
   
    listOfCities();
    await selectName();    

}

window.onload = function() {
    getCovidData(covidData);
};