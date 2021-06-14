import { ReactNode } from "react";
import Expandable, { ExpandableProps, ExpandableState } from "./expandable"
import Number from "./number";
import Graph from "./graph";
import "./history.scss";
import { DateFormatter } from "../util/format";
import { Config, fetchConfig } from "../util/config";

export interface Incidence {
	timestamp: Date;
	incidence: number;
	workday: boolean;
}

export interface HistoryData {
	data: Incidence[];
	level: number;
	days: number;
}

export interface HistoryProps extends ExpandableProps {
	name: string;
	history: HistoryData;
}

interface HistoryState extends ExpandableState {
	formatDate: (date: Date) => string;
	descriptors: {
		incidence: string;
		daysAbove: string;
		daysBelow: string;
	};
	units: {
		days: string;
	};
}

export default class History extends Expandable<HistoryProps, HistoryState> {
	static defaultProps = {
		className: "history"
	};

	constructor(props: HistoryProps) {
		super(props, {
			formatDate: DateFormatter.empty.format.bind(DateFormatter.empty),
			descriptors: {
				incidence: "",
				daysAbove: "",
				daysBelow: ""
			},
			units: {
				days: ""
			}
		});
	}

	private incidenceNumber(): ReactNode {
		return <Number compareTo={ this.props.history.data[1].incidence } round>
			{ this.props.history.data[0].incidence }
		</Number>;
	}

	protected header(): ReactNode[] {
		return [
			<div>{ this.props.name }</div>,
			<Number compareTo={ this.props.history.level }
					noArrow>
				{ this.props.history.level }
			</Number>
		]
	}

	protected contentCollapsed(): ReactNode[] {
		return [
			this.incidenceNumber(),
			<Number unit={ this.state.units.days } abs>
				{ this.props.history.days }
			</Number>
		]
	}

	protected contentExpanded(): ReactNode[] {
		let data = this.props.history.data.map((i: Incidence) => i.incidence);
		let descriptors = this.props.history.data
				.map((i: Incidence) => i.timestamp)
				.map(this.state.formatDate)
				.filter((d: string, index: number) => index % 3 === 0);

		return [
			<div>
				<div>{ this.state.descriptors.incidence }</div>
				{ this.incidenceNumber() }
			</div>,
			<div>
				<div>
					{ this.props.history.days < 0 ?
							this.state.descriptors.daysBelow
							: this.state.descriptors.daysAbove }
				</div>
				<Number abs noArrow>
					{ this.props.history.days }
				</Number>
			</div>,
			<Graph data={ data } descriptors={ descriptors } />
		];
	}

	componentDidMount() {
		super.componentDidMount();
		fetchConfig().then((config: Config) => {
			let formatter = new DateFormatter(config.format.date);
			this.setState({
				expanded: this.state.expanded,
				formatDate: formatter.format.bind(formatter),
				...config
			});
		});
	}
}
