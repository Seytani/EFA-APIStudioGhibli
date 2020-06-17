const ghibliUrl = 'https://ghibliapi.herokuapp.com/films/';
//const imdbUrl = '';
// const imdbKey = 'k_YZc7a910';

fetch(ghibliUrl)
    .then(res => res.json())
    .then(json => display(json))

let grid = document.querySelector('#grid');
let carousel = document.querySelector('.carousel-inner');

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
    thecatretrurns: "https://vignette.wikia.nocookie.net/studio-ghibli/images/8/87/The_Cat_Returns.jpg",
    howlsmovingcastle: "https://vignette.wikia.nocookie.net/studio-ghibli/images/0/08/Howl's_Moving_Castle.jpg/",
    talesfromearthsea: "https://vignette.wikia.nocookie.net/studio-ghibli/images/0/09/%C3%96v%C3%A4rlden.jpg/",
    ponyo: "https://i.pinimg.com/originals/61/d9/cb/61d9cbbfbe1531c6acafedb168a7b384.jpg",
    arrietty: "https://www.mauvais-genres.com/21854/the-secret-world-of-arrietty-movie-poster-15x21-in-2010-studio-ghibli-hayao-miyazaki.jpg",
    fromuponpoppyhill: "https://www.mauvais-genres.com/21854/the-secret-world-of-arrietty-movie-poster-15x21-in-2010-studio-ghibli-hayao-miyazaki.jpg",
    thewindrises: "https://vignette.wikia.nocookie.net/studio-ghibli/images/2/2d/The_Wind_Rises.jpg/",
    thetaleoftheprincesskaguya: "https://vignette.wikia.nocookie.net/studio-ghibli/images/8/87/The_Tale_of_the_Princess_Kaguya.jpg/",
    whenmarniewasthere: "https://vignette.wikia.nocookie.net/studio-ghibli/images/7/7a/When_Marnie_Was_There.jpg",
}

function display(ghibli) {
    let img = document.createElement('img');
    let picMovieTitle = document.createElement('h5');
    for (let movie in ghibli) {
        let movieTitle = ghibli[movie].title;
        img.alt = movieTitle;
        picMovieTitle.innerHTML = movieTitle;
        movieTitle = reformatTitle(movieTitle);
        img.src = getImage(movieTitle);
        if (movie === 0) {
            document.querySelector('.carousel-item active').appendChild(img);
            document.querySelector('carousel-caption d-none d-md-block').appendChild(picMovieTitle);
        } else {
            let carouselItem = document.createElement('div');
            carouselItem.setAttribute('class', 'carousel-item');
            let carouselCaption = document.createElement('div');
            carouselCaption.setAttribute('class', 'carousel-caption d-none d-md-block');
            carouselItem.appendChild(img);
            carouselCaption.appendChild(picMovieTitle);
            carouselItem.appendChild(carouselCaption);
            carousel.appendChild(carouselItem);
        }
    }
    $('.carousel').carousel();
    console.log($);
}

function getImage(movie) {
    for (pic in pictures) {
        if (movie === pic) {
            return pictures[pic];
        }
    }
}


// console.log('JS is working Jess');
// for(pic in pictures) {
//     let img = document.createElement('img');
//     img.src = pictures[pic];
//     console.log(pictures[pic]);
//     grid.appendChild(img);
// }

function reformatTitle(movieTitle) {
    let title = movieTitle.split(" ").join("");
    title = title.toLowerCase();
    return title;
}

// let ex = 'My Neighbor Totoro';
// let reformatted = reformatTitle(ex);
// console.log(reformatted);