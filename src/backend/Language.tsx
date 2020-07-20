import { isDev } from "../index";

export interface word {
	active: boolean;
	meanings: string[];
	sumtype: string;
	type: string;
	dialects: { [key: string]: string; };
}

export default class Language {
	name: string = "";
	focus: string = "";

	alphabet: any = [];
	dictionary: { [key: string]: word; } = {};

	wordCount: number = 0;

	hasPhonetics: boolean = false;
	phonetics: any = {};
	phoneticGroupings: { [key: string]: string[]; } = {};

	hasConjugations: boolean = false;
	conjugations: any = {};

	hasEtymologies: boolean = false;
	etymologicalParents: string[] = [];

	hasScript: boolean = false;
	scriptStyle: { [key: string]: string; } = {};
	scriptRules: any = {};

	currentPage: number = 0;
	totalPages: number = 0;
	wordsPerPage: number = 72;

	constructor(language: any, initialize: boolean = false) {
		this.name = language.name;
		this.focus = language.focus;

		this.alphabet = language.alphabet;
		this.dictionary = language.dictionary;

		this.hasPhonetics = language.hasPhonetics;
		this.phonetics = language.phonetics;
		this.phoneticGroupings = language.phoneticGroupings;

		this.hasConjugations = language.hasConjugations;
		this.conjugations = language.conjugations;

		this.hasEtymologies = language.hasEtymologies;
		this.etymologicalParents = language.etymologicalParents;

		this.hasScript = language.hasScript;
		this.scriptStyle = language.scriptStyle;
		this.scriptRules = language.scriptRules;

		if (initialize) {
			this.analyzeWords();
			this.checkWords();
			this.setTotalPageNum();
		}
	}

	analyzeWords(): void {
		if (isDev) { console.log("analyzing words in the dictionary."); };

		let unfilteredWordCount = 0;
		let unfilteredLetterCount = 0;
		for (let word in this.dictionary) {
			unfilteredWordCount++;
			unfilteredLetterCount += word.length;
		}

		if (isDev) { console.log("average word length: " + (Math.round(100 * unfilteredLetterCount / unfilteredWordCount) / 100)); };
	}

	checkWords(): void {
		if (isDev) { console.log("checking for illegal letters in dictionary."); };

		let found = false;
		for (let word in this.dictionary) {
			for (let i = 0; i < word.length; i++) {
				if (this.alphabet.indexOf(word[i]) < 0) {
					console.log("illegal letter in word " + word + ", at index of " + i);
					found = true;
				}
			}
		}

		if (isDev) { if (!found) { console.log("no illegal letters found."); } }
	}

	setTotalPageNum(): void {
		let activeEntries = 0;
		for (let word in this.dictionary) { if (this.dictionary[word].active) { activeEntries++; } }

		this.totalPages = Math.floor(activeEntries / this.wordsPerPage);
		this.wordCount = activeEntries;

		if (isDev) { console.log("active words: " + activeEntries); }
		if (isDev) { console.log("needed number of pages: " + (this.totalPages + 1)); }
	}

	nextPage(): number {
		let newPage: number = this.currentPage;
		if (newPage < this.totalPages) { newPage++; }
		return newPage;
	}

	prevPage(): number {
		let newPage: number = this.currentPage;
		if (newPage > 0) { newPage--; }
		return newPage;
	}

	getScriptText(str: string): string {
		if (this.scriptRules.convertUpperCase) { str = str.toLocaleUpperCase(); }
		if (this.scriptRules.convertLowerCase) { str = str.toLocaleLowerCase(); }

		for (let i in this.scriptRules.replaceLetters) {
			str = str.replace(new RegExp(i, "g"), this.scriptRules.replaceLetters[i]);
		}

		return str;
	}

	getIPAText(str: string): string {
		let letters: string[] = str.split("");

		let wordPhoneticArray = [];
		for (let i = 0; i < letters.length; i++) {
			let currentLetter: string = letters[i];
			let nextLetter: string = letters[i + 1];
			if (i < letters.length - 1 && currentLetter in this.phoneticGroupings && this.phoneticGroupings[currentLetter].includes(nextLetter)) {
				wordPhoneticArray.push(currentLetter + nextLetter);
				i++;
			}
			else {
				wordPhoneticArray.push(currentLetter);
			}
		}

		let wordPhonetic: string = "";
		for (let i = 0; i < wordPhoneticArray.length; i++) {
			wordPhonetic += this.phonetics[wordPhoneticArray[i]];
		}

		return ("/" + wordPhonetic + "/");
	}

	filterList(): { [key: string]: word; } {
		let srcWrd = (document.getElementById("searchWord") as HTMLInputElement).value;
		let srcMng = (document.getElementById("searchMeaning") as HTMLInputElement).value;
		let srcTyp = (document.getElementById("searchType") as HTMLSelectElement).value;

		if ((document.getElementById("onlyWholeWords") as HTMLInputElement).checked) {
			for (let word in this.dictionary) {
				this.dictionary[word].active = true;

				if (srcWrd.length > 0) {
					let entryLowerCase = word.toLowerCase();
					if (word !== srcWrd && entryLowerCase !== srcWrd) {
						this.dictionary[word].active = false;
					}
				}
				if (srcMng.length > 0) {
					let entryMeaning = this.dictionary[word].meanings[0];
					let entryMeaningLowerCase = this.dictionary[word].meanings[0].toLowerCase();
					if (entryMeaning !== srcMng && entryMeaningLowerCase !== srcMng) {
						this.dictionary[word].active = false;
					}
				}
				if (srcTyp.length > 0) {
					let entryType = this.dictionary[word].type;
					let entryTypeLowerCase = entryType.toLowerCase();
					if (!entryType.includes(srcTyp) && !entryTypeLowerCase.includes(srcTyp)) {
						this.dictionary[word].active = false;
					}
				}
			}
		}
		else {
			for (let word in this.dictionary) {
				this.dictionary[word].active = true;

				if (srcWrd.length > 0) {
					let entryLowerCase = word.toLowerCase();
					if (word.indexOf(srcWrd) === -1 && entryLowerCase.indexOf(srcWrd) === -1) {
						this.dictionary[word].active = false;
					}
				}
				if (srcMng.length > 0) {
					let entryMeaning = this.dictionary[word].meanings[0];
					let entryMeaningLowerCase = this.dictionary[word].meanings[0].toLowerCase();
					if (entryMeaning.indexOf(srcMng) === -1 && entryMeaningLowerCase.indexOf(srcMng) === -1) {
						this.dictionary[word].active = false;
					}
				}
				if (srcTyp.length > 0) {
					let entryType = this.dictionary[word].type;
					let entryTypeLowerCase = entryType.toLowerCase();
					if (!entryType.includes(srcTyp) && !entryTypeLowerCase.includes(srcTyp)) {
						this.dictionary[word].active = false;
					}
				}
			}
		}

		this.currentPage = 0;
		this.setTotalPageNum();

		return this.dictionary;
	}

	getCurrentWordsPaginated(): string[] {
		let startEntry: number = this.wordsPerPage * this.currentPage;
		let endEntry: number = this.wordsPerPage * (this.currentPage + 1);

		return this.getCurrentWords().slice(startEntry, endEntry);
	}

	getCurrentWords(): string[] {
		let index: number = 0;
		let startEntry: number = this.wordsPerPage * this.currentPage;

		let unorderedDict: any = {};
		for (let i = 0; i < this.alphabet.length; i++) {
			for (let word in this.dictionary) {
				if (this.dictionary[word].active && word.startsWith(this.alphabet[i])) {
					unorderedDict[word] = this.dictionary[word];
					if (index >= startEntry) { index++; }
				}
			}
		}

		let ordering: any = {};
		for (let i = 0; i < this.alphabet.length; i++) { ordering[this.alphabet[i]] = i; }

		let orderedDict: string[] = Object.keys(unorderedDict).sort(function (a, b) {
			return (ordering[a] - ordering[b]) || a.localeCompare(b);
		});

		return orderedDict;
	}
};