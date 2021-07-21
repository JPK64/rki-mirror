import Comparator, { ComparatorProps } from "./comparator";

interface NumberProps extends ComparatorProps<number> {
	compareTo?: number;
	unit?: string;
	round?: boolean;
	abs?: boolean;
}

export default class Number extends Comparator<number, NumberProps> {
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
