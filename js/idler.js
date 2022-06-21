import { ALL__WORDS } from "./words.js";
const
    getS = selector => document.querySelector(selector),
    getA = selector => document.querySelectorAll(selector);

class App {
    constructor() {
        this._words = ALL__WORDS
        this._cells = getA('.word__letter')
        this.presentLetter = []
        this._missingLetter = []
        this._correctWord = ['', '', '', '', '']
    }
// Rename all method name

    getAllCorrectWords() {
        const possibleWords = this._correctWord[0]
            ? this.getAllPosibleWord().filter( obj => obj[0][0] === this._correctWord[0] )
            : this.getAllPosibleWord()
        
        return possibleWords
            .map( obj => obj
                .filter( word => this._correctWord
                    .every( (letter, i) => letter === ''
                        ? true
                        : word[i] === letter 
                    ) ) ).filter( obj => obj.length )
    }

    getNotMissingWord() {
        const wrongWords = this._words
            .filter( item => !this._missingLetter
                .includes(item.letter)
            )

        return wrongWords
            .map( obj => obj.words
                .filter( word => !this._missingLetter
                    .some( letter => word.includes(letter) 
            ) ) )
    }

    getAllPosibleWord() {
        const allWords = this.getNotMissingWord()
        
        return allWords
            .map( obj => obj
                .filter( word => this.presentLetter
                    .every( letter => word.includes(letter)
                ) ) ).filter( obj => obj.length)
    }

    checkDuplicate(target) {
        return Array.from(this._cells)
            .reduce( (memo, item) => item.classList
                .contains(target)
                && !this._missingLetter.includes( item.textContent.toLowerCase() )
                    ? [...memo, item.textContent.toLowerCase()]
                    : [...memo, '']
                , [])
    }

    checkStatus() {
        return Array.from(this._cells)
            .map( item => item.classList.contains('cell_correct')
                || item.classList.contains('cell_present')
                || item.classList.contains('cell_missing') 
            ).every(el => el)
    }


    // Temporary function

    testCheck() {
        console.log(
            this._correctWord,
            this.presentLetter,
            this._missingLetter
        )
    }

    testSubmite(){
        const wordList = this.getAllCorrectWords()
        wordList
            .reverse()
                .map( obj => {
                    const 
                    temporaryModal = getS('.answer__window_test'),
                    titleLetter = obj[0][0].toLocaleUpperCase(),
                    wordList = obj.join(' ')

                    temporaryModal.insertAdjacentHTML('afterbegin',`<h3>${titleLetter}</h3> <p>${wordList}</p>`)
                })
    }

    clearTestSubmite(){
        getS('.answer__window_test').innerHTML = ''
    }
}

class AppValues extends App {
    constructor() {
        super()
    }

    setCorrectLetter() {
        const test = this.checkDuplicate('cell_correct')

        if ( test.every( el => el === '') ) return

        this._correctWord = [...test]
    }

    setPresentLetter() {
        const test = this.checkDuplicate('cell_present')

        if ( test.length === 0 ) return

        test.forEach( item => this.presentLetter
            .includes(item) || item === ''
                ? item
                : this.presentLetter.push(item))
    }

    setMissingLetter() {
        const test = this.checkDuplicate('cell_missing')

        if ( test.length === 0 ) return

        test.forEach( item => this._missingLetter
            .includes(item) || item === ''
                ? item
                : this._missingLetter.push(item) 
        )
    }
}


class Board extends AppValues {
    constructor() {
        super()
        this._boardState = []
    }

    setLetter(e) {
        if ( this._boardState.length > 4 ) return message.tooBigWordMessage

        this._cells[this._boardState.length].textContent = e.key.toUpperCase()
        this._boardState.push(e.key)

        // Temporary modal clear
        this.clearTestSubmite()
    }

    removeLetter() {
        if ( !this._boardState.length ) return

        this._cells[this._boardState.length - 1].textContent = ''
        this._boardState.pop()
    }

    getWord() {
        if ( this._boardState.length < 5 ) return
        if ( !this.checkStatus() ) return message.notSetStatus

        message.testMessage
        this.setMissingLetter()
        this.setCorrectLetter()
        this.setPresentLetter()
        this.clearBoard()

        // this.testCheck()
        this.testSubmite()
    }

    clearBoard() {
        const letters = getA('.word__letter')
        this._boardState = []
        this._cells.forEach( cell => cell.textContent = '' )
        Array.from(letters)
            .map(cell => cell.classList
                .remove( 'cell_correct', 'cell_present', 'cell_missing' ) )
    }

    resetAll() {
        this.presentLetter = []
        this._missingLetter = []
        this._correctWord = ['', '', '', '', '']
        this.clearBoard()
    }
}

// Here must be a class responsible for the mobile keyboard

class Keyboard extends Board {
    constructor() {
        super()
        this._keyboard = [
            ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ґ', 'ш', 'щ', 'з', 'х'],
            ['ф', 'і', 'ї', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'є'],
            ['enter', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', 'backspace']
        ];
    }
}

// Here must be a class that trigger pop-up messages

class Message {
    get tooBigWordMessage() {
        return console.log('WORD IS TOO BIG')
    }

    get tooSmallWordMessage() {
        return console.log('WORD IS TOO SMALL')
    }

    get testMessage() {
        console.log(`IN PROGRESS...`)
    }

    get notSetStatus() {
        console.log(`NOT ALL CELL HAS STATUS`)
    }
    get changeLayout() {
        console.log('PLEASE CHANGE KEYBOARD LAYOUT TO UKRAINE')
    }
}


const board = new Board()
const message = new Message()


getS('.btn_test').addEventListener( 'click', () => {
    const letters = getA('.word__letter')
    Array.from(letters)
        .map( cell => cell.classList
            .remove( 'cell_correct', 'cell_present', 'cell_missing' ) )
    board.resetAll()
})


document.addEventListener('keydown', (e) => {
    /[A-Za-z]/.test(e.key) 
    && e.key !== 'Enter'
    && e.key !== 'Backspace'
        ? message.changeLayout
        : /[а-щА-ЩЬьЮюЯяЇїІіЄєҐґ']/.test(e.key)
            ? board.setLetter(e)
            : e.key === 'Enter'
                ? board.getWord()
                : e.key === 'Backspace'
                    ? board.removeLetter()
                    : null
})      
