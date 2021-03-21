var indexJS = {};
var db = firebase.firestore();
var movies = [];
var arr = [1,2,3,4,5];


(function(){
    function index(category) {
        this.get(category)
        setTimeout(() => {
            this.handlePreloader();
        }, 5000)
    }

    async function getMovies(category) {
        return db.collection("movies").get().then(async (querySnapshot) => {
            movies = []
            await querySnapshot.forEach(async (snap) => {
                await firebase.firestore().collection('movies').doc(snap.id).onSnapshot(async (details) => {
                  movies.push({
                    id: details.id,
                    details: details.data()
                  });
                });
            })
            setTimeout(async () => {
                if(movies.length < 10) {
                    // var page = window.location.pathname.split('/')[2].split('.')[0];
                    // if(page == '' || page == 'index' || page == 'all'){
                        this.get()    
                    // }
                } else {    
                    this.handlePreloader();
                }
                let sortArr = new Promise(async (resolve, reject) => {
                    await movies.sort((a, b) => {
                        let nameA = a.details.added.toUpperCase(); // ignore upper and lowercase
                        let nameB = b.details.added.toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                          return 1;
                        }
                        if (nameA > nameB) {
                          return -1;
                        }
                        // names must be equal
                        return 0;
                    });
                    resolve(movies);
                });
                // this.handle();
                sortArr.then(
                    async (value) => {
                        var path = window.location.pathname + "";
                        if(path.split('/')[1].split('.')[0] == 'search'){
                            await categories(category);
                        } else {
                            await this.displayBanner();
                            await this.rated();
                            await this.recent();
                            await this.drama();
                            await this.comedy();
                            await this.romance();
                            await this.recommended();
                            await this.popular();
                        }
                    },
                    (error) => { /* code if some error */ }
                );
            }, 1000)
        }).catch((err) => {console.log(err)});
    }
    
    function rated() {
        var y = 0;
        movies.forEach((movie) => {
            if(getRate(movie.details.votes, movie.details.views)> 2 && y < 20){
                y++;
                this.display('rated', movie)  
            }
        });
    }
    
    function popular() {
        var x = 0
        var pop = movies;
        pop.sort((a, b) => {
            let nameA = a.details.views;
            let nameB = b.details.views;
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            // names must be equal
            return 0;
        });
        pop.forEach((movie) => {
            if(x < 20) {
                x++;
                this.display('popular', movie) 
            }
        });
    }
    
    function recent() {
        var x = 0;
        movies.forEach((movie) => {
            if(x < 20){
                x++;
                this.display('recent', movie) 
            }
        });
    
    }

    function drama() {
        var x = 0;
        movies.forEach((movie) => {
            if(movie.details.genre.includes("drama") && x < 20) {
                x++;
                this.display('drama', movie) }
        });
    }
    
    function comedy() {
        var x = 0;
        movies.forEach((movie, index) => {
            if(movie.details.genre.includes("comedy") && x < 20) {
                x++;
                this.display('comedy', movie) 
            }
        });
    }
    
    function romance() {
        var x = 0;
        movies.forEach((movie, index) => {
            if(movie.details.genre.includes("romance") && x < 20) {
                x++
                this.display('romance', movie) 
            }
        });
    }
    
    function getRate(votes, views) {
        let rating = (votes/views) * 5;
        if (rating >= 5 ) {
        return 5;
        } else {
            return rating.toFixed(1)
        }
    }

    function open(id) {
        var url = 'https://mynollyapp.com/single';
        var form = $('<form action="' + url + '" method="post">' +
        '<input type="hidden" name="rwe" value="' + id + '" />' +
        '</form>');
        $('body').append(form);
        form.submit();
    }

    function openCat(category) {
        console.log(category)
    }
    
    function getArr(arr) {
        return arr.join(', ')
    }

    async function categories(id) {
        console.log(id)
        if(id == 'all' || id == '') {
            movies.forEach((movie) => {
                displaySearch('category', movie)
            });
            handlePreloader()
        }
        console.log(movies)

    }

    
    async function details(id) {
        this.get()
        await db.collection("movies").doc(id).get().then(function(doc) {
            var data = doc.data();
            jQuery(function($) {
                $('#details')
                .append(`<div class="banner-wrap justify-content-between align-items-center">
                <div class="left-wrap">
                    <span class="rnd">${titleCase(data.from)}</span>
                    <h2>${data.title}</h2>
                    <span class="tag blk">${titleCase(data.genre.join(' '))}</span>
                    <span class="tag">${data.year}</span>
                    <span class="tag"><b>HD</b></span>
                    <span class="tag blk" style="margin-top: .2rem"><a href="#" class="btn btn-lg"><img src="images/play.png" alt="icn">Watch now</a></span>
    
                </div>
                <div class="right-wrap" style="background-image: url(${data.img});"></div>
            </div>
            
            <div>
                `) 
            $('#rowDet')
            .append(`
                    <div class="col-12 mt-4">
                                            <style>
                            @media(min-width: 578px){
                                .ntt {
                                    display: none !important;
                                }
                            }
                        </style>
                    <span class="tag blk ntt"><a style="background: #e53637; color: #fff; margin: auto; display: block;margin-bottom: 2rem;" href="${data.link}" target="_blank" class="btn btn-lg"><img src="images/play.png" alt="icn">Watch now</a></span>
                        <h2 style="text-align: center; text-transform: uppercase;
                        font-weight: 700; margin-bottom: 1rem,
                        line-height: 1.1;">${data.title}</h2></div>
                    </div>
                    <div class="col-sm-6" style="margin-bottom: 1rem">
                        <h4><span>Synopsis:</span> <br><span>${data.description}</span></h4>
                        <h4><span>Genre:</span> <span>${titleCase(data.genre.join(' '))}</span></h4>
                    </div>
                    <div class="col-sm-6 mb-4">
                        <h4><span>Cast:</span> <span>${getArr(data.cast)}</span></h4>
                        <h4><span>Producers:</span> <span>${getArr(data.producers)}</span></h4>
                        <h4><span>Year:</span> <span>${data.year}</span></h4>
                    </div>
            <iframe style="padding: 20px" width="100%" height="500" src="https://www.youtube.com/embed/${data.trailer}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `)
            
            movies.forEach((item, index) => {
               if(index < 15 ) {display('detCat', item)}
            })
            }); 
            
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        this.handlePreloader()

    }

    function titleCase(string) {
        var sentence = string.toLowerCase().split(" ");
        for(var i = 0; i< sentence.length; i++){
           sentence[i] = ' ' + sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
     return sentence;
    }

    function handlePreloader() {
        $(document).ready(function() {
            if ($('.preloader').length > 0) {
                $('.preloader').delay(200).fadeOut(500);
            }
        });
    }

    function display(category, movie) {
        return  jQuery(function($) {
            $('#'+ category +'.owl-carousel')
            .trigger('add.owl.carousel', 
            [`<div class="owl-items main" onclick="indexJS.open('${movie.id}')">
            <a class="slide-one">
                <div class="slide-image"><img src="${movie.details.img}" alt="image"></div>
                <span class="tag rating">${getRate(movie.details.votes, movie.details.views)}</span>
                <div class="slide-content">
                    <h2>
                        ${movie.details.title}
                    </h2>
                    <p class="movieDes">${movie.details.description}</p>
                    <span class="tag">${getRate(movie.details.votes, movie.details.views)}</span>
                    <span class="tag">${movie.details.year}</span>
                    <span class="tag"><b>HD </b></span>
                    <span class="tag"><b>${titleCase(movie.details.from)}</b></span>
                </div>
            </a>
        </div>`])
        .trigger('refresh.owl.carousel');
        });
    }

    function displaySearch(category, movie) {
        return  jQuery(function($) {
            var x = `
            <div class="col-md-4 col-lg-3 mb-3">
                <a class="slide-one" href="season.html">
                    <div class="slide-image"><img src="${movie.details.img}" alt="image"></div>
                    <div class="slide-content">
                        <h2>${movie.details.title} <img src="images/plus.png" alt="icon"></h2>
                        <p class="movieDes">${movie.details.description}</p>
                        <span class="tag">2 h 20 min</span>
                        <span class="tag">2020</span>
                        <span class="tag"><b>HD</b></span>
                        <span class="tag"><b>${movie.details.from}</b></span>
                    </div>
                </a>
            </div>
            `
            $('#'+ category).append(x)
            
        });
    }

    function recommended() {
        movies.forEach((movie, index) => {
            if((index%2) == 1){
                jQuery(function($) {
                    $('#recommended.owl-carousel')
                    .trigger('add.owl.carousel', 
                    [`<div class="owl-items">
                    <a class="slide-one slide-two" href="#">
                        <div class="slide-image" style="background-image: url(${movie.details.img});"></div>
                        <div class="slide-content">
                            <h2>${movie.details.title}</h2>
                            <span class="tag rating">${getRate(movie.details.votes, movie.details.views)}</span>
                            <span class="tag">${movie.details.year}</span>
                            <span class="tag"><b>HD</b></span>
                            <span class="tag"><b>${titleCase(movie.details.from)}</b></span>
                        </div>
                    </a>
                </div>`])
                .trigger('refresh.owl.carousel');
                });
            }
        })
    }
    
    function displayBanner() {
        var x = 0;
        movies.forEach((movie) => {
            x++
            if(x <= 4){
                jQuery(function($) {
                    $('#banner.owl-carousel')
                    .trigger('add.owl.carousel', 
                    [`
                    <div class="owl-items">
                    <div class="banner-wrap justify-content-between align-items-center">
                        <div class="left-wrap">
                            <span class="rnd">${titleCase(movie.details.from)}</span>
                            <h2>${movie.details.title}</h2>
                            <span class="tag"><b>${movie.details.year}</b></span>
                            <span class="tag">${titleCase(movie.details.genre.join(' '))}</span>
                            <p>${movie.details.description.substring(0,150)}<span>${movie.details.description.length > 150 ? '...' : ''}</span></p>
                            <a onclick="indexJS.open('${movie.id}')" class="btn btn-lg"><img src="images/play.png" alt="icn">Watch now</a>
                        </div>
                        <div class="right-wrap" style="background-image: url(${movie.details.img});"></div>
                    </div>
                </div>`])
                .trigger('refresh.owl.carousel');
                });      
            }
        })
    }

    indexJS.index = index; 
    indexJS.get = getMovies; 
    indexJS.recent = recent;
    indexJS.rated = rated; 
    indexJS.popular = popular; 
    indexJS.recommended = recommended; 
    indexJS.drama = drama; 
    indexJS.comedy = comedy; 
    indexJS.romance = romance; 
    indexJS.open = open;   
    indexJS.openCat = openCat;   
    indexJS.details = details;
    indexJS.categories = categories;   
    indexJS.handlePreloader = handlePreloader;   
    indexJS.titleCase = titleCase;
    indexJS.display = display;
    indexJS.displaySearch = displaySearch;
    indexJS.displayBanner = displayBanner;
})()
