const
getS = selector => document.querySelector(selector),
getA = selector => document.querySelectorAll(selector);

getS('.theme-switcher__btn').addEventListener('click', () => {
    getS('body').classList.toggle("light");
    getS('body').classList.toggle("dark");
})

getS('.dropdown__btn').addEventListener('click', e => {
    e.target.classList.toggle('open');
    getS('.dropdown__list').classList.toggle('active')
})

getS('.solver__btns').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return
    const
        letters = getA('.word__letter'),
        index = e.target.parentElement.cellIndex;

    if (e.target.classList.contains('cell_correct')) {
        letters[index].classList.remove('cell_present','cell_missing')
        letters[index].classList.toggle('cell_correct')
    } else if (e.target.classList.contains('cell_present')) {
        letters[index].classList.remove('cell_correct','cell_missing')
        letters[index].classList.toggle('cell_present')
    } else {
        letters[index].classList.remove('cell_correct','cell_present')
        letters[index].classList.toggle('cell_missing')
    }
})