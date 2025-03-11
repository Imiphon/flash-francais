import { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { getQuestData, getCurrentCard } from "./questData";

export default function FlashCards({ lang, theme }) {
  const [activeCardId, setActiveCardId] = useState(1);
  const [isFlipped, setFlipped] = useState(false);
  const [isFront, setIsFront] = useState(true);
  const [isShowExpl, setIsShowExpl] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isBlue, setIsBlue] = useState(true);

  const flashFrameRef = useRef(null);
  const data = getQuestData(lang, theme);
  const currentCard = getCurrentCard(data, activeCardId);

  function handlePrev() {
    if (activeCardId > 1) {
      setActiveCardId(activeCardId - 1);
      setFlipped(isFront ? false : true);
    }
  }

  function handleNext() {
    if (activeCardId < data.length) {
      setActiveCardId(activeCardId + 1);
      setFlipped(isFront ? false : true);
    }
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isShowExpl) handleNext();
    },
    onSwipedRight: () => {
      if (!isShowExpl) handlePrev();
    },
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
    threshold: 15,
  });

  function handleToggleSide() {
    if (isShowExpl) return;
    setIsFront((prev) => !prev);
    setIsShowExpl(false);
  }

  function handleFlipp() {
    setIsShowExpl(false);
    setIsBlue(true);
    setFlipped((prev) => !prev);
  }

  function handleExplanation() {
    setIsShowExpl((prev) => !prev);
    setIsBlue((prev) => !prev);
  }

  function handleSlide(e) {
    const newVal = parseInt(e.target.value, 10);
    setActiveCardId(newVal);
    setIsFront(true);
    setFlipped(false);
    setIsShowExpl(false);
    setIsBlue(true);
  }


  // Optional: Stimme, Lautstärke, Sprechgeschwindigkeit und Tonhöhe anpassen
  // utterance.volume = 1; // 0 bis 1
  // utterance.rate = 1;   // 0.1 bis 10
  // utterance.pitch = 1;  // 0 bis 2
  function handlePlay(e) {
    e.stopPropagation();
  
    const textToPlay = isShowExpl 
      ? currentCard.expl 
      : (isFlipped ? currentCard.answer : currentCard.question);
      
    let langCode = isFlipped ? lang : "fr-CA";
   
    const utterance = new SpeechSynthesisUtterance(textToPlay);
    utterance.lang = langCode;
    let voices = window.speechSynthesis.getVoices();
    if (!voices.length) {//wait for cur lang
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.lang === langCode);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        window.speechSynthesis.speak(utterance);
      };
    } else {
      const selectedVoice = voices.find(v => v.lang === langCode);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  }
  

  // 1) Window Resize -> setIsSmallScreen
  useEffect(() => {
    function checkScreenSize() {
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
      setIsTouch(hasTouch);
    }
    // call with start
    checkScreenSize();

    // update with every rezise
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);
  
  return (
    <div className="flash-frame" ref={flashFrameRef}>
      <div style={{ marginBottom: "12px", fontSize: "12px" }} className="row">
        <span style={{ color: "#ffdaac" }}>Commence avec </span>
        <button
          onClick={handleToggleSide}
          className={!isFront ? "selected" : ""}
        >
          l'autre côté
        </button>
      </div>

      <div
        className={`flashcard ${isFlipped ? "selected" : ""}`}
        onClick={handleFlipp}
        {...swipeHandlers}
      >
        {isShowExpl ? (
          <p className="expl-p">{currentCard.expl}</p>
        ) : (
          <p className="first-p">
            {isFlipped ? currentCard.answer : currentCard.question}
          </p>
        )}
        {currentCard.expl && !isFlipped && (
          
          <button
            className="expl-btn"
            style={!isBlue ? { backgroundColor: "red" } : {}}
            // HOVER on monitor
            onMouseEnter={(e) => {
              if (!isTouch) {
                e.stopPropagation();
                handleExplanation();
              }
            }}
            onMouseLeave={(e) => {
              if (!isTouch) {
                e.stopPropagation();
                handleExplanation();
              }
            }}
            // CLICK on mobile
            onClick={(e) => {
              if (isTouch) {
                e.stopPropagation();
                handleExplanation();
                console.log("click ");
              }
            }}
          >
            ?
          </button>
        )}
        <button className="play-btn" onClick={(e)=>handlePlay(e)}>
        <img src={process.env.PUBLIC_URL + "/assets/images/play-white.png"} alt="play"/>
        </button>
      </div>

      <div className="slider-frame">
        <input
          type="range"
          min="1"
          max={data.length}
          value={activeCardId}
          onChange={(e) => {
            handleSlide(e);
          }}
        ></input>
        <span>Card Nr.: {activeCardId}</span>
      </div>

      <div className="row">
        <button style={{ margin: "24px" }} onClick={handlePrev}>
          Previous
        </button>
        <button style={{ margin: "24px" }} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}
