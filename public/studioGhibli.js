//Variables
const ghibliUrl = 'https://ghibliapi.herokuapp.com/films/';
const imdbUrl = 'https://imdb-api.com/en/API/';
const imdbKey = 'k_PK104sOs';
const myStorage = window.localStorage;
let storedData;
let displayCarousel = true;
let displayGrid = true;
let currentDisplay = '';
let currentMovie = 0;

//DOM
let grid = document.querySelector('#grid');
let lists = document.querySelector('#lists');
let carouselContainer = document.querySelector('#ghibliCarousel');
let carousel = document.querySelector('.carousel-inner');
let catalog = document.querySelector('#catalog');
let modal = document.querySelector('.modal-body');
//rounded buttons
let watchedButton = document.querySelector('.watched-button');
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

//Movie ids (for use with IMDB)
let imdbId = {
    kikisdeliveryservice: "tt0097814",
    castleinthesky: "tt0092067",
    graveofthefireflies: "tt0095327",
    myneighbortotoro: "tt0347618",
    onlyyesterday: "tt0102587",
    porcorosso: "tt0104652",
    pompoko: "tt0110008",
    whisperoftheheart: "tt0113824",
    princessmononoke: "tt0119698",
    myneighborstheyamadas: "tt0206013",
    spiritedaway: "tt0245429",
    thecatreturns: "tt0347618",
    howlsmovingcastle: "tt0347149",
    talesfromearthsea: "tt0495596",
    ponyo: "tt0876563",
    arrietty: "tt1568921",
    fromuponpoppyhill: "tt1798188",
    thewindrises: "tt2013293",
    thetaleoftheprincesskaguya: "tt2576852",
    whenmarniewasthere: "tt3398268",
}

/*** Events ***/

catalog.addEventListener('click', display);
//lists buttons
watchedListButton.addEventListener('click', watchedList);
toWatchButton.addEventListener('click', toWatch);
watchListButton.addEventListener('click', watchList);
//image buttons
watchedButton.addEventListener('click', watchedToggle);
inWatchListButton.addEventListener('click', inWatchListToggle);

//Events fired by bootstrap
$('#ghibliCarousel').on('slide.bs.carousel', function (target) { //carousel
    currentMovie = target.to; 
    updateButtons(currentMovie);
}) 
$('#ghibliModal').on('shown.bs.modal', function () { //modal
    if (window.innerWidth < 786) {
        displayModal();
    }
})

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
        movie.imdbId = getImdbId(movie);
    }
    storedData = data;
    myStorage.setItem('ghibli', JSON.stringify(data));
    display(data);
}


//Display to specific screen size on window load
function display(ghibli) {
    if (window.innerWidth < 786) {
        displayMobile(ghibli);
    } else {
        displayBig(ghibli);
    }

}

/**** Desktop stuff ****/

//Display bigger screens
function displayBig(ghibli) {
    generateGrid(storedData);
}
//generates the grid and call generateGridElement to append element
function generateGrid(movies) {
    for (let r = 0; r <= 4; r++) {
        let row = document.createElement('div');
        row.setAttribute('class', 'row justify-content-md-center align-items-center');
        for (let i = 1, c = r * 5; i <= 5; i++, c++) {
            if (c === 20) {
                break;
            }
            let column = document.createElement('div');
            column.setAttribute('class', 'col-md-4 col-lg-2');
            column.appendChild(generateGridElement(movies[c], c));
            row.appendChild(column);
            if (i === 4) {
                grid.appendChild(row);
            }
        }
    }
}
//generates the content for each grid element
function generateGridElement(movie, index) {
    let container = document.createElement('div');
    container.setAttribute('id', 'grid-element');
    let titleDiv = document.createElement('div');
    titleDiv.setAttribute('class', 'text-center');
    let title = document.createElement('p');
    let movieElements = document.createElement('div');
    movieElements.setAttribute('class', 'd-flex flex-column align-items-center');
    let img = document.createElement('img');
    img.setAttribute('class', 'w-100')
    
    title.innerHTML = movie.title;
    img.src = getImage(reformatTitle(movie.title));

    titleDiv.appendChild(title);
    container.appendChild(titleDiv);
    movieElements.appendChild(img);
    movieElements.appendChild(generateButtons(index));
    container.appendChild(movieElements);
    return container;
}

//generates control buttons depending on screen size
function generateButtons(index) {
    let buttons = document.createElement('div');
    buttons.setAttribute('class', 'd-flex align-items-center');
    let watchedButton = document.createElement('button');
    let addToWatchlistButton = document.createElement('button');
    let infoButton = document.createElement('button');
    
    if(!storedData[index].watched) {
        watchedButton.innerHTML = '<i class="far fa-eye"></i>';
        watchedButton.style.backgroundColor = "#7b4b94";
    } else {
        watchedButton.innerHTML = '<i class="far fa-eye-slash"></i>';
        watchedButton.style.backgroundColor = "#7d82b8";
    }

    if (!storedData[index].inWatchList) {
        addToWatchlistButton.style.backgroundColor = "#D6F7A3";
        addToWatchlistButton.innerHTML = '<i class="fas fa-plus"></i>';
    } else {
        addToWatchlistButton.style.backgroundColor = "#bd2f55";
        addToWatchlistButton.innerHTML = '<i class="fas fa-minus"></i>';
    }

    infoButton.innerHTML = '<i class="fas fa-info"></i>';

    watchedButton.setAttribute('class', 'rounded-circle big-screen-button watched-button');
    watchedButton.setAttribute('data-index', index);
    addToWatchlistButton.setAttribute('class', 'rounded-circle big-screen-button addToWatchList-button');
    addToWatchlistButton.setAttribute('data-index', index);
    infoButton.setAttribute('class', 'rounded-circle big-screen-button info-button');
    infoButton.setAttribute('data-index', index);
    infoButton.setAttribute('data-toggle', 'modal');
    infoButton.setAttribute('data-target', '#ghibliModal');

    buttons.style.zIndex = '10';

    watchedButton.addEventListener('click', watchedToggle);
    addToWatchlistButton.addEventListener('click', inWatchListToggle);
    infoButton.addEventListener('click', displayModalDesktop);

    buttons.appendChild(watchedButton);
    buttons.appendChild(addToWatchlistButton);
    buttons.appendChild(infoButton);

    return buttons;
}

//add content to modal desktop
function displayModalDesktop(e) {
    if (modal.firstChild) {
        modal.removeChild(modal.firstChild);
    }

    let imageUrl = '';
    let trailerUrl = '';
    let container = document.createElement('div');
    let movieTitle = document.createElement('h3');
    let releaseDateHeader = document.createElement('h4');
    let directorHeader = document.createElement('h4');
    let ratingHeader = document.createElement('h4');
    let descriptionHeader = document.createElement('h4');
    let imagesHeader = document.createElement('h4');
    let trailerHeader = document.createElement('h4');
    let releaseDate = document.createElement('p');
    let director = document.createElement('p');
    let rating = document.createElement('p');
    let description = document.createElement('p');

    imageUrl = imdbUrl + "Images/" + imdbKey + "/" + storedData[e.currentTarget.dataset.index].imdbId + "/Short";
    trailerUrl = imdbUrl + "Trailer/" + imdbKey + "/" + storedData[e.currentTarget.dataset.index].imdbId;
    movieTitle.innerHTML = storedData[e.currentTarget.dataset.index].title;
    movieTitle.setAttribute('class', 'text-center');
    movieTitle.style.paddingBottom = '1em';
    releaseDateHeader.innerHTML = "Release Date";
    directorHeader.innerHTML = "Director";
    ratingHeader.innerHTML = "Rating";
    descriptionHeader.innerHTML = "Description";
    imagesHeader.innerHTML = "Additional Images";
    trailerHeader.innerHTML = "Trailer";
    releaseDate.innerHTML = storedData[e.currentTarget.dataset.index].release_date;
    director.innerHTML = storedData[e.currentTarget.dataset.index].director;
    rating.innerHTML = storedData[e.currentTarget.dataset.index].rt_score;
    description.innerHTML = storedData[e.currentTarget.dataset.index].description;

    fetchStuff(imageUrl, trailerUrl);

    async function fetchStuff(imagesUrl, trailerUrl) {
        let spinner = document.createElement('div');
        spinner.setAttribute('class', 'spinner-border text-danger');
        spinner.setAttribute('role', 'status');
        let spinnerSpan = document.createElement('span');
        spinnerSpan.setAttribute('class', 'sr-only');
        spinnerSpan.setAttribute('role', 'status');
        spinner.appendChild(spinnerSpan);
        modal.appendChild(spinner);
        let resImg = await fetch(imageUrl);
        let resTrailer = await fetch(trailerUrl);
        let jsonImg = await resImg.json();
        let jsonTrailer = await resTrailer.json();
        spinner.style.display = 'none';
        container.appendChild(movieTitle);
        container.appendChild(releaseDateHeader);
        container.appendChild(releaseDate);
        container.appendChild(directorHeader);
        container.appendChild(director);
        container.appendChild(ratingHeader);
        container.appendChild(rating);
        container.appendChild(descriptionHeader);
        container.appendChild(description);
        container.appendChild(imagesHeader);
        container.appendChild(createCarousel(jsonImg));
        container.appendChild(trailerHeader);
        container.appendChild(createVideo(jsonTrailer));
        modal.appendChild(container);
    }


}

//creates a Bootstrap list group with movie property watched = true.
function displayOtherList(toggle, e) {
    displayGrid = true;
    switch (toggle) {
        case 'watched':
            currentDisplay = toggle;
            watchedList(e);
            break;
        case 'to-watch':
            currentDisplay = toggle;
            toWatch(e);
            break;
        case 'watchlist':
            currentDisplay = toggle;
            watchList(e);
            break;
        default:
            break;
    }
}

/**** Mobile stuff ****/

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

//add content to modal mobile version
function displayModal() {
    if (modal.firstChild) {
        modal.removeChild(modal.firstChild);
    }

    let imageUrl = '';
    let trailerUrl = '';
    let container = document.createElement('div');
    let movieTitle = document.createElement('h3');
    let releaseDateHeader = document.createElement('h4');
    let directorHeader = document.createElement('h4');
    let ratingHeader = document.createElement('h4');
    let descriptionHeader = document.createElement('h4');
    let imagesHeader = document.createElement('h4');
    let trailerHeader = document.createElement('h4');
    let releaseDate = document.createElement('p');
    let director = document.createElement('p');
    let rating = document.createElement('p');
    let description = document.createElement('p');

    imageUrl = imdbUrl + "Images/" + imdbKey + "/" + storedData[currentMovie].imdbId + "/Short";
    trailerUrl = imdbUrl + "Trailer/" + imdbKey + "/" + storedData[currentMovie].imdbId;
    movieTitle.innerHTML = storedData[currentMovie].title;
    movieTitle.setAttribute('class', 'text-center');
    movieTitle.style.paddingBottom = '1em';
    releaseDateHeader.innerHTML = "Release Date";
    directorHeader.innerHTML = "Director";
    ratingHeader.innerHTML = "Rating";
    descriptionHeader.innerHTML = "Description";
    imagesHeader.innerHTML = "Additional Images";
    trailerHeader.innerHTML = "Trailer";
    releaseDate.innerHTML = storedData[currentMovie].release_date;
    director.innerHTML = storedData[currentMovie].director;
    rating.innerHTML = storedData[currentMovie].rt_score;
    description.innerHTML = storedData[currentMovie].description;

    fetchStuff(imageUrl, trailerUrl);

    async function fetchStuff(imagesUrl, trailerUrl) {
        let resImg = await fetch(imageUrl);
        let resTrailer = await fetch(trailerUrl);
        let jsonImg = await resImg.json();
        let jsonTrailer = await resTrailer.json();
        container.appendChild(movieTitle);
        container.appendChild(releaseDateHeader);
        container.appendChild(releaseDate);
        container.appendChild(directorHeader);
        container.appendChild(director);
        container.appendChild(ratingHeader);
        container.appendChild(rating);
        container.appendChild(descriptionHeader);
        container.appendChild(description);
        container.appendChild(imagesHeader);
        container.appendChild(createCarousel(jsonImg));
        container.appendChild(trailerHeader);
        container.appendChild(createVideo(jsonTrailer));
        modal.appendChild(container);
    }


}

//Makes sure the buttons in mobile display the correct toggles
function updateButtons(movie) {
    if (!storedData[currentMovie].watched) {
        watchedButton.style.backgroundColor = "#7b4b94";
        watchedButton.innerHTML = '<i class="far fa-eye"></i>';
    } else {
        watchedButton.style.backgroundColor = "#7d82b8";
        watchedButton.innerHTML = '<i class="far fa-eye-slash"></i>';
    }

    if (!storedData[currentMovie].inWatchList) {
        inWatchListButton.style.backgroundColor = "#D6F7A3";
        inWatchListButton.innerHTML = '<i class="fas fa-plus"></i>';
    } else {
        inWatchListButton.style.backgroundColor = "#bd2f55";
        inWatchListButton.innerHTML = '<i class="fas fa-minus"></i>';
    }
}

//Sets current object watched boolean. Toggles button.
function watchedToggle(e) {
    if (window.innerWidth < 786) {
        if (storedData[currentMovie].watched) {
            e.currentTarget.style.backgroundColor = "#7b4b94";
            storedData[currentMovie].watched = false;
            e.currentTarget.innerHTML = '<i class="far fa-eye"></i>';
            myStorage.setItem('ghibli', JSON.stringify(storedData));
        } else {
            e.currentTarget.style.backgroundColor = "#7d82b8";
            storedData[currentMovie].watched = true;
            e.currentTarget.innerHTML = '<i class="far fa-eye-slash"></i>';
            myStorage.setItem('ghibli', JSON.stringify(storedData));
        }
    } else {
        if (storedData[e.currentTarget.dataset.index].watched) {
            e.currentTarget.style.backgroundColor = "#7b4b94";
            storedData[e.currentTarget.dataset.index].watched = false;
            e.currentTarget.innerHTML = '<i class="far fa-eye"></i>';
            myStorage.setItem('ghibli', JSON.stringify(storedData));
        } else {
            e.currentTarget.style.backgroundColor = "#7d82b8";
            storedData[e.currentTarget.dataset.index].watched = true;
            e.currentTarget.innerHTML = '<i class="far fa-eye-slash"></i>';
            myStorage.setItem('ghibli', JSON.stringify(storedData));
        }
    }
}

//Sets current object in watch list boolean. Toggles button.
function inWatchListToggle(e) {
    if (window.innerWidth < 786) {
        if (storedData[currentMovie].inWatchList) {
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
    } else {
        if (storedData[e.currentTarget.dataset.index].inWatchList) {
            e.currentTarget.style.backgroundColor = "#D6F7A3";
            storedData[e.currentTarget.dataset.index].inWatchList = false;
            e.currentTarget.innerHTML = '<i class="fas fa-plus"></i>';
            myStorage.setItem('ghibli', JSON.stringify(storedData));
        } else {
            e.currentTarget.style.backgroundColor = "#bd2f55";
            storedData[e.currentTarget.dataset.index].inWatchList = true;
            e.currentTarget.innerHTML = '<i class="fas fa-minus"></i>';
            myStorage.setItem('ghibli', JSON.stringify(storedData));
        }
    }
}

/**** Main buttons for desktop/mobile ****/

//Creates a list with the movies that are watched = true, toggles the button to show and hide the list.
function watchedList(e) {
    let toggle = e.currentTarget.id;
    if (currentDisplay.length > 0 && currentDisplay !== toggle) {
        displayOtherList(toggle, e)
        return;
    }
    currentDisplay = toggle;
    clearLists();
    let list = document.createElement('div');
    list.setAttribute('class', 'list-group w-100');
    for (let movie of storedData) {
        if (movie.watched) {
            let listElement = document.createElement('a');
            listElement.setAttribute('class', 'list-group-item list-group-item-action');
            listElement.innerHTML = movie.title;
            list.appendChild(listElement);
        }
    }
    lists.appendChild(list);
    lists.style.display = "flex";
    if (document.innerWidth < 786) {
        toggleCarousel(displayCarousel);
    } else {
        toggleGrid(e.currentTarget);
    }
}

//creates a Bootstrap list group with movie property watched = false. Toggles the list.
function toWatch(e) {
    let toggle = e.currentTarget.id;
    if (currentDisplay.length > 0 && currentDisplay !== toggle) {
        displayOtherList(toggle, e)
        return;
    }
    currentDisplay = toggle;
    clearLists();
    let list = document.createElement('div');
    list.setAttribute('class', 'list-group w-100');
    for (let movie of storedData) {
        if (!movie.watched) {
            let listElement = document.createElement('a');
            listElement.setAttribute('class', 'list-group-item list-group-item-action');
            listElement.innerHTML = movie.title;
            list.appendChild(listElement);
        }
    }
    lists.appendChild(list);
    lists.style.display = "flex";
    if (document.innerWidth < 786) {
        toggleCarousel(displayCarousel);
    } else {
        toggleGrid(e.currentTarget);
    }
}

// creates a Bootstrap list group with movie property inWatchList = true.
function watchList(e) {
    let toggle = e.currentTarget.id;
    if (currentDisplay.length > 0 && currentDisplay !== toggle) {
        displayOtherList(toggle, e)
        return;
    }
    currentDisplay = toggle;
    clearLists();
    let list = document.createElement('div');
    list.setAttribute('class', 'list-group w-100');
    for (let movie of storedData) {
        if (movie.inWatchList) {
            let listElement = document.createElement('a');
            listElement.setAttribute('class', 'list-group-item list-group-item-action');
            listElement.innerHTML = movie.title;
            list.appendChild(listElement);
        }
    }
    lists.appendChild(list);
    lists.style.display = "flex";
    if (document.innerWidth < 786) {
        toggleCarousel(displayCarousel);
    } else {
        toggleGrid(e.currentTarget);
    }
}

/*** Utilities ***/

//toggles grid visibility
function toggleGrid(target) {
    if (displayGrid) {
        grid.style.display = 'none';
        displayGrid = false;
    } else {
        grid.style.display = 'block';
        displayGrid = true;
        currentDisplay = '';
        clearLists();
    }
}

//Matches the movie title with picture url in pictures object
function getImage(movie) {
    for (let pic in pictures) {
        if (pic === movie) {
            return pictures[pic];
        }
    }
}

//get IMDB id to use with api
function getImdbId(movie) {
    let id = reformatTitle(movie.title);
    for (let i in imdbId) {
        if (i === id) {
            return imdbId[i];
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

//creates a bootstrap carousel with data given
function createCarousel(result) {
    let images = result.items;
    let carousel = document.createElement('div');
    carousel.setAttribute('id', 'imgCarousel');
    carousel.setAttribute('class', 'carousel slide');
    carousel.setAttribute('data-ride', 'carousel');
    let carouselInner = document.createElement('div');
    carouselInner.setAttribute('class', 'carousel-inner');

    for (let i = 0; i < 5; i++) {
        if (i === 0) {
            let carouselActive = document.createElement('div');
            carouselActive.setAttribute('class', 'carousel-item active');
            let item = document.createElement('img');
            item.setAttribute('class', 'd-block w-100');
            item.src = images[i].image;
            item.alt = images[i].title;
            carouselActive.appendChild(item);
            carouselInner.appendChild(carouselActive);
        } else {
            let carouselItem = document.createElement('div');
            carouselItem.setAttribute('class', 'carousel-item');
            let item = document.createElement('img');
            item.setAttribute('class', 'd-block w-100');
            item.src = images[i].image;
            item.alt = images[i].title;
            carouselItem.appendChild(item);
            carouselInner.appendChild(carouselItem);
        }
    }

    let prevImg = document.createElement('a');
    prevImg.setAttribute('class', 'carousel-control-prev');
    prevImg.setAttribute('href', '#imgCarousel');
    prevImg.setAttribute('role', 'button');
    prevImg.setAttribute('data-slide', 'prev');
    let spanPrev1 = document.createElement('span');
    spanPrev1.setAttribute('class', 'carousel-control-prev-icon');
    spanPrev1.setAttribute('aria-hidden', 'true');
    let spanPrev2 = document.createElement('span');
    spanPrev2.setAttribute('class', 'sr-only');
    spanPrev2.innerHTML = "Previous";
    prevImg.appendChild(spanPrev1);
    prevImg.appendChild(spanPrev2);

    let nextImg = document.createElement('a');
    nextImg.setAttribute('class', 'carousel-control-next');
    nextImg.setAttribute('href', '#imgCarousel');
    nextImg.setAttribute('role', 'button');
    nextImg.setAttribute('data-slide', 'next');
    let spanNext1 = document.createElement('span');
    spanNext1.setAttribute('class', 'carousel-control-next-icon');
    spanNext1.setAttribute('aria-hidden', 'true');
    let spanNext2 = document.createElement('span');
    spanNext2.setAttribute('class', 'sr-only');
    spanNext2.innerHTML = "Next";
    nextImg.appendChild(spanNext1);
    nextImg.appendChild(spanNext2);

    carousel.appendChild(carouselInner);
    carousel.appendChild(prevImg);
    carousel.appendChild(nextImg);

    return carousel;
}

//creates an iframe with results from API, handkes error if there is no trailer.
function createVideo(result) {
    if (result.errorMessage.length > 0) {
        let errorMsg = document.createElement('div');
        errorMsg.setAttribute('class', 'alert alert-danger');
        errorMsg.innerHTML = 'Trailer not available';
        return errorMsg;
    }
    let video = document.createElement('iframe');
    video.setAttribute('class', 'embed-responsive-item embed-responsive-16by9 w-100');
    video.src = result.linkEmbed;
    return video;
}

//Toggles display of Carousel
function toggleCarousel(shouldDisplay) {
    if (shouldDisplay) {
        carouselContainer.style.display = "none";
    } else {
        carouselContainer.style.display = "inline";
    }
}

//removes the first child of a list emelent
function clearLists() {
    if (lists.firstChild) {
        lists.removeChild(lists.firstChild);
    }
}