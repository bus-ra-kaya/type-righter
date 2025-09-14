import "./App.css"
import {useState} from "react"
import Main from "./components/main"
import Theme from "./components/theme.tsx"
import Selector from "./components/selector.tsx"

export default function App() {

  const[theme, setTheme] = useState<string>("dark");
  const [testText, setTestText] = useState<string>("");

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

