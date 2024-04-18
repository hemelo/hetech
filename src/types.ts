export type SiteConfig = {
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	date: {
		locale: string | string[] | undefined
		options: Intl.DateTimeFormatOptions
	},
}

export type ProfileInfo = {
	name: string
	role: string
	location: string
	socials: {
		linkedin: string
		github: string
	}
	skills: {
		languages: string[]
		frontend: string[]
		backend: string[]
		desktop: string[]
		others: string[]
		database: string[]
	}
	tools: {
		systems: string[]
		ides: string[]
		others: string[]
	}
}

export type PaginationLink = {
	url: string
	text?: string
	srLabel?: string
}

export type SiteMeta = {
	title: string
	description?: string
	ogImage?: string | undefined
	articleDate?: string | undefined
}
