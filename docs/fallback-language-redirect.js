const preferredLang = window.navigator.languages ? window.navigator.languages[0] : window.navigator.language;
if (preferredLang.startsWith('nl')) {
	window.location.href = '/nl/';
} else {
	window.location.href = '/en/';
}