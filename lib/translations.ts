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
  | "darkMode"
  | "navSignTest"
  | "navSigns"
  | "navFees"
  | "navLearn"
  | "navAbout"
  | "navContact"
  | "startSignTest"
  | "learnSigns"
  | "rulesPractice"
  | "chooseLicense"
  | "signTestTitle"
  | "signTestSubtitle"
  | "startSignTestCta"
  | "signsTitle"
  | "signsSubtitle"
  | "searchSigns"
  | "allCategories"
  | "noSignsFound"
  | "relatedPractice"
  | "feesTitle"
  | "feesSubtitle"
  | "province"
  | "purpose"
  | "duration"
  | "lateFee"
  | "lateFeeAmount"
  | "calculateFee"
  | "estimatedTotal"
  | "baseFee"
  | "aboutTitle"
  | "aboutBody"
  | "contactTitle"
  | "contactSubtitle"
  | "contactName"
  | "contactEmail"
  | "contactMessage"
  | "contactSend"
  | "contactThanks"
  | "retrySignTest"
  | "sessionExpired"
  | "homeCategories"
  | "passNeed"
  | "reviewWrongOnly"
  | "reviewAll"
  | "feeOfficialSources"
  | "years"
  | "ownedBy"
  | "ownerContact"
  | "speechSpeaker"
  | "speechMic"
  | "speechReplay"
  | "speechMicHint"
  | "speechListening"
  | "speechUnsupported";

const en: Record<TranslationKey, string> = {
  appName: "RaahPass",
  appTagline: "Pass your driving test",
  homeTitle: "Your Road to a Driving Licence",
  homeSubtitle:
    "From OK Driving School, Islamabad. Practice Pakistan traffic signs and road rules — free, no account.",
  startPractice: "Rules Practice",
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
  trustLine: "No account required · Sign test + rules · Free practice",
  guidelinesTitle: "Driving Guidelines",
  guidelinesSubtitle: "Study official-style driving rules before your practice test.",
  navSignTest: "Sign Test",
  navSigns: "Signs",
  navFees: "Fees",
  navLearn: "Learn",
  navAbout: "About",
  navContact: "Contact",
  startSignTest: "Start Sign Test",
  learnSigns: "Learn Traffic Signs",
  rulesPractice: "Rules Practice",
  chooseLicense: "Choose license type",
  signTestTitle: "Computerized Sign Test",
  signTestSubtitle:
    "Practice the e-sign test with real Pakistan traffic signs. Score is not saved — session only.",
  startSignTestCta: "Start Sign Test — 20 Questions",
  signsTitle: "Traffic Signs",
  signsSubtitle: "Browse and search Pakistan road signs before your test.",
  searchSigns: "Search signs…",
  allCategories: "All",
  noSignsFound: "No signs match your search.",
  relatedPractice: "Practice this sign",
  feesTitle: "License Fee Calculator",
  feesSubtitle: "Estimate driving license fees by province and type.",
  province: "Province / region",
  purpose: "Purpose",
  duration: "Duration (years)",
  lateFee: "Include estimated late fee (15%)",
  lateFeeAmount: "Late fee",
  calculateFee: "Calculate",
  estimatedTotal: "Estimated total",
  baseFee: "Base fee",
  aboutTitle: "About RaahPass",
  aboutBody:
    "RaahPass is owned by OK Driving School (Islamabad). Practice Pakistan traffic signs and road rules in English and Urdu — free, no account needed.",
  contactTitle: "Contact",
  contactSubtitle: "Questions or feedback? Send us a message.",
  contactName: "Your name",
  contactEmail: "Email",
  contactMessage: "Message",
  contactSend: "Send message",
  contactThanks: "Thanks — WhatsApp will open with your message to OK Driving School.",
  retrySignTest: "Retry Sign Test",
  sessionExpired: "This sign test session expired. Start a new test.",
  homeCategories: "Practice by license type",
  passNeed: "You need {needed}/{total} correct (70%) to pass.",
  reviewWrongOnly: "Wrong only",
  reviewAll: "All answers",
  feeOfficialSources: "Check official sources",
  years: "years",
  ownedBy: "Product of",
  ownerContact: "OK Driving School contact",
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
  speechSpeaker: "Speaker",
  speechMic: "Mic",
  speechReplay: "Read again",
  speechMicHint: "Say A, B, C or the answer text",
  speechListening: "Listening…",
  speechUnsupported: "Voice not supported in this browser",
};

const ur: Record<TranslationKey, string> = {
  appName: "راہ پاس",
  appTagline: "ڈرائیونگ ٹیسٹ پاس کریں",
  homeTitle: "ڈرائیونگ لائسنس کا راستہ",
  homeSubtitle:
    "اوکے ڈرائیونگ اسکول، اسلام آباد کی پروڈکٹ۔ پاکستان ٹریفک سائنز اور قوانین کی مشق — مفت، بغیر اکاؤنٹ۔",
  startPractice: "قوانین کی مشق",
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
  trustLine: "اکاؤنٹ نہیں چاہیے · سائن ٹیسٹ + قوانین · مفت مشق",
  guidelinesTitle: "ڈرائیونگ ہدایات",
  guidelinesSubtitle: "پریکٹس ٹیسٹ سے پہلے سرکاری انداز کے قوانین پڑھیں۔",
  navSignTest: "سائن ٹیسٹ",
  navSigns: "سائنز",
  navFees: "فیس",
  navLearn: "سیکھیں",
  navAbout: "تعارف",
  navContact: "رابطہ",
  startSignTest: "سائن ٹیسٹ شروع کریں",
  learnSigns: "ٹریفک سائنز سیکھیں",
  rulesPractice: "قوانین کی مشق",
  chooseLicense: "لائسنس کی قسم منتخب کریں",
  signTestTitle: "کمپیوٹرائزڈ سائن ٹیسٹ",
  signTestSubtitle:
    "حقیقی پاکستان ٹریفک سائنز کے ساتھ ای سائن ٹیسٹ کی مشق۔ اسکور محفوظ نہیں ہوتا — صرف اس سیشن میں۔",
  startSignTestCta: "سائن ٹیسٹ شروع کریں — 20 سوالات",
  signsTitle: "ٹریفک سائنز",
  signsSubtitle: "ٹیسٹ سے پہلے پاکستان روڈ سائنز تلاش کریں اور دیکھیں۔",
  searchSigns: "سائنز تلاش کریں…",
  allCategories: "تمام",
  noSignsFound: "کوئی سائن نہیں ملی۔",
  relatedPractice: "اس سائن کی مشق",
  feesTitle: "لائسنس فیس کیلکولیٹر",
  feesSubtitle: "صوبہ اور قسم کے مطابق ڈرائیونگ لائسنس فیس کا اندازہ۔",
  province: "صوبہ / علاقہ",
  purpose: "مقصد",
  duration: "مدت (سال)",
  lateFee: "اندازاً لیٹ فیس شامل کریں (15%)",
  lateFeeAmount: "لیٹ فیس",
  calculateFee: "حساب کریں",
  estimatedTotal: "اندازاً کل",
  baseFee: "بنیادی فیس",
  aboutTitle: "راہ پاس کے بارے میں",
  aboutBody:
    "راہ پاس اوکے ڈرائیونگ اسکول (اسلام آباد) کی پروڈکٹ ہے۔ پاکستان ٹریفک سائنز اور قوانین کی دو زبانی مشق — مفت، بغیر اکاؤنٹ۔",
  contactTitle: "رابطہ",
  contactSubtitle: "سوال یا رائے؟ ہمیں پیغام بھیجیں۔",
  contactName: "آپ کا نام",
  contactEmail: "ای میل",
  contactMessage: "پیغام",
  contactSend: "پیغام بھیجیں",
  contactThanks: "شکریہ — آپ کا پیغام واٹس ایپ پر اوکے ڈرائیونگ اسکول کو بھیجا جائے گا۔",
  retrySignTest: "سائن ٹیسٹ دوبارہ کریں",
  sessionExpired: "یہ سائن ٹیسٹ سیشن ختم ہو گیا۔ نیا ٹیسٹ شروع کریں۔",
  homeCategories: "لائسنس کی قسم کے مطابق مشق",
  passNeed: "پاس کے لیے {needed}/{total} درست جوابات (70%) درکار ہیں۔",
  reviewWrongOnly: "صرف غلط",
  reviewAll: "تمام جوابات",
  feeOfficialSources: "سرکاری ذرائع دیکھیں",
  years: "سال",
  ownedBy: "پروڈکٹ از",
  ownerContact: "اوکے ڈرائیونگ اسکول کا رابطہ",
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
  speechSpeaker: "اسپیکر",
  speechMic: "مائیک",
  speechReplay: "دوبارہ سنیں",
  speechMicHint: "اے، بے، سین یا جواب بولیں",
  speechListening: "سن رہا ہے…",
  speechUnsupported: "اس براؤزر میں آواز دستیاب نہیں",
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
