export interface Config {
	names: {
		state: string;
		district: string;
	};
	descriptors: {
		incidence: string;
		daysBelow: string;
		daysAbove: string;
		lastUpdated: string;
		moreInfo: string;
	};
	format: {
		date: string;
		datetime: string;
	};
	units: {
		days: string
	};
	imprint: string[];
}

let config: Config;

export async function fetchConfig(): Promise<Config> {
	if(!config)
		config = await fetch("/config/frontend.json")
				.then((response: Response) => response.json());
	return config;
}
