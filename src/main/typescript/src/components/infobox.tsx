import { ReactNode } from "react";
import { Config, fetchConfig } from "../util/config";
import { DateFormatter } from "../util/format";
import Expandable, { ExpandableProps, ExpandableState } from "./expandable"
import "./infobox.scss"

const anchorRegex = /\[(.+?)\]\((.+?)\)/;

export interface InfoBoxProps extends ExpandableProps {
	lastUpdated: Date;
	lastChecked: Date;
}

interface InfoBoxState extends ExpandableState {
	formatDate: (date: Date) => string;
	descriptors: {
		moreInfo: string;
		lastUpdated: string;
		lastChecked: string;
	};
	imprint: string[];
}

export default class InfoBox extends Expandable<InfoBoxProps, InfoBoxState> {
	public static defaultProps = {
		className: "info"
	};

	constructor(props: InfoBoxProps) {
		super(props, {
			formatDate: DateFormatter.empty.format.bind(DateFormatter.empty),
			descriptors: {
				moreInfo: "",
				lastUpdated: "",
				lastChecked: ""
			},
			imprint: [ ]
		});
	}

	private parseImprint(imprint: string): ReactNode {
		let split = imprint.split(anchorRegex);
		let texts = split.filter((value, index) => !(index % 3));
		let anchors = split.filter((value, index) => index % 3);
		let result: ReactNode[] = [ ];

		for(let i = 0; i < texts.length - 1; i++) {
			result.push(texts[i]);
			result.push(<a href={ anchors[2 * i + 1] }>{ anchors[2 * i] }</a>)
		}

		result.push(texts[texts.length - 1]);
		return <div className="imprint">{ result }</div>;
	}

	protected header(): ReactNode {
		return <div>{ this.state.descriptors.moreInfo }</div>;
	}

	protected formatDate(date: Date): ReactNode {
		return <div>{ this.state.formatDate(date) }</div>;
	}

	protected contentCollapsed(): ReactNode {
		return this.formatDate(this.props.lastUpdated);
	}

	protected contentExpanded(): ReactNode[] {
		let result: ReactNode[] = [
			<div className="pair">
				<div>{ this.state.descriptors.lastUpdated }</div>
				{ this.formatDate(this.props.lastUpdated) }
			</div>,
			<div className="pair">
				<div>{ this.state.descriptors.lastChecked }</div>
				{ this.formatDate(this.props.lastChecked) }
			</div>
		];
		this.state.imprint
				.map(this.parseImprint.bind(this))
				.forEach((n: ReactNode) => result.push(n));
		return result;
	}

	componentDidMount() {
		super.componentDidMount();
		fetchConfig().then((config: Config) => {
			let formatter = new DateFormatter(config.format.datetime);
			this.setState({
				expanded: this.state.expanded,
				formatDate: formatter.format.bind(formatter),
				...config
			});
		});
	}
}
