import type { Language } from "@/lib/validations";

type TranslationKey =
  | "appName"
  | "appTagline"
  | "homeTitle"
  | "homeSubtitle"
  | "startPractice"
  | "readGuidelines"
  | "language"
  | "english"
  | "urdu"
  | "startTestTitle"
  | "driverExam"
  | "name"
  | "phone"
  | "namePlaceholder"
  | "phonePlaceholder"
  | "privacyNote"
  | "startTest"
  | "questionOf"
  | "timeRemaining"
  | "timeUp"
  | "previous"
  | "next"
  | "submitTest"
  | "submitting"
  | "allQuestionsRequired"
  | "congratulations"
  | "tryAgain"
  | "passed"
  | "failed"
  | "score"
  | "correct"
  | "wrong"
  | "viewReview"
  | "newTest"
  | "answerReview"
  | "yourAnswer"
  | "correctAnswer"
  | "explanation"
  | "backToResult"
  | "loading"
  | "errorNotFound"
  | "attemptNotFoundHint"
  | "errorAlreadySubmitted"
  | "errorInsufficientQuestions"
  | "installPrompt"
  | "install"
  | "installing"
  | "installHintAndroid"
  | "installHintIos"
  | "installHintDesktop"
  | "installFailedRetry"
  | "close"
  | "navHome"
  | "back"
  | "guidelinesNav"
  | "trustLine"
  | "guidelinesTitle"
  | "guidelinesSubtitle"
  | "readArticle"
  | "prevArticle"
  | "nextArticle"
  | "startFromGuideline"
  | "guidelineSources"
  | "opensInNewTab"
  | "offlineTitle"
  | "offlineMessage"
  | "noExplanation"
  | "pageNotFound"
  | "pageNotFoundHint"
  | "errorTitle"
  | "errorHint"
  | "tryAgainAction"
  | "lightMode"
  | "darkMode";

const en: Record<TranslationKey, string> = {
  appName: "RaahPass",
  appTagline: "Pass your driving test",
  homeTitle: "Your Road to a Driving Licence",
  homeSubtitle:
    "Master Pakistan's traffic rules and signs with 247+ practice questions. Free — no account needed.",
  startPractice: "Start Practice Test",
  readGuidelines: "Driving Guidelines",
  language: "Language",
  english: "English",
  urdu: "Urdu",
  startTestTitle: "Start Practice Test",
  driverExam: "Driver Knowledge Exam",
  name: "Full name",
  phone: "Phone number",
  namePlaceholder: "Enter your name",
  phonePlaceholder: "03XX XXXXXXX",
  privacyNote:
    "Your name and phone are saved with this attempt for practice records and optional follow-up from driving guidance providers.",
  startTest: "Start Test — 20 Questions, 10 Minutes",
  questionOf: "Question {current} of {total}",
  timeRemaining: "Time remaining",
  timeUp: "Time's up — submitting your test…",
  previous: "Previous",
  next: "Next",
  submitTest: "Submit Test",
  submitting: "Submitting…",
  allQuestionsRequired: "Answer all 20 questions before submitting.",
  congratulations: "Congratulations, {name}!",
  tryAgain: "Keep practicing, {name}",
  passed: "Passed",
  failed: "Failed",
  score: "Score",
  correct: "Correct",
  wrong: "Wrong",
  viewReview: "View Answer Review",
  newTest: "Start New Test",
  answerReview: "Answer Review",
  yourAnswer: "Your answer",
  correctAnswer: "Correct answer",
  explanation: "Explanation",
  backToResult: "Back to Result",
  loading: "Loading…",
  errorNotFound: "Test attempt not found.",
  attemptNotFoundHint:
    "This session is no longer available — it may have expired or the database was reset. Start a new practice test.",
  errorAlreadySubmitted: "This test has already been submitted.",
  errorInsufficientQuestions: "Not enough questions available. Please try again later.",
  installPrompt: "Install app for quick access",
  install: "Install",
  installing: "Installing…",
  installHintAndroid: "Tap ⋮ (menu) → Install app, or Add to Home screen.",
  installHintIos: "Tap Share → Add to Home Screen.",
  installHintDesktop: "Use your browser menu to install this app.",
  installFailedRetry:
    "Install did not finish. Clear site data for this page, reload, then use ⋮ → Install app.",
  close: "Close",
  navHome: "Home",
  back: "Back",
  guidelinesNav: "Guidelines",
  trustLine: "No account required · 20 questions · 10 minutes · Free practice",
  guidelinesTitle: "Driving Guidelines",
  guidelinesSubtitle: "Study official-style driving rules before your practice test.",
  readArticle: "Read",
  prevArticle: "Previous",
  nextArticle: "Next",
  startFromGuideline: "Start Practice Test",
  guidelineSources: "Official sources",
  opensInNewTab: "(opens in new tab)",
  offlineTitle: "You're offline",
  offlineMessage: "Check your connection and try again. Quiz submission requires internet.",
  noExplanation: "No explanation available for this question.",
  pageNotFound: "Page not found",
  pageNotFoundHint: "The page you requested does not exist or may have moved.",
  errorTitle: "Something went wrong",
  errorHint: "Please try again. If the problem continues, check your connection.",
  tryAgainAction: "Try again",
  lightMode: "Switch to light mode",
  darkMode: "Switch to dark mode",
};

const ur: Record<TranslationKey, string> = {
  appName: "راہ پاس",
  appTagline: "ڈرائیونگ ٹیسٹ پاس کریں",
  homeTitle: "ڈرائیونگ لائسنس کا راستہ",
  homeSubtitle:
    "247+ سوالات کے ساتھ پاکستان کے ٹریفک قوانین سیکھیں۔ مفت — اکاؤنٹ کی ضرورت نہیں۔",
  startPractice: "موک ٹیسٹ شروع کریں",
  readGuidelines: "ڈرائیونگ ہدایات",
  language: "زبان",
  english: "English",
  urdu: "اردو",
  startTestTitle: "پریکٹس ٹیسٹ شروع کریں",
  driverExam: "ڈرائیور نالج امتحان",
  name: "پورا نام",
  phone: "فون نمبر",
  namePlaceholder: "اپنا نام درج کریں",
  phonePlaceholder: "03XX XXXXXXX",
  privacyNote:
    "آپ کا نام اور فون نمبر اس ٹیسٹ کے ساتھ محفوظ کیا جائے گا تاکہ پریکٹس ریکارڈ اور ڈرائیونگ گائیڈنس فراہم کنندگان رابطہ کر سکیں۔",
  startTest: "ٹیسٹ شروع کریں — 20 سوالات، 10 منٹ",
  questionOf: "سوال {current} از {total}",
  timeRemaining: "باقی وقت",
  timeUp: "وقت ختم — ٹیسٹ جمع ہو رہا ہے…",
  previous: "پچھلا",
  next: "اگلا",
  submitTest: "ٹیسٹ جمع کریں",
  submitting: "جمع ہو رہا ہے…",
  allQuestionsRequired: "جمع کرنے سے پہلے تمام 20 سوالات کے جواب دیں۔",
  congratulations: "مبارک ہو، {name}!",
  tryAgain: "مشق جاری رکھیں، {name}",
  passed: "کامیاب",
  failed: "ناکام",
  score: "اسکور",
  correct: "درست",
  wrong: "غلط",
  viewReview: "جوابات کا جائزہ",
  newTest: "نیا ٹیسٹ شروع کریں",
  answerReview: "جوابات کا جائزہ",
  yourAnswer: "آپ کا جواب",
  correctAnswer: "درست جواب",
  explanation: "وضاحت",
  backToResult: "نتیجے پر واپس",
  loading: "لوڈ ہو رہا ہے…",
  errorNotFound: "ٹیسٹ کا ریکارڈ نہیں ملا۔",
  attemptNotFoundHint:
    "یہ سیشن اب دستیاب نہیں — شاید ختم ہو گیا یا ڈیٹا ری سیٹ ہوا۔ نیا پریکٹس ٹیسٹ شروع کریں۔",
  errorAlreadySubmitted: "یہ ٹیسٹ پہلے ہی جمع ہو چکا ہے۔",
  errorInsufficientQuestions: "کافی سوالات دستیاب نہیں۔ بعد میں دوبارہ کوشش کریں۔",
  installPrompt: "فوری رسائی کے لیے ایپ انسٹال کریں",
  install: "انسٹال",
  installing: "انسٹال ہو رہا ہے…",
  installHintAndroid: "⋮ (مینو) → Install app یا Add to Home screen پر ٹیپ کریں۔",
  installHintIos: "Share → Add to Home Screen پر ٹیپ کریں۔",
  installHintDesktop: "براؤزر مینو سے ایپ انسٹال کریں۔",
  installFailedRetry:
    "انسٹال مکمل نہیں ہوا۔ سائٹ ڈیٹا صاف کریں، صفحہ دوبارہ لوڈ کریں، پھر ⋮ → Install app استعمال کریں۔",
  close: "بند",
  navHome: "ہوم",
  back: "واپس",
  guidelinesNav: "ہدایات",
  trustLine: "اکاؤنٹ نہیں چاہیے · 20 سوالات · 10 منٹ · مفت مشق",
  guidelinesTitle: "ڈرائیونگ ہدایات",
  guidelinesSubtitle: "پریکٹس ٹیسٹ سے پہلے سرکاری انداز کے قوانین پڑھیں۔",
  readArticle: "پڑھیں",
  prevArticle: "پچھلا",
  nextArticle: "اگلا",
  startFromGuideline: "پریکٹس ٹیسٹ شروع کریں",
  guidelineSources: "سرکاری ماخذ",
  opensInNewTab: "(نئی ٹیب میں کھلتا ہے)",
  offlineTitle: "آپ آف لائن ہیں",
  offlineMessage: "کنکشن چیک کریں۔ کوئز جمع کرنے کے لیے انternet ضروری ہے۔",
  noExplanation: "اس سوال کی وضاحت دستیاب نہیں۔",
  pageNotFound: "صفحہ نہیں ملا",
  pageNotFoundHint: "درخواست کردہ صفحہ موجود نہیں یا منتقل ہو چکا ہے۔",
  errorTitle: "کچھ غلط ہو گیا",
  errorHint: "دوبارہ کوشش کریں۔ اگر مسئلہ برقرار رہے تو اپنا انternet چیک کریں۔",
  tryAgainAction: "دوبارہ کوشش",
  lightMode: "روشن موڈ",
  darkMode: "ڈارک موڈ",
};

export function t(lang: Language, key: TranslationKey): string {
  return lang === "ur" ? ur[key] : en[key];
}

export function tf(lang: Language, key: TranslationKey, vars: Record<string, string | number>): string {
  let text = t(lang, key);
  for (const [name, value] of Object.entries(vars)) {
    text = text.replace(`{${name}}`, String(value));
  }
  return text;
}

export function dirForLanguage(lang: Language): "ltr" | "rtl" {
  return lang === "ur" ? "rtl" : "ltr";
}
