export const LOCALES = ["en", "hi", "pt"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  pt: "Português",
};

export const dictionaries: Record<Locale, Record<string, string>> = {
  en: {
    appName: "InfraPulse",
    appTagline: "Report infrastructure issues by voice or text",
    skipToChat: "Skip to chat",
    language: "Language",
    languageSelector: "Choose language",
    newsToggle: "Local infrastructure news",
    newsTitle: "Local updates",
    newsClose: "Close news panel",
    newsEmpty: "No local updates right now.",
    chatRegion: "Citizen feedback chat",
    welcomeTitle: "Tell us what needs fixing",
    welcomeBody:
      "Describe a water, power, road, or other public infrastructure problem. You can type or record a voice note. Location is optional and only used to place the report on the map.",
    composerLabel: "Your message",
    composerPlaceholder: "Example: The water pump in Ward 12 has been dry for three days…",
    send: "Send report",
    sending: "Sending…",
    record: "Record voice note",
    stopRecording: "Stop recording",
    submitRecording: "Submit recording",
    discardRecording: "Discard recording",
    recording: "Recording",
    recordingDuration: "Recording duration",
    waveform: "Live microphone waveform",
    micDenied:
      "Microphone access was denied. You can still type your report, or allow the microphone in the browser.",
    micUnsupported: "This browser does not support audio recording. Please type your report.",
    tooShort: "Please write at least 5 characters so we can process the report.",
    locationHint: "Using your location helps policymakers see the hotspot. You can decline.",
    statusLive: "Submission status",
    successTitle: "Report received",
    successBody: "Category: {category}. Severity: {severity}/5. Status: {status}.",
    reviewRequired:
      "We saved your report for manual review because the AI could not classify it confidently.",
    errorTitle: "Could not send the report",
    errorBody: "Please try again in a moment. If this continues, type a shorter description.",
    you: "You",
    assistant: "InfraPulse",
    retry: "Try again",
    errorPageTitle: "Something went wrong",
    errorPageBody: "The citizen portal hit an unexpected error.",
  },
  hi: {
    appName: "InfraPulse",
    appTagline: "आवाज़ या टेक्स्ट से बुनियादी सुविधाओं की समस्या बताएँ",
    skipToChat: "चैट पर जाएँ",
    language: "भाषा",
    languageSelector: "भाषा चुनें",
    newsToggle: "स्थानीय अवसंरचना समाचार",
    newsTitle: "स्थानीय अपडेट",
    newsClose: "समाचार पैनल बंद करें",
    newsEmpty: "अभी कोई स्थानीय अपडेट नहीं है।",
    chatRegion: "नागरिक प्रतिक्रिया चैट",
    welcomeTitle: "बताएँ क्या ठीक करना है",
    welcomeBody:
      "पानी, बिजली, सड़क या अन्य सार्वजनिक सुविधा की समस्या लिखें या आवाज़ में रिकॉर्ड करें। स्थान वैकल्पिक है और केवल मानचित्र पर रिपोर्ट रखने के लिए उपयोग होता है।",
    composerLabel: "आपका संदेश",
    composerPlaceholder: "उदाहरण: वार्ड 12 का पानी का पंप तीन दिनों से सूखा है…",
    send: "रिपोर्ट भेजें",
    sending: "भेजा जा रहा है…",
    record: "आवाज़ रिकॉर्ड करें",
    stopRecording: "रिकॉर्डिंग रोकें",
    submitRecording: "रिकॉर्डिंग भेजें",
    discardRecording: "रिकॉर्डिंग हटाएँ",
    recording: "रिकॉर्ड हो रहा है",
    recordingDuration: "रिकॉर्डिंग अवधि",
    waveform: "माइक्रोफ़ोन तरंग",
    micDenied:
      "माइक्रोफ़ोन की अनुमति नहीं मिली। आप फिर भी लिख सकते हैं, या ब्राउज़र में माइक्रोफ़ोन चालू करें।",
    micUnsupported: "यह ब्राउज़र ऑडियो रिकॉर्डिंग नहीं चलाता। कृपया लिखकर भेजें।",
    tooShort: "रिपोर्ट प्रोसेस करने के लिए कम से कम 5 अक्षर लिखें।",
    locationHint: "स्थान से नीति-निर्माताओं को हॉटस्पॉट दिखता है। आप मना कर सकते हैं।",
    statusLive: "भेजने की स्थिति",
    successTitle: "रिपोर्ट मिल गई",
    successBody: "श्रेणी: {category}. गंभीरता: {severity}/5. स्थिति: {status}.",
    reviewRequired:
      "एआई वर्गीकरण सुनिश्चित नहीं कर सका, इसलिए रिपोर्ट मैन्युअल समीक्षा के लिए सहेज ली गई है।",
    errorTitle: "रिपोर्ट नहीं भेजी जा सकी",
    errorBody: "थोड़ी देर बाद फिर कोशिश करें। समस्या बनी रहे तो छोटा विवरण लिखें।",
    you: "आप",
    assistant: "InfraPulse",
    retry: "फिर कोशिश करें",
    errorPageTitle: "कुछ गलत हो गया",
    errorPageBody: "नागरिक पोर्टल में अप्रत्याशित त्रुटि आई।",
  },
  pt: {
    appName: "InfraPulse",
    appTagline: "Relate problemas de infraestrutura por voz ou texto",
    skipToChat: "Ir para o chat",
    language: "Idioma",
    languageSelector: "Escolher idioma",
    newsToggle: "Notícias locais de infraestrutura",
    newsTitle: "Atualizações locais",
    newsClose: "Fechar painel de notícias",
    newsEmpty: "Não há atualizações locais no momento.",
    chatRegion: "Chat de feedback cidadão",
    welcomeTitle: "Diga o que precisa ser consertado",
    welcomeBody:
      "Descreva um problema de água, energia, estradas ou outra infraestrutura pública. Você pode digitar ou gravar um áudio. A localização é opcional e só posiciona o relato no mapa.",
    composerLabel: "Sua mensagem",
    composerPlaceholder:
      "Exemplo: A bomba d’água do bairro 12 está seca há três dias…",
    send: "Enviar relato",
    sending: "Enviando…",
    record: "Gravar áudio",
    stopRecording: "Parar gravação",
    submitRecording: "Enviar gravação",
    discardRecording: "Descartar gravação",
    recording: "Gravando",
    recordingDuration: "Duração da gravação",
    waveform: "Forma de onda do microfone",
    micDenied:
      "O acesso ao microfone foi negado. Você ainda pode digitar, ou permitir o microfone no navegador.",
    micUnsupported:
      "Este navegador não suporta gravação de áudio. Por favor, digite o relato.",
    tooShort: "Escreva pelo menos 5 caracteres para processarmos o relato.",
    locationHint:
      "A localização ajuda os gestores a ver o foco do problema. Você pode recusar.",
    statusLive: "Status do envio",
    successTitle: "Relato recebido",
    successBody: "Categoria: {category}. Gravidade: {severity}/5. Status: {status}.",
    reviewRequired:
      "Guardamos o relato para revisão manual porque a IA não classificou com confiança.",
    errorTitle: "Não foi possível enviar o relato",
    errorBody: "Tente de novo em instantes. Se continuar, envie uma descrição mais curta.",
    you: "Você",
    assistant: "InfraPulse",
    retry: "Tentar de novo",
    errorPageTitle: "Algo deu errado",
    errorPageBody: "O portal cidadão encontrou um erro inesperado.",
  },
};

export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? "")
  );
}
