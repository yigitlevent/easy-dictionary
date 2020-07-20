import React from "react";

import "./Title.scss";

import { IStateProps, IState } from "../index";
import Language from "../backend/Language";

class Title extends React.Component<IStateProps, IState> {
	render() {
		const data: Language = this.props.data as Language;

		return (
			<div className="title-wrapper">
				<div className="title"> {data.name} - English Dictionary </div>
				<div className="subtitle"> {data.wordCount} {data.name} words </div>
			</div>
		);
	};
}

export default Title;
