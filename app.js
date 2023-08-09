const global = {
    apiKey: '3fd2be6f0c70a2a598f084ddfb75487c',
    apiUrl: 'https://api.themoviedb.org/3/',
    endpoint: 'movie/now_playing',
}

//Fetch Data Request

async function fetchData (){
    const response = await fetch(`${global.apiUrl}${global.endpoint}?api_key=${global.apiKey}`)
    const data = await response.json()
    return data
}

async function fetchDataForMovieDetails (endpoint){
    const response = await fetch(`${global.apiUrl}${endpoint}?api_key=${global.apiKey}`)
    const data = await response.json()
    return data
}

async function fetchDataForPagination (page){
    const response = await fetch(`${global.apiUrl}${global.endpoint}?api_key=${global.apiKey}&page=${page}`)
    const data = await response.json()
    return data
}

async function fetchSearchData (input, page){
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzODE3ZTMzNDlkNjE3ODU0MDNjYzIzZDk0YzIxZTZjZiIsInN1YiI6IjY0YTJiZmQ2MTEzODZjMDBhZGM3OTY2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5di7aI1FaxfQ9jqQmtxTYBjobHzTe0rOxJ3ezuUInjM'
        }
      };
      
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${input}&page=${page}`, options)
    const data = response.json()
    return data
    }        

async function requestData(){
    const movies = await fetchData()
    outputData(movies)
}  

//Output Movies on the first page

async function outputData(movies){
    const container = document.querySelector('.container')
    container.innerHTML = ''
    const mov = movies.results

    mov.forEach(async function (movie){

        const details = await fetchDataForMovieDetails(`movie/${movie.id}`)

        const div = document.createElement('div')
        div.classList.add('movie-wrap')
        div.innerHTML = `   
        ${  movie.poster_path ?
            `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="No Image"></img>`
            :
            `<img src="../img/no-image.jpg" </img>`
        }
        
        <div>
            <h4>${details.title}</h4>
            <div class="movie_descript">${details.genres[0].name},&nbsp${details.runtime} min</div>
        </div>
        `

        div.addEventListener('click', () => {
            movie_details(movie.id)
        }) 

        container.appendChild(div)        

    });

    pagination(movies)
}
//Output Movies on the following pagess (when pagination is done)

function outputDataAfterPagination(movies){
    const container = document.querySelector('.container')
    container.innerHTML = ''
    const mov = movies.results

    mov.forEach(async function (movie){

        const details = await fetchDataForMovieDetails(`movie/${movie.id}`)
        
        const div = document.createElement('div')
        div.classList.add('movie-wrap')
        div.innerHTML = `   
        ${  movie.poster_path ?
            `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="No Image"></img>`
            :
            `<img src="../img/no-image.jpg" </img>`
        }
        
        <div>
            <h4>${details.title}</h4>
            <div class="movie_descript">${details.genres[0].name},&nbsp${details.runtime} min</div>
        </div>
        
        `
        container.appendChild(div)
        div.addEventListener('click', () => {
            movie_details(movie.id)
        })
    });

}

// Output Movie Details

async function movie_details(id){
    const details = await fetchDataForMovieDetails(`movie/${id}`)
    console.log(details)
    const div = document.createElement('div')
    div.classList.add('details')
    div.classList.add('show')
    div.innerHTML = `
            ${
            details.poster_path ? 
            `<img class="movie_image" src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="${details.name}"></img>`
                :
            `<img class="movie_image" src="../img/no-image.jpg"></img>`
            }
            <img class="backdrop_image" src="https://image.tmdb.org/t/p/original/${details.backdrop_path}" alt="${details.name}"></img>
            <div class="details_content">
                <h1>${details.title}</h1>
                <p>${details.overview}</p>
                <p>${details.original_language = "en" ? "English": details.original_language}</p>
                <p>${details.genres.map((genre) => `<li>${genre.name}</li>`).join('')}</p>
                <p>Release Date: ${details.release_date}</p>
                <p>${details.vote_average.toFixed(1)} / 10</p>
            </div>    
            <div class="backdrop"></div
    `
    document.body.appendChild(div)
    div.querySelector('.backdrop').addEventListener('click', () => {
        div.classList.remove('show')
    })
}

//Pagination

async function pagination (movies){
    
    let current_page = movies.page
    let total_pages = movies.total_pages

    document.querySelector('.first_page').textContent=`${movies.page}`
    document.querySelector('.last_page').textContent=`${movies.total_pages}`

    if(current_page === 1){
        document.querySelector('.prev').disabled = true;
    }

    const prevBtn = document.querySelector('.prev')
    const nextBtn = document.querySelector('.next')

    prevBtn.addEventListener('click', () => {
        if(current_page === 1 ){
            document.querySelector('.prev').disabled = true;
            return
        }else{
            document.querySelector('.prev').disabled = false;
            current_page--
            outputPagination(current_page, total_pages)
        }
    })

   nextBtn.addEventListener('click', () => {
        if(current_page === total_pages ){
            document.querySelector('.next').disabled = true;
            return
        }else{
            document.querySelector('.prev').disabled = false;
            current_page++
            outputPagination(current_page, total_pages)
        }
    })
}

async function outputPagination (current_page, total_pages){

    document.querySelector('.first_page').textContent=`${current_page}`
    document.querySelector('.last_page').textContent=`${total_pages}`

    if(search_active === false){
        const movie = await fetchDataForPagination (current_page)
        document.querySelector('.container').innerHTML=''
        outputDataAfterPagination(movie)
    }else{
        const movie = await fetchSearchData(input.value, current_page)
        document.querySelector('.container').innerHTML=''
        outputDataAfterPagination(movie)
    }

}

//Search Movies 

const resultsField = document.querySelector('.results')

async function search(input){

    const searchResponse = await fetchSearchData(input, '1')

    resultsField.innerHTML = ''
    const searchTerm = document.createElement('h1')
    searchTerm.innerText = `${searchResponse.total_results} results for "${input}"`
    resultsField.classList.add('results_display')
    resultsField.appendChild(searchTerm)

    outputData(searchResponse)
}

//Search Button Animation

const searchBtn = document.querySelector('.search_button')
const searchField = document.querySelector('.search')
const input = document.querySelector('.input')

searchBtn.addEventListener('mouseover', () => {
    input.focus() 
    searchField.classList.contains('active') ? 
    searchField.classList.remove('active') : 
    searchField.classList.add('active')
})    

searchBtn.addEventListener('click', () => {
    input.focus() 
    searchField.classList.contains('active') ? 
    searchField.classList.remove('active') : 
    searchField.classList.toggle('active')

    if(input.value === ''){
        return}
    else{
        search_active = true;
        search(input.value)
    }

}) 
    
input.addEventListener('keydown', (e) => {
    if(e.key === "Enter"){
        if(input.value === ''){
            return}
        else{
            search_active = true;
            search(input.value)
        }
    }else{
        return}
})

//Request Data by Clicking on the Home-Icon

document.querySelector('.navbar h3').addEventListener('click', () => {
    search_active = false
    resultsField.innerHTML = ''
    resultsField.classList.remove('results_display')

    requestData()
})
    
//Request Data that appears first on the page

requestData()


