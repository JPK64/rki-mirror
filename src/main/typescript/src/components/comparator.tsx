import { ReactNode, Component } from "react";
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
			return (
				<div className={ `${ className } greater` }>
					{ display }
				</div>
			);
		if(comparison < 0)
			return (
				<div className={ `${ className } lesser` }>
					{ display }
				</div>
			);
		
		return <div className={ `${ className } equal` }>
			{ display }
		</div>;
	}
}
