# easy-dictionary

A small app to create custom dictionaries.

Run `npm start` and navigate to `localhost:3000` to start.

## Features

-   Ability to add user-created dictionaries.
-   Conjugations for verbs.
-   IPA text.
-   Etymologies.
-   Scripts can be shown if the user has a font file.

## Adding a Language

For now, only one user defined languages can be added, but ability to uploading and downloading languages is planned.

To change the defined language, user must change the `src/UserLang.ts` file. Most Basic version of that file is shown below.

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

```
alphabet: ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","-"],
```

-   `dictionary` is an object that contains the words that the user added. Words are discussed under the next heading.

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

-   `active` is used internally.
-   `meanings` is an array of strings.
-   `sumtype` is the smaller (3-4 character) version of the `type`.
-   `type` may be set to whatever the user wants like `noun`, `verb`, `pronoun`, and such. These do not effect anything internally, except for `verb` as it is used for conjugation. Words that use `verb` will be conjugated if the conjugation is enabled.
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

If user wants IPA script of the word, `hasPhonetics` can be set to `true` to automatic generation. Enabling this requires `phonetics` and `phoneticGroupings` to be set.

-   `phonetics` is an object of string keys and values. This is used to convert every parts of the word to the IPA.
-   `phoneticGroupings` is an object of string keys and string array values. This is used to group digraphs, diphtogs, and other pairings.

Internally, word is split into it's letters, then the `phoneticGroupings` is used to group pairs. Then `phonetics` is used to convert those strings into their IPA counterparts.

```
"phonetics": {
	"a": "ɶ",
	"y": "jː",
	"ar": "ʀ",
	"an": "ɴː",
		...
}
"phoneticGroupings": {
	"a": ["r", "n", "ó"],
		...
}
```

Lets consider the made-up word of `ayar` with the above example.

1. Firstly, it is turned into an array of it's letters: `["a","y","a","r"]`
1. Then it checks to see if there are any phonetic groups (via `phoneticGroupings`) in there and returns a new array: `["a","y","ar"]`
1. Then, using `phonetics`, these letters are turned into their IPA counterparts: `["ɶ","jː","ʀ"]`
1. Lastly, the full string is returned: `"ɶjːʀ"`

## Adding Conjugations

If the user wants their verbs to be conjugated automatically, they can set `hasConjugations` to `true`. This requires `conjugations` to be set.

`conjugations` are split into two parts: `tenses` and `aspects`. Example conjugations entry:

```
"conjugations": {
	"tenses": {
		"Present": {
			"prefix": "beh",
			"exceptions": [
				{ "startsWith": "a", "prefix": "eh" },
					...
			]
		},
			...
	},
	"aspects": {
		"Continuous": {
			"usedWith": ["Present", "Past", "Future"],
			"suffix": "boop",
			"exceptions": [
				{ "startsWith": "v", "suffix": "oop" },
					...
			]
		},
			...
	}
```

-   Each `aspect` and `tense` should have either `prefix` or `suffix` key. These determine if the affix will be added at the end or at the start of the word.
-   Each `aspect` and `tense` should have `exceptions` key but it may be empty. Exceptions are used to control the change/irregularity of the affix depending on the value of the `startsWith` or `endsWith` key.
-   Each `aspect` should have the key `usedWith` with an value of string array set. These should directly reference `tense` keys.

While `tense` and `aspect` might not be linguistically correct terms, they are very useful in understanding and making this work. Step by step on how this works:

1. Example verb `ayar` is sent to be conjugated. First, `ayar` is conjugated with the first tense. Because it starts with `a`, it will be conjugated with the affix from the exception, `eh`. Present tense conjugation becomes `ehayar`.
1. Before moving on to the other tenses, `ehayar` will be conjugated with each aspect that has `Present` tense listed on it's `usedWith` value. Because `ehayar` doesn't end with a `v`, and because it doesn't match any other exceptions, it will be conjugated with `boop`. Present Continuous conjugation becomes `ehayarboop`.

## Adding Etymologies

If `hasEtymologies` is set to `true`, each word will list its etymological line when clicked. This requires `etymologicalParents` to be set with an string array. Strings that are listed here are considered to be ordered from the oldest to the newest language/dialect.

```
"etymologicalParents": ["Old Moopic", "Middle Moopic"],
```

The `dialect` key on words are used to list the word's origins from older languages, and dialects. This doesn't have to be set for all words but the etymological line will only be shown if this is set.

```
"Bleah": {
	"active": true,
	"meanings": ["to code"],
	"sumtype": "verb",
	"type": "verb",
	"dialects": {
		"Old Moopic": "Peeh",
		"Middle Moopic": "Pleeh",
	}
},
```

## Adding Script

`hasScript` can be set to `true` to enable script rules. User must define `scriptStyle` and `scriptRules` for this to work, plus they should replace the font `src/fonts/Script.ttf` with their own.

`scriptStyle` is fairly straightforward as it only uses four CSS values to place the font correctly.

```
"scriptStyle": {
	"fontSize": "2.0em",
	"padding": "14px 14px 3px",
	"letterSpacing": "-1.5px",
	"lineHeight": "12px"
},
```

`scriptRules` is used to define the changes in the word itself to reflect the script better.

-   `convertCase` can be set either to `none`, `upperCase` or `lowerCase`, and this changes the case of all letters of the word accordingly.
-   `replaceLetters` are used to group letters as they may be presented in the font differently, or when digraphs, diphtongs, or other letter groups have their own letter in the script.

```
"replaceLetters": {
	"Th": "θ",
		...
}
```

## Planned Features

-   Better phonetics to reflect irregularities.
-   More Conjugation rules.
-   Irregular conjugations listed on words.
-   More Script rules.

## Credits

-   [**Primitiva Font**](https://www.dafont.com/primitiva.font) by **JardsonJean**, used for example language script.
