import type { Language } from "@/lib/validations";

type TranslationKey =
  | "appName"
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
  | "errorAlreadySubmitted"
  | "errorInsufficientQuestions"
  | "installPrompt"
  | "install"
  | "close"
  | "navHome"
  | "back"
  | "trustLine"
  | "guidelinesTitle"
  | "guidelinesSubtitle"
  | "readArticle"
  | "prevArticle"
  | "nextArticle"
  | "startFromGuideline"
  | "offlineTitle"
  | "offlineMessage"
  | "noExplanation"
  | "pageNotFound"
  | "pageNotFoundHint"
  | "errorTitle"
  | "errorHint"
  | "tryAgainAction";

const en: Record<TranslationKey, string> = {
  appName: "DrivePrep",
  homeTitle: "Practice for Your Driving Test",
  homeSubtitle:
    "Master Pakistan's traffic rules and signs with 247+ practice MCQs. No account required.",
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
  startTest: "Start Test — 20 Questions",
  questionOf: "Question {current} of {total}",
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
  errorAlreadySubmitted: "This test has already been submitted.",
  errorInsufficientQuestions: "Not enough questions available. Please try again later.",
  installPrompt: "Install app for quick access",
  install: "Install",
  close: "Close",
  navHome: "Home",
  back: "Back",
  trustLine: "No account required · 20 questions · Free practice",
  guidelinesTitle: "Driving Guidelines",
  guidelinesSubtitle: "Study official-style driving rules before your practice test.",
  readArticle: "Read",
  prevArticle: "Previous",
  nextArticle: "Next",
  startFromGuideline: "Start Practice Test",
  offlineTitle: "You're offline",
  offlineMessage: "Check your connection and try again. Quiz submission requires internet.",
  noExplanation: "No explanation available for this question.",
  pageNotFound: "Page not found",
  pageNotFoundHint: "The page you requested does not exist or may have moved.",
  errorTitle: "Something went wrong",
  errorHint: "Please try again. If the problem continues, check your connection.",
  tryAgainAction: "Try again",
};

const ur: Record<TranslationKey, string> = {
  appName: "DrivePrep",
  homeTitle: "اپنے ڈرائیونگ ٹیسٹ کی تیاری کریں",
  homeSubtitle:
    "انگریزی اور اردو میں موک ٹیسٹ کے ذریعے ڈرائیونگ لائسنس امتحان کی تیاری کریں۔",
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
  startTest: "ٹیسٹ شروع کریں — 20 سوالات",
  questionOf: "سوال {current} از {total}",
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
  errorAlreadySubmitted: "یہ ٹیسٹ پہلے ہی جمع ہو چکا ہے۔",
  errorInsufficientQuestions: "کافی سوالات دستیاب نہیں۔ بعد میں دوبارہ کوشش کریں۔",
  installPrompt: "فوری رسائی کے لیے ایپ انسٹال کریں",
  install: "انسٹال",
  close: "بند",
  navHome: "ہوم",
  back: "واپس",
  trustLine: "اکاؤنٹ نہیں چاہیے · 20 سوالات · مفت مشق",
  guidelinesTitle: "ڈرائیونگ ہدایات",
  guidelinesSubtitle: "پریکٹس ٹیسٹ سے پہلے سرکاری انداز کے قوانین پڑھیں۔",
  readArticle: "پڑھیں",
  prevArticle: "پچھلا",
  nextArticle: "اگلا",
  startFromGuideline: "پریکٹس ٹیسٹ شروع کریں",
  offlineTitle: "آپ آف لائن ہیں",
  offlineMessage: "کنکشن چیک کریں۔ کوئز جمع کرنے کے لیے انternet ضروری ہے۔",
  noExplanation: "اس سوال کی وضاحت دستیاب نہیں۔",
  pageNotFound: "صفحہ نہیں ملا",
  pageNotFoundHint: "درخواست کردہ صفحہ موجود نہیں یا منتقل ہو چکا ہے۔",
  errorTitle: "کچھ غلط ہو گیا",
  errorHint: "دوبارہ کوشش کریں۔ اگر مسئلہ برقرار رہے تو اپنا انternet چیک کریں۔",
  tryAgainAction: "دوبارہ کوشش",
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
