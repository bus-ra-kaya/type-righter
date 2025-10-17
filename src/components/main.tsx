import {useEffect, useState, useMemo} from "react";
import ProgressBar from "./progressbar";
import "./main.css"
import { nanoid } from 'nanoid';

type textInfo = {
  id: string;
  value: string | null,
  className: string | undefined,
  entered: string | null,
  time: number | null,
}

interface MainProps {
    readonly testText: string;
    setFinished:React.Dispatch<React.SetStateAction<boolean>>;
    setResults: React.Dispatch<React.SetStateAction<textInfo[]>>;
}

export default function Main({testText, setFinished,setResults}: Readonly<MainProps>){
  const [wordList, setWordList] = useState<textInfo[]>(() => textWithInfo(testText));
  const [currentPos, setCurrentPos] = useState<number>(0)
  const [wrongCount, setWrongCount] = useState<number>(0)

  const [wordsFinished, setWordsFinished] = useState<number>(0)
  const [lockIndex, setLockIndex] = useState<number>(0);

  const [previousText, setPreviousText] = useState<string | null>(null);
  const [transition, setTransition] = useState<boolean>(false);



  function CharSpan({ char }:{char: textInfo}){
  return (
    <span className={char.className}>
      {char.entered === null ? char.value : char.entered }
    </span>
  );}

  function textWithInfo(text: string):textInfo[]{
    return text.split("").map(letter => ({
      id: nanoid(),
      value: letter,
      className: undefined,
      entered: null,
      time: null,
    }))
   } 

    function reset():void{
      setWordList(textWithInfo(testText));
      setLockIndex(0);
      setCurrentPos(0);
      setWrongCount(0);
      setWordsFinished(0);
  }

  const spaceIndexes = useMemo(() => {
    return wordList.reduce<number[]>((acc,char,idx) => {
      if(char.value === " ") acc.push(idx);
      return acc;
    }, [])
  }, [wordList]);

  const cursor: string = "|";

 function textEdit(e: React.KeyboardEvent<HTMLElement>) {
  if (e.key !== "Tab"){
  e.preventDefault();
  }

  const allowed = /^[a-zA-Z0-9]$/.test(e.key) || ["Backspace"," ",",","-", '"', "'", ":",";","!","."].includes(e.key);
  if(!allowed) return;

  function markChar (pos: number, className: string | undefined , entered: string | null = null) {
    const updated = [...wordList];
    updated[pos] = {...updated[pos], className: className, entered: entered,
    time: Date.now()
    };
    setWordList(updated);
    return(updated);
    }

  function commitWord () {
    setLockIndex(currentPos +1);
    setCurrentPos(prev => prev+1);
    setWordsFinished(prev => prev +1);
    setWrongCount(0);
  }

  function handleSpace(){
    const start = wordsFinished === 0 ? 0 : spaceIndexes[wordsFinished -1] +1;
    const end = spaceIndexes[wordsFinished]; 
    const typedSlice = wordList.slice(start, end); 
    const typedRight = typedSlice.every(
      char => char.className === "green-letter");

    if(typedRight) {
      markChar(currentPos, "green-letter", " ");
      commitWord();
    } else {
      markChar(currentPos, "red-letter", " ");
      setCurrentPos(prev => prev +1);
      setLockIndex(currentPos +1);
    }
  }; 
  if(e.key === "Backspace"){
      if(currentPos > lockIndex){
      markChar(currentPos -1, undefined, null);
      setCurrentPos(prev => prev - 1);
      setWrongCount(prev => Math.max(0, prev -1));
      }
      return;
    }

  if(currentPos === wordList.length -1){
    const className = e.key === wordList[currentPos].value ? "green-letter" : "red-letter";
    const updated = markChar(currentPos, className, e.key);
    setResults(updated);
    setFinished(true);
    return;
  }
  if(e.key === wordList[currentPos].value){
    if(e.key === " "){
      handleSpace();
      return;
    }
    else {
      markChar(currentPos, "green-letter", e.key);
      setCurrentPos(prev => prev +1);
      setWrongCount(0);
      return;
    }
    }
    else {
      markChar(currentPos, "red-letter", e.key);
      setCurrentPos(p => p + 1);
      setWrongCount(p => p + 1);
  }
}
function renderWords(){
  let wordStart = 0;
  const elements = [];

  for(let i= 0; i < spaceIndexes.length + 1; i++){

  const wordEnd = (i === spaceIndexes.length) ? wordList.length : spaceIndexes[i];
  const currentWordChars = wordList.slice(wordStart, wordEnd);
  const cursorRelativePos = currentPos - wordStart;
  const isCursorInWord = (currentPos >= wordStart && currentPos <= wordEnd);
  elements.push(
    <span key= {`word-${wordStart}`} className="word-container">
      {currentWordChars.map((char, index) => {
        let element = [];
        if(isCursorInWord && (index === cursorRelativePos)){
          element.push(
           <span key="cursor" className="cursor">
              {cursor}
              </span>
          )
        }
        element.push(<CharSpan key= {char.id} char={char} />)
        return element;
      })}  
    </span>
  )

  if (i < spaceIndexes.length) {
    const spaceIndex = spaceIndexes[i];
    const spaceChar = wordList[spaceIndex];

    if(currentPos === spaceIndex){
      elements.push(
        <span key="cursor-space" className="cursor">
          {cursor}
        </span>
      )
    }
    elements.push(<CharSpan key={spaceChar.id} char= {spaceChar} />);
  }
  wordStart = wordEnd + 1;
  }
  return elements;
  }

   useEffect(() => {
      setPreviousText(wordList.map(c => c.value).join(""));
      setTransition(true);

      const transitionDur = 300;

      const timer1 = setTimeout(() => {
        reset();
      }, transitionDur);

      const timer2 = setTimeout(() => {
        setTransition(false);
        setPreviousText(null);
      }, transitionDur + 50);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
  }, [testText]);

  return (
    <>
    <main className="test">
      <div 
        role= "application"
        tabIndex={0}
        aria-label="typing test area"
        onKeyDown={(e) => {textEdit(e)}} 
        className={`words ${transition ? "fade-out" : ""}`}
      >
        {transition && previousText ? (
          <span>{previousText}</span>
        ) : (
          renderWords()
        )}
      </div>
  </main>
  <ProgressBar current={currentPos} total={wordList.length}/>
  </>
)
}