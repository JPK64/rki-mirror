function leading0(value: number): string {
	return `${ value < 10 ? 0 : "" }${ value }`;
}

const options = new Map([
	[ "yyyy", (date: Date) => `${ date.getFullYear() }` ],
	[ "yy", (date: Date) => `${ date.getFullYear() % 100 }` ],
	[ "MM", (date: Date) => leading0(date.getMonth() + 1) ],
	[ "M", (date: Date) => `${ date.getMonth() + 1 }` ],
	[ "dd", (date: Date) => leading0(date.getDate()) ],
	[ "d", (date: Date) => `${ date.getDate() }` ],
	[ "HH", (date: Date) => leading0(date.getHours()) ],
	[ "H", (date: Date) => `${ date.getHours() }` ],
	[ "mm", (date: Date) => leading0(date.getMinutes()) ],
	[ "m", (date: Date) => `${ date.getMinutes() }` ],
	[ "ss", (date: Date) => leading0(date.getSeconds()) ],
	[ "s", (date: Date) => `${ date.getSeconds() }` ],
	[ "S", (date: Date) => `${ date.getMilliseconds() }` ]
]);

const parts: DateFormatterPart[] = [];
options.forEach((value, key) => parts.push({
	convert: value,
	length: key.length,
	match: key
}));

const noPart: DateFormatterPart = {
	convert: (date: Date) => "",
	length: 0,
	match: ""
};

interface DateFormatterPart {
	convert: (date: Date) => string;
	length: number;
	match: string | RegExp;
}

class TextPart implements DateFormatterPart {
	private text: string;
	length: number;
	match: string;

	constructor(text: string) {
		this.text = text;
		this.length = text.length;
		this.match = "";
	}

	convert(date: Date): string {
		return this.text;
	}
}

export class DateFormatter {
	private parts: DateFormatterPart[];
	static empty = new DateFormatter("");

	private static parsePart(format: string): DateFormatterPart[] {
		let current: DateFormatterPart = noPart;
		let first = format.length;

		if(first === 0)
			return [ ];

		for(let part of parts) {
			let index = format.search(part.match);
			if(index === -1)
				continue;
			if(index < first || (index === first && part.length > current?.length)) {
				first = index;
				current = part;
			}
		}

		let result: DateFormatterPart[] = [];
		if(first !== 0)
			result.push(new TextPart(format.substring(0, first)));
		if(current !== undefined)
			result.push(current);
		return result;
	}

	private static parseParts(format: string): DateFormatterPart[] {
		let result: DateFormatterPart[] = [ ];
		while(format.length !== 0) {
			let parts = this.parsePart(format);
			for(let part of parts) {
				format = format.substring(part.length);
				result.push(part);
			}
		}
		return result;
	}

	constructor(format: string) {
		this.parts = DateFormatter.parseParts(format);
	}

	format(date: Date): string {
		return this.parts.map((part: DateFormatterPart) => part.convert(date))
				.reduce((a, b) => a + b, "");
	}
}
