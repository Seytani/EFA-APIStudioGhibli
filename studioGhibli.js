//Variables
const ghibliUrl = 'https://ghibliapi.herokuapp.com/films/';
const imdbUrl = '';
const imdbKey = 'k_YZc7a910';
const myStorage = window.localStorage;
let storedData;
let displayCarousel = true;
let currentMovie = 0;

//DOM
let grid = document.querySelector('#grid');
let lists = document.querySelector('#lists');
let carouselContainer = document.querySelector('#ghibliCarousel');
let carousel = document.querySelector('.carousel-inner');
let catalog = document.querySelector('.catalog');
let watchedButton= document.querySelector('.watched-button');
let inWatchListButton = document.querySelector('.addToWatchList-button');
//control buttons
let watchedListButton = document.querySelector('#watched');
let toWatchButton = document.querySelector('#to-watch');
let watchListButton = document.querySelector('#watchlist');



//Pics
let pictures = {
    kikisdeliveryservice: "https://vignette.wikia.nocookie.net/studio-ghibli/images/e/e3/Kiki's_Delivery_Service.jpg/",
    castleinthesky: "https://vignette.wikia.nocookie.net/studio-ghibli/images/c/c1/Castle_in_the_Sky.jpg/",
    graveofthefireflies: "https://vignette.wikia.nocookie.net/studio-ghibli/images/a/a5/Grave_of_the_Fireflies_Japanese_poster.jpg/",
    myneighbortotoro: "https://vignette.wikia.nocookie.net/studio-ghibli/images/d/db/My_Neighbor_Totoro.jpg/",
    onlyyesterday: "https://vignette.wikia.nocookie.net/studio-ghibli/images/a/a9/Only_Yesterday.jpg/",
    porcorosso: "https://vignette.wikia.nocookie.net/studio-ghibli/images/4/41/Porco_Rosso.jpg/",
    pompoko: "https://vignette.wikia.nocookie.net/studio-ghibli/images/9/9e/Pom_Poko.jpg/",
    whisperoftheheart: "https://vignette.wikia.nocookie.net/studio-ghibli/images/7/7b/Whisper_of_the_Heart.jpg/",
    princessmononoke: "https://vignette.wikia.nocookie.net/studio-ghibli/images/c/c6/Princess_Mononoke.jpg/",
    myneighborstheyamadas: "https://vignette.wikia.nocookie.net/studio-ghibli/images/d/db/My_Neighbors_the_Yamadas.jpg/",
    spiritedaway: "https://vignette.wikia.nocookie.net/studio-ghibli/images/9/9e/Spirited_Away.png",
    thecatreturns: "https://vignette.wikia.nocookie.net/studio-ghibli/images/8/87/The_Cat_Returns.jpg",
    howlsmovingcastle: "https://vignette.wikia.nocookie.net/studio-ghibli/images/0/08/Howl's_Moving_Castle.jpg/",
    talesfromearthsea: "https://vignette.wikia.nocookie.net/studio-ghibli/images/0/09/%C3%96v%C3%A4rlden.jpg/",
    ponyo: "https://i.pinimg.com/originals/61/d9/cb/61d9cbbfbe1531c6acafedb168a7b384.jpg",
    arrietty: "https://www.mauvais-genres.com/21854/the-secret-world-of-arrietty-movie-poster-15x21-in-2010-studio-ghibli-hayao-miyazaki.jpg",
    fromuponpoppyhill: "https://vignette.wikia.nocookie.net/studio-ghibli/images/d/dd/From_Up_On_Poppy_Hill.jpg/",
    thewindrises: "https://vignette.wikia.nocookie.net/studio-ghibli/images/2/2d/The_Wind_Rises.jpg/",
    thetaleoftheprincesskaguya: "https://vignette.wikia.nocookie.net/studio-ghibli/images/8/87/The_Tale_of_the_Princess_Kaguya.jpg/",
    whenmarniewasthere: "https://vignette.wikia.nocookie.net/studio-ghibli/images/7/7a/When_Marnie_Was_There.jpg",
}

//Events
catalog.addEventListener('click', display);
//lists buttons
watchedListButton.addEventListener('click', watchedList);
toWatchButton.addEventListener('click', toWatch);
watchListButton.addEventListener('click', watchList);
//image buttons
watchedButton.addEventListener('click', watchedToggle);
inWatchListButton.addEventListener('click', inWatchListToggle);



$('#ghibliCarousel').on('slide.bs.carousel', function (target) {
    currentMovie = target.to;
    updateButtons(currentMovie);
}) //Specific to carousel from bootstrap. Returns index.

//Local Storage Processing
storedData = JSON.parse(myStorage.getItem('ghibli'));
if (storedData) {
    display(storedData);
} else {
    fetch(ghibliUrl)
        .then(res => res.json())
        .then(json => processData(json))
}

function processData(data) {
    for (let movie of data) {
        movie.watched = false;
        movie.inWatchList = false;
    }
    storedData = data;
    myStorage.setItem('ghibli', JSON.stringify(data));
    display(data);
}


//Display to specific screen size
function display(ghibli) {
    if (window.innerWidth < 786) {
        displayMobile(ghibli);
    }

}

//Display to Mobile
function displayMobile(ghibli) {
    updateButtons(currentMovie);
    for (let i = 0; i < ghibli.length; i++) {
        let img = document.createElement('img');
        img.setAttribute('class', 'd-block w-100');
        let picMovieTitle = document.createElement('h3');
        picMovieTitle.setAttribute('class', 'text-white bg-dark rounded p-2 opacity-4');
        let movieTitle = ghibli[i].title;
        img.alt = movieTitle;
        picMovieTitle.innerHTML = movieTitle;
        movieTitle = reformatTitle(movieTitle);
        img.src = getImage(movieTitle);
        if (i === 0) {
            document.querySelector('.carousel-item.active').appendChild(img);
            document.querySelector('.carousel-caption').appendChild(picMovieTitle);
        } else {
            let carouselItem = document.createElement('div');
            carouselItem.setAttribute('class', 'carousel-item');
            let carouselCaption = document.createElement('div');
            carouselCaption.setAttribute('class', 'carousel-caption');
            carouselCaption.appendChild(picMovieTitle);
            carouselItem.appendChild(img);
            carouselItem.appendChild(carouselCaption);
            carousel.appendChild(carouselItem);
        }
    }
}



//creates a Bootstrap list group with movie property watched = true.
function watchedList(e) {
    clearLists();
    toggleCarousel(displayCarousel);
    let list = document.createElement('div');
    list.setAttribute('class', 'list-group w-100');
    for(let movie of storedData) {
        if(movie.watched) {
        let listElement = document.createElement('a');
        listElement.setAttribute('class', 'list-group-item list-group-item-action');
        listElement.innerHTML = movie.title;
        list.appendChild(listElement);
        }
    }
    lists.appendChild(list);
    lists.style.display = "flex";
}

//creates a Bootstrap list group with movie property watched = false.
function toWatch(e) {
    clearLists();
    toggleCarousel(displayCarousel);
    let list = document.createElement('div');
    list.setAttribute('class', 'list-group w-100');
    for(let movie of storedData) {
        if(!movie.watched) {
        let listElement = document.createElement('a');
        listElement.setAttribute('class', 'list-group-item list-group-item-action');
        listElement.innerHTML = movie.title;
        list.appendChild(listElement);
        }
    }
    lists.appendChild(list);
    lists.style.display = "flex";
}
// creates a Bootstrap list group with movie property inWatchList = true.
function watchList(e) {
    clearLists();
    toggleCarousel(displayCarousel);
    let list = document.createElement('div');
    list.setAttribute('class', 'list-group w-100');
    for(let movie of storedData) {
        if(movie.inWatchList) {
        let listElement = document.createElement('a');
        listElement.setAttribute('class', 'list-group-item list-group-item-action');
        listElement.innerHTML = movie.title;
        list.appendChild(listElement);
        }
    }
    lists.appendChild(list);
    lists.style.display = "flex";
}

//Matches the movie title with picture url in pictures object
function getImage(movie) {
    for (pic in pictures) {
        if (movie === pic) {
            return pictures[pic];
        }
    }
}

//Processes the title from the API and format it to be lower case and no special characters
function reformatTitle(movieTitle) {
    let title = movieTitle.split(" ").join("");
    title = title.toLowerCase();
    title = title.replace("'", "");
    return title;
}

//Toggles display of Carousel
function toggleCarousel(shouldDisplay) {
    if(shouldDisplay) {
        carouselContainer.style.display = "none";
    } else {
        carouselContainer.style.display = "inline";
    }
}

function clearLists(){
    if(lists.firstChild) {
        lists.removeChild(lists.firstChild);
    }
}

//Makes sure the buttons display the correct toggles
function updateButtons(movie) {
    if(!storedData[currentMovie].watched) {
        watchedButton.style.backgroundColor = "#7b4b94";
        watchedButton.innerHTML = '<i class="far fa-eye"></i>';
    } else {
        watchedButton.style.backgroundColor = "#7d82b8";
        watchedButton.innerHTML = '<i class="far fa-eye-slash"></i>';
    }

    if(!storedData[currentMovie].inWatchList) {
        inWatchListButton.style.backgroundColor = "#D6F7A3";
        inWatchListButton.innerHTML = '<i class="fas fa-plus"></i>';
    } else {
        inWatchListButton.style.backgroundColor = "#bd2f55";
        inWatchListButton.innerHTML = '<i class="fas fa-minus"></i>';
    }
}

//Sets current object watched boolean. Toggles button.
function watchedToggle(e) {
    if(storedData[currentMovie].watched) {
        watchedButton.style.backgroundColor = "#7b4b94";
        storedData[currentMovie].watched = false;
        watchedButton.innerHTML = '<i class="far fa-eye"></i>';
        myStorage.setItem('ghibli', JSON.stringify(storedData));
    } else {
        watchedButton.style.backgroundColor = "#7d82b8";
        storedData[currentMovie].watched = true;
        watchedButton.innerHTML = '<i class="far fa-eye-slash"></i>';
        myStorage.setItem('ghibli', JSON.stringify(storedData));
    }
}

//Sets current object in watch list boolean. Toggles button.
function inWatchListToggle(e) {
    if(storedData[currentMovie].inWatchList) {
        inWatchListButton.style.backgroundColor = "#D6F7A3";
        storedData[currentMovie].inWatchList = false;
        inWatchListButton.innerHTML = '<i class="fas fa-plus"></i>';
        myStorage.setItem('ghibli', JSON.stringify(storedData));
    } else {
        inWatchListButton.style.backgroundColor = "#bd2f55";
        storedData[currentMovie].inWatchList = true;
        inWatchListButton.innerHTML = '<i class="fas fa-minus"></i>';
        myStorage.setItem('ghibli', JSON.stringify(storedData));
    }
}