const preferredLang = window.navigator.languages ? window.navigator.languages[0] : window.navigator.language;
if (preferredLang.startsWith('nl')) {
    window.location.href = '/nl/';
} else if (preferredLang.startsWith('de')) {
    window.location.href = '/de/';
} else {
    window.location.href = '/en/';
}