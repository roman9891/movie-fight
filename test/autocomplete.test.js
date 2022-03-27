beforeEach(() => {
    document.querySelector('#target').innerHTML = ''
    createAutoComplete({
        root: document.querySelector('#target'),
        fetchData() {
            return [
                {Title: 'a'},
                {Title: 'b'},
                {Title: 'c'}
            ]
        },
        renderOption(movie) {
            return movie.Title
        }
    })
})

const waitFor = async (selector) => new Promise((resolve, reject) => {
    const intervalID = setInterval(() => {
        if (document.querySelector(selector)) {
            clearInterval(intervalID)
            clearTimeout(timeoutID)
            resolve()
        }
    }, 30)

    const timeoutID = setTimeout(() => {
        clearInterval(intervalID)
        reject()
    }, 2000)
})


it('dropdown starts closed', () => {
    const dropdown = document.querySelector('.dropdown')

    expect(dropdown.className).not.to.include('is-active')
})

it('after searching, dropdown opens up', async () => {
    const input = document.querySelector('input')
    const dropdown = document.querySelector('.dropdown')

    input.value = "test"
    input.dispatchEvent(new Event('input'))
    await waitFor('.dropdown-item')

    expect(dropdown.className).to.include('is-active')
})

it('renders results equal to amount fetched', async () => {
    const input = document.querySelector('input')
    const dropdown = document.querySelector('.dropdown')

    input.value = "test"
    input.dispatchEvent(new Event('input'))
    await waitFor('.dropdown-item')

    const items = dropdown.querySelectorAll('.dropdown-item')

    expect(items.length).to.equal(3)
})