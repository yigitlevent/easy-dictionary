# easy-dictionary

A small app to create custom dictionaries.

## Basics

Run `npm start` and navigate to `localhost:3000` to start.

## Features

-   Ability to add user-created dictionaries.
-   Conjugations for verbs.
-   IPA text.
-   Etymologies.
-   Scripts can be shown if the user has a font file.

## Adding a Language

For now, only one user defined languages can be added, but ability to uploading and downloading languages is planned.

To change the defined language, user must change the `src/backend/UserLang.ts` file. Most Basic version of that file is shown below.

```
export const UserLang: any = {
	"name": "",
	"focus": "",

	"alphabet": [],

	"dictionary": {},

	"hasPhonetics": false,
	"phonetics": {},
	"phoneticGroupings": {},

	"hasConjugations": false,
	"conjugations": {},

	"hasEtymologies": false,
	"etymologicalParents": [],

	"hasScript": false,
	"scriptStyle": {
	},
	"scriptRules": {
	}
}
```

Only needed fields for a user dictionary are `name`, `focus`, `alphabet`, and `dictionary`.

-   `name` is the name of the language.
-   `focus` is the word from the dictionary that will be shown when an user opens the page.
-   `alphabet` is a string array. Each string should be a lowercase character, so digraphs or diphtongs shouldn't be added in here. diacritical marks can be added. Example for English:

    `alphabet: ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","-"],`

-   `dictionary` is an object that contains the words that the user added. `Word`s are discussed under the next heading.

## Adding a Word

Each `word` is defined under the `dictionary` with this structure:

```
"Word": {
	"active": true,
	"meanings": [],
	"sumtype": "",
	"type": "",
	"dialects": {}
},
```

-   `active` is used internally, so there is no need to change that.
-   `meanings` is an array of strings, used for listing the meanings of a word.
-   `sumtype` is the smaller (3-4 character) version of the `type`.
-   `type` is the type of the word. This may be set to whatever the user wants like `noun`, `verb`, `pronoun`, and such. These do not effect anything internally, except for `verb` as it is used for conjugation. Words that use `verb` will be conjugated if the conjugation is enabled.
-   `dialects` will be discussed later.

A basic word can be added like this:

```
"Bleah": {
	"active": true,
	"meanings": ["to code"],
	"sumtype": "verb",
	"type": "verb",
	"dialects": {}
},
```

## Adding Phonetics

## Adding Conjugations

## Adding Etymologies

## Adding Script

## Planned Features

## Credits

-   `Primitiva Font` by `JardsonJean`, used for example language script.
    https://www.dafont.com/primitiva.font
