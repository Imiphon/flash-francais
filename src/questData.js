import {
  questQc,
  questHome,
  questMed,
  questFeel,
  questAct,
} from "./content-base";

import { questAnswersDE } from "./lang-de";
import { questAnswersEN } from "./lang-en";
import { questAnswersSP } from "./lang-sp";

function mergeData(baseArray, answersArray) {
  return baseArray.map((item) => {
    const answerObj = answersArray.find((a) => a.id === item.id);
    return {
      ...item,
      answer: answerObj ? answerObj.answer : "",
    };
  });
}

export function getQuestData(lang, theme) {
  let baseData = [];
  let answers = [];

  switch (theme) {
    case "qc":
      baseData = questQc;
      break;
    case "home":
      baseData = questHome;
      break;
    case "med":
      baseData = questMed;
      break;
    case "feel":
      baseData = questFeel;
      break;
    case "act":
      baseData = questAct;
      break;
    default:
      baseData = [];
  }

  switch (lang) {
    case "de-DE":
      answers = questAnswersDE[theme]; //["theme"] is 'value' from select in nav
      break;
    case "en-US":
      answers = questAnswersEN[theme];
      break;
    case "es-ES":
      answers = questAnswersSP[theme];
      break;
    default:
      answers = [];
  }

  return mergeData(baseData, answers);
}

// current card of course id
export function getCurrentCard(data, activeCardId) {
  return data.find((q) => q.id === activeCardId);
}
