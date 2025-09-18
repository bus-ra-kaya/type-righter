import {useState, useEffect } from "react";
import clsx from "clsx";
import {quotes} from "../data/quotes"
import {wordlist} from "../data/wordlist"

interface SelectorProps {
    setTestText: React.Dispatch<React.SetStateAction<string>>;
    theme: string;
}

type TextLength = "short" | "medium" | "long" | null

export default function Selector({setTestText, theme}: SelectorProps){
    
    const [mode,setMode] = useState<"words" | "quote">("words");
    const [punctuated, setPunctuated] = useState<boolean>(false);
    const [numbered,setNumbered] = useState<boolean>(false);
    const [length,setLength] = useState<TextLength>("medium");
        
      function getQuote(): void{
        const sizeMap = {short: 0, medium: 1, long: 2};
        const randomSize = Math.floor(Math.random() * 3);
        const size = length ? sizeMap[length] : randomSize;
        const index = Math.floor(Math.random() * quotes[size].length);
        const randQuote = quotes[size][index];
        setTestText(randQuote);
        setMode("quote");

      }
    
      function getWords(): void{
  
        const sizeMap = {short: 20, medium: 45, long: 80};
        const count = length ? sizeMap[length] : 45;

        let words = Array.from({length: count}, () => {
         return (wordlist[Math.floor(Math.random() * wordlist.length)])
        });
        setMode("words");

        if(punctuated){
          const punctuations = [".", ",", "!", "?", ";", ":"];
          const end = [".","!", "?"]
          let sentenceFinished = true;
          words = words.map((word) => {
            const roll = Math.random();

            if(roll < 0.15){
              const p = punctuations[Math.floor(Math.random() * punctuations.length)];
              if(end.includes(p)) sentenceFinished = true;
              else sentenceFinished = false
              return word + p;
            }
            if(sentenceFinished){
              sentenceFinished = false;
              return word[0].toUpperCase() + word.slice(1);
            }

            return word}); 
          }
        if(numbered){
          words = words.map(word => {
            if(Math.random() < 0.15){
               return String(Math.floor(Math.random() * 100));
            }
            return word;
          });          
        }
        setTestText(words.join(" "));
    }
    useEffect (() => {
      if(mode === "quote"){
        getQuote();
       }
       else {
        getWords()
       }
      },[punctuated, numbered, length, mode])
    return (

         <section className="header-bottom">
        <div> 
          <span className="choose-selector">Version: </span>
          <button  className="selector" onClick={() => getWords()}>
            <img src={`/${theme}/a-letter.svg`} alt="" />Words</button>
          <button className="selector" onClick= {() => getQuote()}>
            <img src={`/${theme}/quote.svg`} alt="" />Quotes </button> &nbsp;
        </div>
        <div>
          <span className="choose-selector">Length: </span>
          <button className="selector" onClick={() => setLength(prev => prev === null ? "short" : null )}>Short</button>
          <button className="selector" onClick={() => setLength(prev => prev === null ? "medium" : null )}>Medium</button>
          <button className="selector" onClick={() => setLength(prev => prev === null ? "long" : null )}>Long</button> &nbsp;
        </div>
        <div>
          <span className="choose-selector">Include: </span> 
          <button className={clsx("selector", {disabled: mode === "words"})} onClick={() => {setNumbered(prev => !prev)}}>
            <img src={`/${theme}/one.svg`} alt="" />Numbers</button>
          <button className={clsx("selector", {disabled: mode === "words"})} onClick={() => {setPunctuated(prev => !prev)}}>
            <img src={`/${theme}/punctuation.svg`} alt="" />Punctuation</button>
        </div>
      </section>
    )
}