import { useState, useEffect, useRef } from "react";
import { getQuestData, getCurrentCard } from "./questData";


export default function FlashCards({ lang, theme }) {
  const [activeCardId, setActiveCardId] = useState(1);
  const [isFlipped, setFlipped] = useState(false);
  const [isFront, setIsFront] = useState(true);
  const [showExpl, setShowExpl] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);
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

  function handleToggleSide() {
    setIsFront((prev) => !prev);
  }

  function handleFlipp() {
    setFlipped((prev) => !prev);
  }

  function handleExplanation() {
    setShowExpl((prev) => !prev);
  }

  function handleBtnColor(){
    setIsBlue((prev) => !prev);
  }

  // 1) Window Resize -> setIsSmallScreen
  useEffect(() => {
    function checkScreenSize() {
      setIsSmallScreen(window.innerWidth <= 640);
    }
    // call with start
    checkScreenSize();

    // update with every rezise
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // 2) Click-Outside, only on Mobile
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        flashFrameRef.current &&
        !flashFrameRef.current.contains(e.target)
      ) {
        setShowExpl(false);
      }
    }
    if (isSmallScreen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      if (isSmallScreen) {
        document.removeEventListener("click", handleClickOutside);
      }
    };
  }, [isSmallScreen]);

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
      >
        {showExpl ? (
          <p className="expl-p">{currentCard.expl}</p>
        ) : (
          <p className="first-p">
            {isFlipped ? currentCard.answer : currentCard.question}
          </p>
        )}
        {currentCard.expl && !isFlipped && (
          <button
            className="expl-btn" style={!isBlue ? {backgroundColor:"red"}: {}}
            // HOVER on monitor
            onMouseEnter={(e) => {
              if (!isSmallScreen) {
                e.stopPropagation();
                handleExplanation();
              }
            }}
            onMouseLeave={(e) => {
              if (!isSmallScreen) {
                e.stopPropagation();
                handleExplanation();
              }
            }}
            // CLICK on mobile
            onClick={(e) => {
              if (isSmallScreen) {
                e.stopPropagation();
                handleExplanation();
                handleBtnColor();
              }
            }}
          >
            ?
          </button>
        )}
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
