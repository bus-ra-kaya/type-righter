import "./App.css"
import {useState} from "react"
import Main from "./components/main"
import Theme from "./components/theme"
import Selector from "./components/selector"

export default function App() {

  const[theme, setTheme] = useState<string>("dark");
  const [testText, setTestText] = useState<string>("");
  const [finished,setFinished] = useState<boolean>(false);

  const mockStats = {
  wpm: Math.floor(Math.random() * 120) + 20,        // 20–140 WPM
  accuracy: Math.floor(Math.random() * 20) + 80,    // 80–100%
  chars: Math.floor(Math.random() * 1000) + 200,   // 200–1200 chars
  topSpeed: Math.floor(Math.random() * 200) + 50,  // 50–250 WPM
};


  return (
    <>
    <header>
      <section className="header-top">
        <div className="logo">
          <img src={`/${theme}/logo.svg`} alt="keyboard-icon" />
          <h1 className="title">TypeRighter</h1>
        </div>
        <Theme theme={theme} setTheme={setTheme}/>
      </section>
    <Selector setTestText={setTestText} theme={theme} />

    </header>
    <Main testText={testText}/>
  
    <footer>
    </footer>
    </>
  )
}

