const cars = [
    {
        id: 1,
        image: 'images/car1.png'
    },
    {
        id: 2,
        image: 'images/car2.png'
    },
    {
        id: 3,
        image: 'images/car3.png'
    },
    {
        id: 4,
        image: 'images/car4.png'
    }
];

const form = document.getElementById('race-form');
const raceField = document.getElementById('race-field');
const messageConteiner = document.querySelector(`.message-conteiner`);
const reset = document.querySelector('button');
let competitors = [];
let carTimes = [];
let interval = 0;
let finishes = 0;

function newRace(car, idx){    
    const competitor = createCompetitor(car, idx);
    const divLane = createLane();
    divLane.appendChild(competitor);
    raceField.appendChild(divLane);
    competitors.push(competitor);    
}

function createLane(){
    const divRace = document.createElement('div');
    divRace.classList.add('race');
    return divRace;
}

function createCompetitor(car, idx){
    const competitor = document.createElement('img');
    competitor.id = idx+1;
    competitor.src = `${car.image}`;
    competitor.classList.add('car');
    return competitor;
}

function startRace(e){
    e.preventDefault();
    resetPage();
    const amountOfCompetitors = parseInt(document.getElementById('amount-of-competitors').value);
    finishes = 0;
    competitors = [];
    createElements(amountOfCompetitors);
    clearInterval(interval);
    messageConteiner.innerHTML = ''
    startMoveCars();
}

function createElements(amountOfCompetitors){
    if (amountOfCompetitors >= 2 && amountOfCompetitors <= 4) {
        for (let i = 0; i < amountOfCompetitors; i++) {
            newRace(cars[i], i);
        }
        showRestBTN();
    } else {
        alert('Please Enter A Valid Number!');
    }
}

function resetPage(){
    raceField.innerHTML = "";
    hideRestBTN();
    competitors = [];
    finishes = 0;
    messageConteiner.innerHTML = ''
}

function showRestBTN(){
    reset.style.display = `flex`;
}

function hideRestBTN(){
    reset.style.display = `none`;
}

function startMoveCars(){
    setStartTime();
    interval = setInterval(() => MoveEachCar(), 15);
}

function MoveEachCar(){
    competitors.forEach(car => {        
        let currentMargin = parseFloat(car.style.left) || 0;  
        let finishLine = raceField.offsetWidth - car.offsetWidth;
        let newMargin = Math.min(currentMargin + Math.floor(Math.random() * 5) + 1, finishLine);
        car.style.left = newMargin + 'px'; 
        if (!car.finish && newMargin>=finishLine){
            counterFinishes(car)
            setDuration(car)
        }
        checkIfOver();
    });
   
}

function setStartTime(){
    carTimes = competitors.map(car=>({
        time: Date.now(),
        id: car.id
    }))
}

function counterFinishes(car){
    car.finish = true;
    finishes++;
}

function checkIfOver(){
    if (finishes>=3 || finishes==competitors.length){
        clearInterval(interval);
        showResults();
        competitors = [];
    }
}

function showResults(){
    sortCarsByTime();
    console.log(carTimes);
    
    for (i=0; i<finishes; i++){
        createMessege(carTimes[i])
    }
}

function createMessege(car){
    let messege = document.createElement(`p`);
    messege.classList.add(`messege`)
    messege.innerText = `car number ${car.id} got in ${car.time} seconds`;
    messageConteiner.appendChild(messege);
}

function setDuration(competitor){
    let car = carTimes.find(car=> competitor.id == car.id)
    car.time = (Date.now() - car.time)/1000;
}

function sortCarsByTime(){
    carTimes.sort((a, b) => a.time - b.time)
}


form.addEventListener('submit', (e) => startRace(e));
reset.addEventListener('click', resetPage);
