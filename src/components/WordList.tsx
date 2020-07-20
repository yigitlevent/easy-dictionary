import React from "react";

import "./WordList.scss";

import { IStateProps, IState } from "../index";
import Language from "../backend/Language";

class WordList extends React.Component<IStateProps, IState> {
	render() {
		const handle: any = this.props.handler;
		const data: Language = this.props.data as Language;

		const keys: string[] = data.getCurrentWordsPaginated();
		const listItems: JSX.Element[] = keys.map((word: string) =>
			<span className="word" key={word.toString()} onClick={() => handle("focus", word)}>
				<span className="word">{word}</span>
				<span className="sumtype">({data.dictionary[word]?.sumtype}):</span>
				<span className="meaning">{data.dictionary[word]?.meanings[0]}</span>
			</span>
		);

		return (
			<div className="wordlist-wrapper">
				{listItems}
			</div>
		);
	};
}

export default WordList;