import {useState, useEffect } from "react";
import clsx from "clsx";
import './selector.css'
import {quotes} from "../data/quotes"
import {wordlist} from "../data/wordlist"

interface SelectorProps {
    resetKey: boolean;
    setTestText: React.Dispatch<React.SetStateAction<string>>;
    setFinished: React.Dispatch<React.SetStateAction<boolean>>;
}

type TextLength = "short" | "medium" | "long" | null
type DropdownSelection = "version" | "length" | "options" | null

export default function Selector({setTestText, setFinished, resetKey}: Readonly<SelectorProps>){
    
    const [mode,setMode] = useState<"words" | "quote">("words");
    const [punctuated, setPunctuated] = useState<boolean>(false);
    const [numbered,setNumbered] = useState<boolean>(false);
    const [length,setLength] = useState<TextLength>(null);
    
    const [openDropdown, setOpenDropdown] = useState<DropdownSelection>(null);

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
        const count = length ? sizeMap[length] : 50;

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
      },[punctuated, numbered, length, mode, setFinished,resetKey])
    return (

      <section>
        <div className="wide-menu">
          <div> 
          <span className="option-label">Version: </span>
          <button  className={clsx("selector", {"active-selector": mode === "words"})} onClick={() => getWords()}>
            <div className="a-letter icon"></div>Words</button>
          <button className={clsx("selector", {"active-selector": mode === "quote"})} onClick= {() => getQuote()}>
            <div className="quote icon"></div>Quotes </button> &nbsp;
        </div>
        <div>
          <span className="option-label">Length: </span>
          <button className={clsx("selector", {"active-selector": length === "short"})} onClick={() => setLength(prev => prev === null || prev === "medium" || prev === "long" ? "short" : null )}>Short</button>
          <button className={clsx("selector", {"active-selector": length === "medium"})} onClick={() => setLength(prev => prev === null  || prev === "short" || prev === "long"  ? "medium" : null )}>Medium</button>
          <button className={clsx("selector", {"active-selector": length === "long"})} onClick={() => setLength(prev => prev === null || prev === "short" || prev === "medium" ? "long" : null )}>Long</button> &nbsp;
        </div>
        <div>
          <span className={clsx("option-label", {disabled: mode === "quote"})}>Optional: </span> 
          <button className={clsx("selector", {disabled: mode === "quote", "active-selector" : numbered === true})} onClick={() => {setNumbered(prev => !prev)}}>
            <div className="numbers icon"></div>Numbers</button>
          <button className={clsx("selector", {disabled: mode === "quote", "active-selector" : punctuated === true})} onClick={() => {setPunctuated(prev => !prev)}}>
            <div className="punctuation icon"></div>Punctuation</button>
        </div>
        </div>
        <div className= "m-menu">
            <div className="button-wrapper">
              <button className="m-selector" 
                onClick={()=> setOpenDropdown(prev => prev === "version" ? null: "version")}>
                <div className="version icon"></div> Version
              </button>
              {openDropdown === "version" && (
                <div className="m-dropdown">
                  <button className="btn-first" onClick={() => {getWords(); setOpenDropdown(null)}}>Words</button>
                  <button onClick={() => {getQuote(); setOpenDropdown(null)}}>Quote</button>
                </div>
              )}
            </div>
            <div className="button-wrapper">
              <button className="m-selector" 
            onClick={()=> setOpenDropdown(prev => prev === "length" ? null: "length")}>
               <div className="length icon"></div> Length
            </button>
            {openDropdown === "length" && (
              <div className="m-dropdown">
                <button className="btn-first" onClick={() => {setLength(prev => prev === null || prev === "medium" || prev === "long" ? "short" : null ); setOpenDropdown(null)}}>Short</button>
                <button onClick={() => {setLength(prev => prev === null || prev === "short" || prev === "long" ? "medium" : null ); setOpenDropdown(null)}}>Medium</button>
                <button onClick={() => {setLength(prev => prev === null || prev === "short" || prev === "medium" ? "long" : null ); setOpenDropdown(null)}}>Long</button>
              </div>
            )}
            </div>
            <div className="button-wrapper">
              <button className="m-selector" 
              onClick={()=> setOpenDropdown(prev => prev === "options" ? null: "options")}>
                <div className="optional icon"></div> Options
              </button>
              {openDropdown === "options" && (
                <div className="m-dropdown">
                  <button className="btn-first" onClick={() => {setNumbered(prev => !prev); setOpenDropdown(null)}}>Numbers</button>
                  <button onClick={() => {setNumbered(prev => !prev); setOpenDropdown(null)}}>Punctuation</button>
                </div>
              )}
            </div>
            
        </div>
      </section>
    )
}