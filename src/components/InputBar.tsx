import React from "react";

import "./InputBar.scss";

import { IStateProps, IState } from "../index";
import Language from "../Language";

class InputBar extends React.Component<IStateProps, IState> {
	render() {
		const handle: any = this.props.handler;
		const data: Language = this.props.data as Language;

		return (
			<div className="inputbar-wrapper">
				<input type="text" id="searchWord" className="searchWord" placeholder="search word" onKeyUp={() => handle("dictionary", data.filterList())} />
				<input type="text" id="searchMeaning" className="searchMeaning" placeholder="search meaning" onKeyUp={() => handle("dictionary", data.filterList())} />
				<select className="searchType" id="searchType" onChange={() => handle("dictionary", data.filterList())} >
					<option></option>
					<option>adjective</option>
					<option>adverb</option>
					<option>determiner</option>
					<option>noun</option>
					<option>number</option>
					<option>preposition</option>
					<option>pronoun</option>
					<option>verb</option>
				</select>
				<div>
					<label htmlFor="onlyWholeWords">Only Whole Words</label>
					<input type="checkbox" id="onlyWholeWords" className="onlyWholeWords" name="onlyWholeWords" title="search for whole words" onChange={() => handle("dictionary", data.filterList())} />
				</div>
			</div>
		);
	}
}

export default InputBar;