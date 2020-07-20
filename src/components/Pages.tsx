import React from "react";

import "./Pages.scss";

import { IStateProps, IState } from "../index";
import Language from "../backend/Language";

class Pages extends React.Component<IStateProps, IState> {
	render() {
		const handle: any = this.props.handler;
		const data: Language = this.props.data as Language;

		const b = "<<";
		const f = ">>";

		let disablePrev: boolean = false;
		if (data.currentPage === 0) { disablePrev = true; }

		let disableNext: boolean = false;
		if (data.currentPage === data.totalPages) { disableNext = true; }

		return (
			<div className="pages-wrapper">
				<button onClick={() => handle("currentPage", data.prevPage())} className="pageButton" id="prevPageButton" title="previous page" disabled={disablePrev}>{b}</button>
				<span className="pageNum">{data.currentPage + 1} / {data.totalPages + 1}</span>
				<button onClick={() => handle("currentPage", data.nextPage())} className="pageButton" id="nextPageButton" title="next page" disabled={disableNext}>{f}</button>
			</div>
		);
	};
}

export default Pages;