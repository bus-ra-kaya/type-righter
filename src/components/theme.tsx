import {useState,useEffect} from "react"

interface ThemeProps {
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export default function Theme ({theme,setTheme}:ThemeProps) {

      const [open, setOpen] = useState<boolean>(false);
    
      const themes = ["light","dark","navy","cupcake"];
    
      useEffect(() => {
        document.body.setAttribute("data-theme",theme);
      }, [theme])
    
    return (
      <>
      {open && <div className="dropdown-overlay" onClick={() => setOpen(false)}></div>}
        <div className="dropdown">

         <button title="Choose theme" className="dropdown-toggle" onClick={() => setOpen(prev => !prev)}>
          <div className="theme-selector"></div>
        </button>

        {open && (
          <div className="dropdown-menu">
            {themes.map((t) => (
              <button className={`${t}-btn`}
                key={t}
                onClick= {() => {
                  setTheme(t);
                  setOpen(false);
                }}>
                <span>
                  {t}
                </span>
              </button>
            ))}

          </div>
        )}
        </div>
         </>
    )
}