import { RefObject, useRef, useEffect } from "react";
import Units from "../util/units";
import theme from "../theme.module.scss";

const units = {
	vh: 2 * Units.vh,
	vw: 2 * Units.vw
}

interface Dimensions {
	height: number;
	width: number;
}

interface Margins {
	bottom: number;
	left: number;
	right: number;
	top: number;
}

interface GraphScaling {
	descriptors: number;
	lines: number[];
	x: number;
	y: number;
}

interface GraphProps {
	descriptors: string[];
	data: number[];
}

interface Canvas {
	context: CanvasRenderingContext2D;
	height: number;
	width: number;
}

function prepareCanvas(ref: RefObject<HTMLCanvasElement>): Canvas {
	const canvas = ref.current;
	if(canvas === null)
		throw new TypeError("Cannot get the canvas from reference");
	
	const context = canvas.getContext("2d");
	if(context === null)
		throw new TypeError("Cannot get the 2D context from the canvas");
	
	canvas.height = canvas.clientHeight * 2;
	canvas.width = canvas.clientWidth * 2;

	return {
		context,
		height: canvas.height,
		width: canvas.width
	};
}

function getLines(max: number): number[] {
	const lines = [ 0, 10, 35, 50, 100 ];
	const index = (lines.findIndex(value => value >= max) + 1) || lines.length;
	return lines.slice(0, index);
}

function drawDescriptors(canvas: Canvas, margins: Margins,
		scaling: GraphScaling, descriptors: string[]) {
	canvas.context.font = `${ units.vh * 1.5 }px Roboto`;
	canvas.context.fillStyle = theme.descriptorColor;

	for(let i = 0; i < scaling.lines.length; i++) {
		let value = scaling.lines[i];
		let y = canvas.height - margins.bottom - scaling.y * value;
		canvas.context.fillText(`${ value }`, 0, y + units.vh * 0.5,
				margins.left);
	}

	for(let i = 0; i < descriptors.length; i++) {
		let text = descriptors[descriptors.length - 1 - i];
		let x = margins.left + i * scaling.descriptors;
		canvas.context.fillText(text, x - text.length * 0.4 * units.vh,
					canvas.height);
	}
}

function drawRows(context: CanvasRenderingContext2D, graph: Dimensions,
		scaling: GraphScaling) {
	context.lineWidth = 2;
	context.strokeStyle = theme.descriptorColor

	context.beginPath();
	for(let i = 0; i < scaling.lines.length + 1; i++) {
		let y = scaling.y * scaling.lines[i];
		context.moveTo(0, y);
		context.lineTo(graph.width, y);
	}
	context.stroke();
}

function drawGraph(context: CanvasRenderingContext2D, graph: Dimensions,
		scaling: GraphScaling, data: number[]) {
	context.strokeStyle = theme.themeColor;
	context.lineWidth = 5;
	context.beginPath();
	context.moveTo(0, data[data.length - 1] * scaling.y);
	for(let i = 1; i < data.length; i++)
		context.lineTo(i * scaling.x, data[data.length - 1 - i]  * scaling.y);
	context.stroke();

	var gradient = context.createLinearGradient(0, graph.height, 0, 0);
	gradient.addColorStop(0, `${ theme.themeColor }88`);
	gradient.addColorStop(1, `${ theme.themeColor }00`);
	context.fillStyle = gradient;

	context.lineTo(graph.width, 0);
	context.lineTo(0, 0);
	context.fill();
}

export default function Graph(props: GraphProps) {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = prepareCanvas(ref);
		const max = props.data.reduce((a, b) => a < b ? b : a, 0);
		const lines = getLines(max);

		let tmp = lines[lines.length - 1];
		let maxPlaces = 0;
		while(tmp) {
			console.log(tmp / 10);
			tmp = Math.floor(tmp / 10);
			maxPlaces++;
		}

		const margins: Margins = {
			bottom: 2 * units.vh,
			left: maxPlaces * units.vh,
			right: maxPlaces * units.vh,
			top: units.vh
		};

		const graph: Dimensions = {
			width: canvas.width - margins.left - margins.right,
			height: canvas.height - margins.bottom - margins.top
		};

		const scaling: GraphScaling = {
			descriptors: graph.width / (props.descriptors.length - 1),
			lines: lines,
			x: graph.width / (props.data.length - 1),
			y: graph.height / lines[lines.length - 1]
		};

		drawDescriptors(canvas, margins, scaling, props.descriptors);
		canvas.context.lineJoin = "round";
		canvas.context.transform(1, 0, 0, -1, margins.left,
				canvas.height - margins.bottom);
			
		drawRows(canvas.context, graph, scaling);
		drawGraph(canvas.context, graph, scaling, props.data);
	}, [ props ]);

	return <div className="graph">
		<canvas ref={ ref } />
	</div>;
}
