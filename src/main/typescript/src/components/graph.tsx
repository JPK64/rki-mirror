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
	step: number;
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

function getStepSize(max: number): number {
	if(max <= 40)
		return 10;
	if(max <= 100)
		return 25;
	if(max <= 200)
		return 50;
	if(max <= 400)
		return 100;
	return 200;
}

function drawDescriptors(canvas: Canvas, margins: Margins,
		scaling: GraphScaling, descriptors: string[], rows: number) {
	canvas.context.font = `${ units.vh * 1.5 }px Roboto`;
	canvas.context.fillStyle = theme.descriptorColor;
	for(let i = 0; i < rows + 1; i ++) {
		let value = i * scaling.step;
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
		scaling: GraphScaling, rows: number) {
	context.lineWidth = 2;
	context.strokeStyle = theme.descriptorColor
	context.beginPath();
	for(let i = 0; i < rows + 1; i++) {
		let y = i * scaling.step * scaling.y;
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
		const step = getStepSize(max);
		const rows = Math.ceil(max / step);

		let tmp = max;
		let maxPlaces = 0;
		while(tmp) {
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
			step: step,
			x: graph.width / (props.data.length - 1),
			y: graph.height / (rows * step)
		};

		drawDescriptors(canvas, margins, scaling, props.descriptors, rows);
		canvas.context.lineJoin = "round";
		canvas.context.transform(1, 0, 0, -1, margins.left,
				canvas.height - margins.bottom);
			
		drawRows(canvas.context, graph, scaling, rows);
		drawGraph(canvas.context, graph, scaling, props.data);
	}, [ props ]);

	return <div className="graph">
		<canvas ref={ ref } />
	</div>;
}
