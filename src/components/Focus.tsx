import React, { ReactNode } from "react";

import "./Focus.scss";

import { IStateProps, IState } from "../index";
import Language from "../Language";

/*const ff: any = {
	"word": "aesten",
	"script": "æSTEN",
	"ipa": "ɶːsten",
	"type": "noun",
	"meanings": "",
	"conjugations": "",
	"etymologies": "",
};*/

class Focus extends React.Component<IStateProps, IState> {
	scriptEl(lang: Language): JSX.Element {
		let el: JSX.Element = <span></span>;
		if (lang.hasScript && lang.hasScript) {
			el = <span className="script" style={(lang.scriptStyle as React.CSSProperties)}> {lang?.getScriptText(lang?.focus)} </span>;
		}
		return el;
	}

	phoneticsEl(lang: Language): JSX.Element {
		let el: JSX.Element = <span></span>;
		if (lang.hasPhonetics && lang.hasPhonetics) {
			el = <span className="phonetics" /*onClick="testToSpeech(this);"*/> {lang?.getIPAText(lang?.focus)} </span>;
		}
		return el;
	}

	meaningsEl(lang: Language): JSX.Element {
		const meanings: string[] = lang?.dictionary[lang?.focus].meanings;
		const meaningsList: JSX.Element[] = meanings.map((meaning: string, index: number) =>
			<div className="meaning" key={meaning.toString()}>{index + 1}. {meaning}</div>
		);
		let el: JSX.Element = <div className="meanings"> {meaningsList} </div>;
		return el;
	}

	private getAffixes(dataset: any, oldWord: string): string {
		let type: string = "";
		let affix: string = "";

		if ("suffix" in dataset) {
			type = "suffix";
			affix = dataset.suffix;
		}
		else if ("prefix" in dataset) {
			type = "prefix";
			affix = dataset.prefix;
		}

		let newWord: string = "";
		if (type === "suffix") { newWord = oldWord + affix; }
		else if (type === "prefix") { newWord = affix + oldWord.toLocaleLowerCase(); }

		return newWord;
	}

	private checkConjugationException(conjugationData: any, conjugationWord: string): any {
		let hasException: boolean = false;
		let newConjugationData: any = conjugationData;

		for (let i in conjugationData.exceptions) {
			let exception = conjugationData.exceptions[i];

			if ("startsWith" in exception && conjugationWord.startsWith(exception.startsWith)) {
				hasException = true;
			}
			else if ("endsWith" in exception && conjugationWord.endsWith(exception.endsWith)) {
				hasException = true;
			}

			if (hasException) { newConjugationData = exception; }
		}

		return newConjugationData;
	}

	private aspectConjugation(conjugations: any, tenseWord: string, currentTense: string): JSX.Element[] {
		let list: JSX.Element[] = [];

		for (let aspect in conjugations.aspects) {
			const aspectData: any = conjugations.aspects[aspect];

			if (aspectData.usedWith.includes(currentTense)) {
				const conjugationData = this.checkConjugationException(aspectData, tenseWord);
				const newWord: string = this.getAffixes(conjugationData, tenseWord);

				list.push(
					<span className="aspect" key={newWord.toString()}>
						<span className="name">{aspect}:</span>
						<span className="word">{newWord}</span>
					</span>
				);
			}
		}

		return list;
	}

	private tenseConjugation(lang: Language): JSX.Element[] {
		const conjugations: any = lang?.conjugations;
		let list: JSX.Element[] = [];

		for (let tense in conjugations.tenses) {
			const tenseData: any = conjugations.tenses[tense];

			const conjugationData: any = this.checkConjugationException(tenseData, lang?.focus);
			const newWord: string = this.getAffixes(conjugationData, lang?.focus);

			list.push(
				<span className="tense" key={newWord.toString()}>
					<span className="name">{tense}:</span>
					<span className="word">{newWord}</span>
				</span>
			);

			list = list.concat(this.aspectConjugation(conjugations, newWord, tense));

			list.push(<br key={(Math.random()).toString()} />);
		}

		return list;
	}

	conjugationsEl(lang: Language): JSX.Element {
		let el: JSX.Element = <div></div>;
		if (lang.hasConjugations && lang.hasConjugations && lang?.dictionary[lang?.focus].type === "verb") {

			const conjugationsList = this.tenseConjugation(lang);

			el = <div className="conjugations"> <div className="title">Conjugations</div> {conjugationsList} </div>;
		}
		return el;
	}

	etymologiesEl(lang: Language): JSX.Element {
		let el: JSX.Element = <div></div>;
		if (lang.hasEtymologies && lang.hasEtymologies) {
			const etymologies: string[] = lang?.etymologicalParents;

			let etymologiesList: JSX.Element[] = [];
			for (let ety in etymologies) {
				let etyLang: string = etymologies[ety];

				if ("dialects" in lang?.dictionary[lang?.focus]) {
					let etyString: string = lang?.dictionary[lang?.focus].dialects[etyLang];

					if (etyString.length > 0) {
						etymologiesList.push(
							<span className="lang" key={etyLang.toString()}>{etyLang}</span>,
							<span className="word" key={etyString.toString()}>{etyString}</span>,
							<span key={ety.toString()}>→</span>
						);
					}
				}
			}

			if (etymologiesList.length > -1) {
				etymologiesList.push(
					<span className="lang" key={lang?.name.toString()}>{lang?.name}</span>,
					<span className="word" key={lang?.focus.toString()}>{lang?.focus}</span>,
				);

				el = <div className="etymologies"> <div className="title">Etymologies</div> {etymologiesList} </div>;
			}
		}
		return el;
	}

	render(): ReactNode {
		const data: Language = this.props.data as Language;
		return (
			<div className="focus-wrapper">
				<span className="word">{data?.focus}</span>
				{this.scriptEl(data)}
				{this.phoneticsEl(data)}
				<span className="type">({data?.dictionary[data?.focus].type})</span>
				{this.meaningsEl(data)}
				{this.conjugationsEl(data)}
				{this.etymologiesEl(data)}
			</div>
		);
	};
}

export default Focus;