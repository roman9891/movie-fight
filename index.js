const autoCompleteConfig = {
    renderOption: (movie) => {
        const poster = movie.Poster === 'N/A' ? '' : movie.Poster
        return `
            <img src="${poster}"/>
            ${movie.Title} (${movie.Year})
        `
    },
    inputValue: (movie) => {
        return movie.Title
    }, 
    fetchData: async (searchTerm) => {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '54822106',
                s: searchTerm,
            }
        })
    
        if (response.data.Error) return []
    
        return response.data.Search
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
    },
})

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect: (movie) => {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
    },
})

let movieLeft
let movieRight
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '54822106',
            i: movie.imdbID,
        }
    })

    summaryElement.innerHTML = movieTemplate(response.data)

    if (side === 'left') movieLeft = movie
    else movieRight = movie

    if (movieLeft && movieRight) runComparison(movieLeft, movieRight)
}

const runComparison = (movieLeft, movieRight) => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification ')
    const rightSideStats = document.querySelectorAll('#right-summary .notification ')
    
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index]

        const leftStatValue = parseInt(leftStat.dataset.value)
        const rightStatValue = parseInt(rightStat.dataset.value)

        if (leftStatValue > rightStatValue) {
            rightStat.classList.remove('is-primary')
            rightStat.classList.add('is-warning')
        } else if (leftStatValue < rightStatValue) {
            leftStat.classList.remove('is-primary')
            leftStat.classList.add('is-warning')
        }
        console.log(leftStatValue, rightStatValue)
    })
}

const movieTemplate = movieDetail => {
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''))
    const metascore = parseInt(movieDetail.Metascore)
    const imdbRating = parseFloat(movieDetail.imdbRating)
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        value = parseInt(word)
        if (!isNaN(value)) return prev + value
        else return prev
    }, 0)

    return `
        <article class="media">
            <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>
            </figure>
            <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
            </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
  };