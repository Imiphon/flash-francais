import "./styles.css";
import { useState } from "react";
import Navigation from "./Navigation";
import FlashCards from "./FlashCards";

export default function App() {
  const [lang, setLang] = useState("de-DE");
  const [theme, setTheme] = useState("qc");

  function handleChangeLang(e) {
    console.log("Language is: ", e.target.value);
    setLang(e.target.value);
  }

  function handleChangeTheme(e) {
    console.log("Theme is: ", e.target.value);
    setTheme(e.target.value);
  }

  return (
    <div className="App">
      <header>
        <Navigation
          lang={lang}
          theme={theme}
          onChangeLang={handleChangeLang}
          onChangeTheme={handleChangeTheme}
        />
      </header>
      <main>
        <FlashCards lang={lang} theme={theme} />
      </main>
    </div>
  );
}
