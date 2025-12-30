export type Survey = {
	id: string;
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	spreadsheetUrl: string;
	createdAt: string;
};

export type SurveyInput = {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	spreadsheetUrl: string;
};
