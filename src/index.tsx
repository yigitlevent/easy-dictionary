import React from "react";
import ReactDOM from "react-dom";

import * as serviceWorker from "./serviceWorker";

import Title from "./components/Title";
import Focus from "./components/Focus";
import InputBar from "./components/InputBar";
import WordList from "./components/WordList";
import Pages from "./components/Pages";

import "./styles/index.scss";

import Language from "./Language";
import { UserLang } from "./UserLang";

export interface IStateProps {
	handler?: any;
	data?: Language;
}

export interface IState { }

export const isDev: boolean = (!process.env.NODE_ENV || process.env.NODE_ENV === "development");

class Main extends React.Component {
	state: any;
	timer: any;

	backupLangData: any = UserLang;

	constructor(props: any) {
		super(props);
		this.state = {
			currentLanguage: new Language(UserLang, true)
		};
	}

	componentDidMount() {
		this.timer = setInterval(() => this.tick(), 100);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	tick() { }

	langStateChangeHandler = (key: string, data: any) => {
		this.setState(prevState => {
			let currentLanguage = Object.assign(new Language(UserLang), (prevState as any).currentLanguage);
			currentLanguage[key] = data;
			return { currentLanguage };
		});
	};

	render() {
		return (
			<React.StrictMode>
				<Title data={this.state.currentLanguage} />
				<InputBar data={this.state.currentLanguage} handler={this.langStateChangeHandler} />
				<Focus data={this.state.currentLanguage} />
				<WordList data={this.state.currentLanguage} handler={this.langStateChangeHandler} />
				<Pages data={this.state.currentLanguage} handler={this.langStateChangeHandler} />
			</React.StrictMode>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
