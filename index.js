const fetchData = async searchTerm => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '54822106',
            s: searchTerm,
        }
    })

    console.log(response.data)
}

const input = document.querySelector('input')

const debounce = (func, delay) => {
    let timeoutID

    return (...args) => {

        if (timeoutID) clearTimeout(timeoutID)
        
        timeoutID = setTimeout(() => {
            func.apply(null, args)
        }, delay)
    }
}


const onInput = e => fetchData(e.target.value)

input.addEventListener('input', debounce(onInput, 500))