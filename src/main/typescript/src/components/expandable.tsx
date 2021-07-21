import { ReactNode, Component } from "react";
import "./expandable.scss";

export interface ExpandableProps {
	expand: (expandable: Expandable<ExpandableProps, ExpandableState>) => void;
	expanded?: boolean;
	className?: string;
}

export interface ExpandableState {
	expanded: boolean;
}

type OmitExpanded<S extends ExpandableState> = Omit<S, "expanded">;

export default abstract class Expandable<
		P extends ExpandableProps = ExpandableProps,
		S extends ExpandableState = ExpandableState
		> extends Component<P, S> {

	constructor(props: P, state: OmitExpanded<S>) {
		super(props);
		this.state = {
			...(state as S),
			expanded: false
		};
	}

	protected abstract header(): ReactNode[] | ReactNode;
	protected abstract contentCollapsed(): ReactNode[] | ReactNode;
	protected abstract contentExpanded(): ReactNode[] | ReactNode;

	private expand() {
		this.props.expand(this);
	}

	protected content(): ReactNode[] | ReactNode {
		return this.state.expanded ? this.contentExpanded()
				: this.contentCollapsed();
	}

	componentDidMount() {
		if(this.props.expanded)
			this.props.expand(this);
	}

	render(): ReactNode {
		let className = this.state.expanded ? "expanded" : "collapsed";
		let classes = `expandable ${ className }`;
		if(this.props.className)
			classes = `${ this.props.className } ${ classes }`;
	
		return <div className={ classes } onClick={ this.expand.bind(this) }>
			<div className="header">
				{ this.header() }
			</div>
			<div className="content">
				{ this.content() }
			</div>
		</div>;
	}
}