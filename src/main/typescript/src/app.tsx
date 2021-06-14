import { Component } from "react";
import Expandable from "./components/expandable";
import History, { HistoryData, Incidence } from "./components/history";
import InfoBox from "./components/infobox";
import "./app.scss";
import { fetchConfig } from "./util/config";

interface ResponseIncidence {
	timestamp: string;
	incidence: number;
	workday: boolean;
}

interface ResponseHistory {
	data: ResponseIncidence[];
	level: number;
	days: number;
}

interface ResponseData {
	lastUpdated: string;
	district: ResponseHistory;
	state: ResponseHistory;
}

export interface AppState {
	lastUpdated: Date;
	district: HistoryData;
	state: HistoryData;
	names: {
		district: string;
		state: string;
	};
	expanded?: Expandable;
}

export default class App extends Component<{ }, AppState> {
	constructor(props: { }) {
		super(props);
		this.state = { } as AppState;
	}

	private static parseResponseIncidence(incidence: ResponseIncidence):
			Incidence {
		return {
			...incidence,
			timestamp: new Date(incidence.timestamp)
		};
	}

	private static parseResponseHistory(history: ResponseHistory): HistoryData {
		return {
			...history,
			data: history.data.map(App.parseResponseIncidence),
		}
	}

	private static parseResponse(response: ResponseData): Partial<AppState> {
		return {
			lastUpdated: new Date(response.lastUpdated),
			district: App.parseResponseHistory(response.district),
			state: App.parseResponseHistory(response.state)
		}
	}

	private expand(expandable: Expandable) {
		if(expandable.state.expanded)
			return;
		
		this.state.expanded?.setState({
			...this.state.expanded.state,
			expanded: false
		});

		expandable.setState({
			...expandable.state,
			expanded: true
		});

		this.mergeState({ expanded: expandable });
	}

	private mergeState(state: Partial<AppState>) {
		this.setState({
			...this.state,
			...state
		});
	}

	componentDidMount() {
		fetch("/data")
			.then((response: Response) => response.json())
			.then(App.parseResponse)
			.then(this.mergeState.bind(this))
			.catch(console.error);
		fetchConfig()
			.then(this.mergeState.bind(this))
			.catch(console.error);
	}

	render() {
		if(!this.state.district || !this.state.state || !this.state.lastUpdated
				|| !this.state.names)
			return <div id="app" />;
		
		const expand = this.expand.bind(this);
		return <div id="app">
			<History name={ this.state.names.district }
					history={ this.state.district } 
					expand={ expand } expanded/>
			<History name={ this.state.names.state }
					history={ this.state.state }
					expand={ expand }/>
			<InfoBox lastUpdated={ this.state.lastUpdated }
					expand={ expand }/>
		</div>;
	}
}
