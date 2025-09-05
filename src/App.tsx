import "./App.css"
import {words} from "./data/words"
import {quotes} from "./data/quotes"
import logo from "./assets/fox-svgrepo.svg"
import darkmode from "./assets/moon-svgrepo.svg"
import React from "react"
import { nanoid } from 'nanoid'

type textInfo = {
  value: string | null,
  className: string | undefined,
  entered: string | null,
  time: number | null,
}

export default function App() {
  const [typed, setTyped] = React.useState<textInfo[]>([])
  const [wordList, setWordList] = React.useState<textInfo[]>(() => getRandomWordList(60));
  const [currentPos, setCurrentPos] = React.useState<number>(0)
  const [wrongCount, setWrongCount] = React.useState<number>(0)
  const [wordsFinished, setWordsFinished] = React.useState<number>(0)

  const spaceIndexes: number[] = [];
  wordList.forEach((char, idx) => {
  if (char.value === " ") {
    spaceIndexes.push(idx);
  }});
  console.log(spaceIndexes)

  const cursor: string = "|";
  function getRandomWordList(num: number):textInfo[]{
    const lettersArray: string[] = Array.from({length: num},() => {
      return words[Math.floor(Math.random()* words.length)]})
      .join(" ").split("");
    return lettersArray.map(letter => ({value: letter, className: undefined, entered: null, time: null}))
  } 

  function displayWords (){

  }

 function textEdit(e: React.KeyboardEvent<HTMLElement>) {
  e.preventDefault();
  if (!/^[a-zA-Z]$/.test(e.key) && !["Backspace", " ", ".", ",","!"].includes(e.key)){
    return;
  }
  else if(e.key === wordList[currentPos].value) {
    if(e.key == " "){

      let typedRight: boolean = true;
      const prevLetters = spaceIndexes[wordsFinished -1] === undefined ? 0 : spaceIndexes[wordsFinished -1]
      for(let i =prevLetters; i <= (spaceIndexes[wordsFinished]); i++){
        if(wordList[i].className !== "green-letter"){
          typedRight = false;
          break; 
        }
      }

      if (typedRight){
        const wordInfo:textInfo[] = wordList.slice(0,currentPos +1);
        const updated = wordList.slice(currentPos +1,wordList.length);
        setTyped(prev => {
        const written = prev ? [...prev] : [];
        written.push(...wordInfo);
        return written;
      } );
      setWordList(updated);
      setCurrentPos(0);
      setWordsFinished(prev => prev+1)
      }
    }
    else {
    const updated = [...wordList];
    updated[currentPos] = { ...updated[currentPos], className: "green-letter", entered: null };

    setWordList(updated);
    setCurrentPos(prev => prev + 1);
    }
  } 
  else if (e.key === "Backspace") {
    if (currentPos > 0) {
      const updated = [...wordList];
      const newPos = currentPos - 1;
      updated[newPos] = { ...updated[newPos], className: undefined, entered: null };

      setWordList(updated);
      setCurrentPos(newPos);
    }
  } 

  else if(wrongCount >= 1){
    const updated = [...wordList];
    updated.splice(currentPos, 0, {value: null, className: "red-letter", entered: e.key, time:null });
    setWordList(updated);

    setCurrentPos(prev => prev + 1);
  }
  else {
    const updated = [...wordList];
    updated[currentPos] = { ...updated[currentPos], className: "red-letter", entered: null };
    setWordList(updated);

    setCurrentPos(prev => prev + 1);
    setWrongCount(prev => prev+1)
  }
}


  return (
    <>
    <header>
      <section className="header-top">
        <div className="logo">
          <img src={logo} alt="keyboard-icon" />
          <h1>TypeRighter</h1>
        </div>
        <div>
          <img className="dark-mode"src={darkmode} alt="dark-mode" />
        </div>
      </section>
      <section className="header-bottom">
        Type along quick brown foxes
      </section>
    </header>
    <main>
      <button onClick={displayQuotes}>Quotes</button>
      <button onClick={displayWords}>Words</button>
      {wordsFinished}
      <div tabIndex={0} onKeyDown={(e) => {textEdit(e)}} className="words">
          {typed.map((char) => <span className = {char.className} key={nanoid()}>{char.entered === null ? char.value :char.entered}</span> )}
          {wordList.slice(0, currentPos).map((char) =>
          <span className = {char.className} key={nanoid()}>{char.entered === null ? char.value :char.entered}</span>)}
          <span className="cursor">{cursor}</span>{wordList.slice(currentPos).map((char) => 
          <span className={char.className} key={nanoid()}>{char.entered === null ? char.value :char.entered}</span>)}
        </div>
    </main>
    <footer>
    Made by a lil pengu
    </footer>
    </>
  )
}
