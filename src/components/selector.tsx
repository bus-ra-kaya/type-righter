import {useState, useEffect } from "react";
import {quotes} from "../data/quotes.ts"
import {wordlist} from "../data/wordlist.ts"

interface SelectorProps {
    setTestText: React.Dispatch<React.SetStateAction<string>>;
    theme: string;
}

export default function Selector({setTestText, theme}: SelectorProps){
    
    const [isItQuote,setIsItQuote] = useState<boolean>(true)
    const [punctuated, setPunctuated] = useState<boolean>(false)
    const [numbered,setNumbered] = useState<boolean>(false)
    
      function getQuote(): void{
        const index = Math.floor(Math.random() * quotes.length);
        const randQuote = quotes[index];
        setTestText(randQuote);
        setIsItQuote(true)
;      }
    
      function getWords(count: number  = 60): void{
        const words = Array.from({length: count}, () => {
         return (wordlist[Math.floor(Math.random() * wordlist.length)])
        }).join(" ");
        setIsItQuote(false);

        if(!punctuated && !numbered) {
        setTestText(words);
      }
      else if(punctuated){
        const punctuations = [".", ",", "!", "?", ";", ":"];
        let chars = words.split(" ");
      } 
      else if(numbered){

      }
      }
      

      useEffect (() => {
        getWords();
      },[])

    return (

         <section className="header-bottom">
        <div> 
          <span className="choose-selector">Version: </span>
          <button  className="selector" onClick={() => getWords(50)}>
            <img src={`/${theme}/a-letter.svg`} alt="" />Words</button>
          <button className="selector" onClick= {() => getQuote()}>
            <img src={`/${theme}/quote.svg`} alt="" />Quotes </button> &nbsp;
        </div>
        <div>
          <span className="choose-selector">Length: </span>
          <button className="selector" onClick={() => getWords(25)}>Short</button>
          <button className="selector" onClick={() => getWords(50)}>Medium</button>
          <button className="selector" onClick={() => getWords(75)}>Long</button> &nbsp;
        </div>
        <div>
          <span className="choose-selector">Include: </span> 
          <button className={`selector ${isItQuote && "disabled"}`} onClick={() => {setNumbered(prev => !prev)}}>
            <img src={`/${theme}/one.svg`} alt="" />Numbers</button>
          <button className={`selector ${isItQuote && "disabled"}`} onClick={() => {setPunctuated(prev => !prev)}}>
            <img src={`/${theme}/punctuation.svg`} alt="" />Punctuation</button>
        </div>
      </section>
    )
}