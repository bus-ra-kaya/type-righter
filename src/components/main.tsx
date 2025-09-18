import {useEffect, useState} from "react";
import { nanoid } from 'nanoid';

type textInfo = {
  value: string | null,
  className: string | undefined,
  entered: string | null,
  time: number | null,
}

interface MainProps {
    testText: string;
}

export default function Main({testText}: MainProps){
  const [typed, setTyped] = useState<textInfo[]>([])
  const [wordList, setWordList] = useState<textInfo[]>(() => textWithInfo(testText));
  const [currentPos, setCurrentPos] = useState<number>(0)
  const [wrongCount, setWrongCount] = useState<number>(0)
  const [wordsFinished, setWordsFinished] = useState<number>(0)

  function textWithInfo(text: string):textInfo[]{
    return text.split("").map(letter => ({
      value: letter,
      className: undefined,
      entered: null,
      time: null,
    }))
   } 

    function reset():void{
      setWordList(textWithInfo(testText));
      setTyped([]);
      setCurrentPos(0);
      setWrongCount(0);
      setWordsFinished(0);
  }

  useEffect(() => {
    setWordList(textWithInfo(testText));
  }, [testText]);

  const spaceIndexes: number[] = [];
  wordList.forEach((char, idx) => {
  if (char.value === " ") {
    spaceIndexes.push(idx);
  }});

  const cursor: string = "|";
  let progress = `${wordsFinished} / ${spaceIndexes.length +1}`

  function CharSpan({ char }:{char: Readonly<textInfo>}){
    return (
      <span className={char.className}>
        {char.entered === null ? char.value : char.entered }
      </span>
    );

  }
 function textEdit(e: React.KeyboardEvent<HTMLElement>) {
  e.preventDefault();

  const allowed = /^[a-zA-Z0-9]$/.test(e.key) || ["Backspace"," ", "'", ":",";","!","."].includes(e.key);
  if(!allowed) return;

  function markChar (pos: number, className: string | undefined, 
    entered: string | null = null) {

    const updated = [...wordList];
    updated[pos] = {...updated[pos], className: className, entered: entered};
    setWordList(updated);
    }


  function commitWord (marked: typeof wordList ) {
    const wordInfo = marked.slice(0,currentPos + 1);
    const updated = marked.slice(currentPos +1);

    setTyped(prev => (prev ? [...prev,...wordInfo] : [...wordInfo]));
    setWordList(updated);
    setCurrentPos(0);
    setWordsFinished(prev => prev +1);
    setWrongCount(0);
  }

  function handleSpace(){
    const start = wordsFinished === 0 ? 0 : spaceIndexes[wordsFinished -1] +1;
    const end= currentPos;

    const typedSlice = wordList.slice(start, currentPos);
    const typedWrong = typedSlice.filter(char => char.className === "red-letter");

    let typedRight = true;
    for(let i = start; i < end + typedWrong.length; i++){
      if(wordList[i].className !== "green-letter"){
        typedRight = false;
        break;
      }
    }

    if(typedRight) {
      const marked = [...wordList];
      marked[currentPos] = {...marked[currentPos], className: "green-letter", entered:  null};
      commitWord(marked);
    } else {
      markChar(currentPos, "green-letter", null);
      setCurrentPos(prev => prev +1);
    }
  };
  if(e.key === wordList[currentPos].value){
    if(e.key === " "){
      if(wordList[currentPos].value === " "){
      handleSpace();
      setWrongCount(0);
      }
      else{
        markChar(currentPos, "red-letter");
        setCurrentPos(prev => prev +1);
        setWrongCount(prev => prev +1);
      }
    }
    else {
      markChar(currentPos, "green-letter", e.key);
      setCurrentPos(prev => prev +1);
      setWrongCount(0);
      console.log("ran the right green letter");
    }
  }
    else if(e.key === "Backspace"){
      if(currentPos > 0){
      markChar(currentPos -1, undefined, null);
      setCurrentPos(prev => prev - 1);
      setWrongCount(prev => Math.max(0, prev -1));
      console.log("ran backspace")
      }
    }
    else if(wrongCount >= 1){
      const updated = [...wordList];
      updated.splice(currentPos, 0, {value: null, className: "red-letter",
        entered: e.key, time: null
      });
      setWordList(updated);
      setCurrentPos(prev => prev +1);
      console.log("ran wrong count +1")
    }
    else {
      markChar(currentPos, "red-letter");
      setCurrentPos(p => p + 1);
      setWrongCount(p => p + 1);
      console.log("ran the final else")
  }
}
 
    return (
      <main>
        <div tabIndex={0} onKeyDown={(e) => {textEdit(e)}} className="words">
          {typed.map((char, i) => (
        <CharSpan key={`typed-${i}`} char={char} />
      ))}
      {wordList.slice(0, currentPos).map((char, i) => (
        <CharSpan key={`done-${i}`} char={char} />
      ))}
      <span className="cursor">{cursor}</span>
      {wordList.slice(currentPos).map((char, i) => (
        <CharSpan key={`future-${i}`} char={char} />
      ))}
         </div>
          <span className="progress">Progress: {progress}</span>
          <button className='restart' onClick={() => reset()}>Restart?</button>
    </main>
    )
}