import { useState, useRef, useEffect } from "react";
import PrivacyPolicy from "./PrivacyPolicy";
import "./style-navigation.css";

export default function Navigation({
  onChangeLang,
  onChangeTheme,
  lang,
  theme,
}) {
  const [isDropdown, setIsDropdown] = useState(false);
  const [isPrivacy, setIsPrivacy] = useState(false);
  const dropdownRef = useRef(null);

  function handleDropdown() {
    setIsDropdown((prevState) => !prevState);
  }
  function handlePrivacy() {
    setIsPrivacy((prevState) => !prevState);
  }

  function Selectors(){
    return (
      <>
         <div className="select-nav">
          <label>leçon: </label>
          <select value={theme} onChange={onChangeTheme}>
            <option value="qc">Québécois</option>
            <option value="home">à la maison</option>
            <option value="feel">Je me sens</option>
            <option value="med">Chez le médecin</option>
            <option value="act">J'agis</option>
          </select>
        </div>
        <div className="select-nav">
          <label>ma langue: </label>
          <select value={lang} onChange={onChangeLang}>
            <option value="de-DE">allemand</option>
            <option value="en-US">anglais</option>
            <option value="es-ES">espagnol</option>
          </select>
        </div>
      </>
    );
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="nav-frame">
      <div className="nav-left">
        <img
          src={process.env.PUBLIC_URL + "/assets/images/favicon.png"}
          alt="logo"
        />

        <span>FLASH FRANÇAISE</span>
      </div>

      <div className="nav-center row">
        < Selectors />
      </div>

      <div className="nav-right">
        <img
          src={process.env.PUBLIC_URL + "/assets/images/activity-feed-64.png"}
          alt="Burger"
          onClick={handleDropdown}
        />
        {isDropdown && (
          <div className="dropdown" ref={dropdownRef}>
            < Selectors />
            <div style={{ cursor: "pointer" }} onClick={setIsPrivacy}>
              Privacy Policy
            </div>
            {isPrivacy && (
              <div className="modal" onClick={handlePrivacy}>
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="close" onClick={handlePrivacy}>
                    &times;
                  </span>
                  <PrivacyPolicy />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
