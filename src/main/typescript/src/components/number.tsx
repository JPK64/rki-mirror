import React, { ReactNode, Component } from "react";
import "./number.scss";

interface NumberProps {
	children: number;
	compareTo?: number;

	unit?: string;
	noArrow?: boolean;
	round?: boolean;
	abs?: boolean;

	className?: string;
}

interface NumberState {
	compare: number;
	display: string;
}

export default class Number extends Component<NumberProps, NumberState> {
	constructor(props: NumberProps) {
		super(props);
		this.state = {
			compare: this.props.children - (this.props.compareTo || 0),
			display: this.processDisplay(this.props.children)
		};
	}

	private processDisplay(value: number) : string {
		if(this.props.abs)
			value = Math.abs(value);
		if(this.props.round)
			value = Math.round(value * 10) / 10;
		return `${ value }${ this.props.unit || "" }`;
	}

	render(): ReactNode {
		let className = "number";
		if(this.props.className)
			className += ` ${ this.props.className }`;
		if(!this.props.noArrow)
			className += " arrow";

		if(this.state.compare > 0)
			return (
				<div className={ `${ className } greater` }>
					{ this.state.display }
				</div>
			);
		if(this.state.compare < 0)
			return (
				<div className={ `${ className } lesser` }>
					{ this.state.display }
				</div>
			);
		
		return (
			<div className={ `${ className } equal` }>
				{ this.state.display }
			</div>
		);
	}
}
