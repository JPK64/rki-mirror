import { ReactNode, Component } from "react";
import { fetchConfig } from "../util/config";
import { DateFormatter } from "../util/format";
import "./comparator.scss";

export interface ComparatorProps<T> {
	children: T;
	noArrow?: boolean;
	invert?: boolean;
	className?: string;
}

export default abstract class Comparator<T,
		P extends ComparatorProps<T> = ComparatorProps<T>,
		S = { }>
		extends Component<P, S> {
	protected abstract compare(value: T): number;

	protected processDisplay(value: T): string {
		return `${ value }`;
	}

	render(): ReactNode {
		let className = "comparator";
		if(this.props.className)
			className += ` ${ this.props.className }`;
		if(!this.props.noArrow)
			className += " arrow";
		if(this.props.invert)
			className += " invert";

		const comparison = this.compare(this.props.children);
		const display = this.processDisplay(this.props.children);

		if(comparison > 0)
			return <div className={ `${ className } greater` }>
				{ display }
			</div>;
		if(comparison < 0)
			return <div className={ `${ className } lesser` }>
				{ display }
			</div>;
		
		return <div className={ `${ className } equal` }>
			{ display }
		</div>;
	}
}



interface NumberProps extends ComparatorProps<number> {
	compareTo?: number;
	unit?: string;
	round?: boolean;
	abs?: boolean;
}

export class Number extends Comparator<number, NumberProps> {
	protected compare(value: number): number {
		return value - (this.props.compareTo || 0);
	}

	protected processDisplay(value: number): string {
		if(this.props.abs)
			value = Math.abs(value);
		if(this.props.round)
			value = Math.round(value * 10) / 10;
		return `${ super.processDisplay(value) }${ this.props.unit || "" }`;
	}
}



interface OutdatedTrackerProps extends ComparatorProps<Date> {
	compareTo: Date
}

interface OutdatedTrackerState {
	formatDate?: (date: Date) => string;
}

export class OutdatedTracker
		extends Comparator<Date, OutdatedTrackerProps, OutdatedTrackerState> {
	static defaultProps = {
		noArrow: true
	};

	constructor(props: OutdatedTrackerProps) {
		super(props);
		this.state = { };
	}

	protected compare(value: Date): number {
		const compareToNumber = this.props.compareTo.getFullYear() * 10000
				+ (this.props.compareTo.getMonth() + 1) * 100
				+ this.props.compareTo.getDate();
		const valueNumber = value.getFullYear() * 10000
				+ (value.getMonth() + 1) * 100
				+ value.getDate();
		return Math.max(compareToNumber - valueNumber, 0);
	}

	protected processDisplay(value: Date): string {
		if(this.state.formatDate === undefined)
			return "";
		return this.state.formatDate(value);
	}

	componentDidMount() {
		fetchConfig().then(config => {
			let formatter = new DateFormatter(config.format.fulldate);
			this.setState({
				formatDate: formatter.format.bind(formatter)
			});
		});
	}
}
