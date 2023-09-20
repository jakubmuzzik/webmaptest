import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "../constants"

export const translateLabel = (language, label) => {
    const translateTo = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE
    
    return LABELS[label][translateTo]
}

export const translateLabels = (language, labels) => labels.reduce((out, label) => ({...out, [label] : translateLabel(language, label)}), {}) 

//COUNTRIES / CITIES - TODO - load supported contries / cities from database?
export const BRNO = 'Brno'
export const CESKE_BUDEJOVICE = 'České Budějovice'
export const CHOMUTOV = 'Chomutov'
export const DECIN = 'Děčín'
export const HAVIROV = 'Havířov'
export const HRADEC_KRALOVE = 'Hradec Králové'
export const JABLONEC = 'Jablonec nad Nisou'
export const JIHLAVA = 'Jihlava'
export const KARLOVY = 'Karlovy Vary'
export const KARVINA = 'Karviná'
export const KLADNO = 'Kladno'
export const LIBEREC = 'Liberec'
export const MLADA_BOLESLAV = 'Mladá Boleslav'
export const MOST = 'Most'
export const OLOMOUC = 'Olomouc'
export const OPAVA = 'Opava'
export const OSTRAVA = 'Ostrava'
export const PARDUBICE = 'Pardubice'
export const PLZEN = 'Plzeň'
export const PRAGUE = 'Praha'
export const PREROV = 'Přerov'
export const PROSTEJOV = 'Prostějov'
export const TEPLICE = 'Teplice'
export const TRINEC = 'Třinec'
export const USTI = 'Ústí nad Labem'
export const ZLIN = 'Zlín'


export const CZECH_CITIES = [
    BRNO,
    CESKE_BUDEJOVICE,
    CHOMUTOV,
    DECIN,
    HAVIROV,
    HRADEC_KRALOVE,
    JABLONEC,
    JIHLAVA,
    KARLOVY,
    KARVINA,
    KLADNO,
    LIBEREC,
    MLADA_BOLESLAV,
    MOST,
    OLOMOUC,
    OPAVA,
    OSTRAVA,
    PARDUBICE,
    PLZEN,
    PRAGUE,
    PREROV,
    PROSTEJOV,
    TEPLICE,
    TRINEC,
    USTI,
    ZLIN
]

//LABELS
export const CZECH = 'CZECH'
export const HOME = 'HOME' 
export const CITY = 'CITY'
export const SEARCH = 'SEARCH'
export const SELECT_CITY = 'SELECT_CITY'
export const SIGN_IN = 'SIGN_IN'
export const SIGN_UP = 'SIGN_UP'
export const ANYWHERE = 'ANYWHERE'

export const LABELS = {
    [HOME]: {
        'en': 'Home',
        'cs': 'Doma'
    },
    [CZECH]: {
        'en': 'Czech Republic',
        'cs': 'Česká Republika'
    },
    [CITY]: {
        'en': 'City',
        'cs': 'Město'
    },
    [SEARCH]: {
        'en': 'Search',
        'cs': 'Hledat'
    },
    [SELECT_CITY]: {
        'en': 'Select a city',
        'cs': 'Vybrat město'
    },
    [SIGN_IN]: {
        'en': 'Log in',
        'cs': 'Přihlásit'
    },
    [SIGN_UP]: {
        'en': 'Register',
        'cs': 'Registrace'
    },
    [ANYWHERE]: {
        'en': 'Anywhere',
        'cs': 'Kdekoliv'
    }
}