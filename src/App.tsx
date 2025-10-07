import "./App.css"
import {useState} from "react"
import Main from "./components/main"
import Theme from "./components/theme"
import Selector from "./components/selector"
import Charts from "./components/charts"

type textInfo = {
  id: string;
  value: string | null,
  className: string | undefined,
  entered: string | null,
  time: number | null,
}

export default function App() {

  const[theme, setTheme] = useState<string>("dark");
  const [testText, setTestText] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false);
  const [results, SetResults] = useState<textInfo[]>([]);

  return (
    <>
    <header>
      <section className="header-top">
        <button className="title-btn" onClick={() => {
      setFinished(false);
      SetResults([]);
        }}>
          <h1>TypeRighter</h1>
        </button>
        <Theme theme={theme} setTheme={setTheme}/>
      </section>
    <Selector setTestText={setTestText} setFinished={setFinished}theme={theme} />
    </header>
    {finished ? <Charts results={results}/>
    : <Main testText={testText} setFinished={setFinished} setResults={SetResults}/> }
    <footer>
    </footer>
    </>
  )
}

