import {useState,useEffect} from "react"

interface ThemeProps {
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export default function Theme ({theme,setTheme}:ThemeProps) {

      const [open, setOpen] = useState<boolean>(false);
    
      const themes = ["light","dark","matcha","navy"];
    
      useEffect(() => {
        document.body.setAttribute("data-theme",theme);
      }, [theme])
    
    return (
        <>
         {
          <button className="dropdown-toggle" onClick={() => setOpen(prev => !prev)}>
          <img className="theme-selector" src={`../${theme}/color-selector.svg`} alt="theme selector" />
        </button>
         }

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
        </>
    )
}