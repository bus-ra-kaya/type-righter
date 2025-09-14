import {useState} from 'react'
import { nanoid } from 'nanoid'

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
  const [wordList, setWordList] = useState<textInfo[]>(() => textWithInfo());
  const [currentPos, setCurrentPos] = useState<number>(0)
  const [wrongCount, setWrongCount] = useState<number>(0)
  const [wordsFinished, setWordsFinished] = useState<number>(0)

    function reset():void{
    setWordList(textWithInfo());
    setTyped([]);
    setCurrentPos(0);
    setWrongCount(0);
    setWordsFinished(0);
  }

  const spaceIndexes: number[] = [];
  wordList.forEach((char, idx) => {
  if (char.value === " ") {
    spaceIndexes.push(idx);
  }});

  const cursor: string = "|";

  let progress = `${wordsFinished} / ${spaceIndexes.length}`

  function textWithInfo():textInfo[]{
    const textArr = testText.split("")
    
    return textArr.map(letter => ({value: letter, className: undefined, entered: null, time: null}))
  } 

 function textEdit(e: React.KeyboardEvent<HTMLElement>) {
  e.preventDefault();
  if (!/^[a-zA-Z]$/.test(e.key) && !["Backspace"," ","'", ".", ",","!","-"].includes(e.key)){
    return;
  }
  else if(e.key === wordList[currentPos].value) {
    if(e.key === " "){
      
      const start = wordsFinished === 0 ? 0 : spaceIndexes[wordsFinished -1] +1;
      const end = currentPos;

      const typedSlice = wordList.slice(start, currentPos);
      const typedWrong = typedSlice.filter(char => char.className === "red-letter");

      let typedRight = true;

      for(let i= start; i < end + typedWrong.length; i++){
        if (wordList[i].className !== "green-letter") {
          typedRight = false;
          break;
        }
      }

      if(typedRight) {
        const marked = [...wordList];
        marked[currentPos] = {
        ...marked[currentPos],
        className: "green-letter",
        entered: null
        };

        const wordInfo = marked.slice(0, currentPos +1);
        const updated = marked.slice(currentPos +1);

        setTyped(prev => (prev ? [...prev, ...wordInfo] : [...wordInfo]));
        setWordList(updated);
        setCurrentPos(0);
        setWordsFinished(prev => prev +1);
        setWrongCount(0);
      }
      else {
          const updated = [...wordList];
          updated[currentPos] = { ...updated[currentPos], className: "green-letter", entered: null };

          setWordList(updated);
          setCurrentPos(prev => prev + 1);
    
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
      setWrongCount(prev => prev > 0 ? prev -1 : 0);
    
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
         <main>
      <div tabIndex={0} onKeyDown={(e) => {textEdit(e)}} className="words">
          {typed.map((char) => <span className = {char.className} key={nanoid()}>{char.entered === null ? char.value :char.entered}</span> )}
          {wordList.slice(0, currentPos).map((char) =>
          <span className = {char.className} key={nanoid()}>{char.entered === null ? char.value :char.entered}</span>)}
          <span className="cursor">{cursor}</span>{wordList.slice(currentPos).map((char) => 
          <span className={char.className} key={nanoid()}>{char.entered === null ? char.value :char.entered}</span>)}
        </div>

          <span className="progress">Progress: {progress}</span>
          <button className='restart' onClick={() => reset()}>Restart?</button>
    </main>
    )
}