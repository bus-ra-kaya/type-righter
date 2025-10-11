import {useEffect, useState, useMemo} from "react";
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

  function CharSpan({ char }:{char: textInfo}){
  return (
    <span className={char.className}>
      {char.entered === null ? char.value : char.entered }
    </span>
  );
}

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

  useEffect(() => {
    reset();
  }, [testText]);

  const spaceIndexes = useMemo(() => {
    return wordList.reduce<number[]>((acc,char,idx) => {
      if(char.value === " ") acc.push(idx);
      return acc;
    }, [])
  }, [wordList]);

  const cursor: string = "|";
  let progress = `${wordsFinished} / ${spaceIndexes.length +1}`

 function textEdit(e: React.KeyboardEvent<HTMLElement>) {
  e.preventDefault();

  const allowed = /^[a-zA-Z0-9]$/.test(e.key) || ["Backspace"," ",",","-", '"', "'", ":",";","!","."].includes(e.key);
  if(!allowed) return;

  function markChar (pos: number, className: string | undefined, entered: string | null = null) {
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
      markChar(currentPos, "green-letter", null);
      setCurrentPos(prev => prev +1);
    }
  }; 
  if(e.key === wordList[currentPos].value){
    if(currentPos === wordList.length -1){
      const updated = markChar(currentPos, "green-letter", e.key);
      setResults(updated);
      setFinished(true);
    }
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
    }
  }
    else if(e.key === "Backspace"){
      if(currentPos > lockIndex){
      markChar(currentPos -1, undefined, null);
      setCurrentPos(prev => prev - 1);
      setWrongCount(prev => Math.max(0, prev -1));
      }
    }
    else {
      markChar(currentPos, "red-letter", e.key);
      setCurrentPos(p => p + 1);
      setWrongCount(p => p + 1);
  }
}

    return (
      <main className="test">
        <div tabIndex={0} onKeyDown={(e) => {textEdit(e)}} className="words">
     {wordList.slice(0, currentPos).map(char => (
        <CharSpan key={char.id} char={char} />
      ))}
      <span className="cursor">{cursor}</span>
      {wordList.slice(currentPos).map(char => (
        <CharSpan key={char.id} char={char} />
      ))}
         </div>
          <span className="progress">Progress: {progress}</span>
    </main>
    )
}