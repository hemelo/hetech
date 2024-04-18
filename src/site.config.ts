import type { SiteConfig, ProfileInfo } from '@/types'
import type { AstroExpressiveCodeOptions } from 'astro-expressive-code'

export const siteConfig: SiteConfig = {
	// Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
	author: 'HEMELO',
	// Meta property used to construct the meta title property, found in src/components/BaseHead.astro L:11
	title: 'Resume - Henrique Melo',
	// Meta property used as the default description meta property
	description: 'Resume - Henrique Melo - Software Engineer',
	// HTML lang property, found in src/layouts/Base.astro L:18
	lang: 'en',
	// Meta property, found in src/components/BaseHead.astro L:42
	ogLocale: 'en',
	// Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
	date: {
		locale: 'en',
		options: {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}
	},
}

export const profile: ProfileInfo = {
	name: 'Henrique Melo',
	role: 'Software Engineer',
	location: 'Belo Horizonte, Brazil',
	socials: {
		linkedin: 'https://www.linkedin.com/in/henriquefcmelo/',
		github: 'https://www.github.com/hemelo',
	},
	skills: {
		languages: ['Java', 'Python', 'Ruby', 'PHP', 'Kotlin', 'TypeScript', 'C++', 'Rust', 'Haskell', 'JavaScript'],
		frontend: ['Vue', 'Angular', 'Tailwind'],
		backend: ['Spring', 'Laravel', 'NestJS', 'Django', 'Ruby on Rails', 'JSF'],
		database: ['MySQL', 'PostgreSQL'],
		others: ['Shell', 'Git', 'AWS'],
		desktop: ['Electron', 'JavaFX'],
	},
	tools: {
		ides: ['Neovim','Jetbrains (ALL)', 'Eclipse', 'Microsoft Visual Studio', 'Microsoft Visual Studio Code', 'Embarcadero XE'],
		systems: ['Arch-based Linux', 'Ubuntu-based Linux', 'Microsoft Windows 11'],
		others: ['Microsoft PowerBI']
	}
}

export const menuLinks: Array<{ title: string; path: string }> = [
	{
		title: 'Home',
		path: '/'
	},
	{
		title: 'Blog',
		path: '/blog/'
	}
]

// https://expressive-code.com/reference/configuration/
export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
	// One dark, one light theme => https://expressive-code.com/guides/themes/#available-themes
	themes: ['dracula', 'github-light'],
	themeCssSelector(theme, { styleVariants }) {
		// If one dark and one light theme are available
		// generate theme CSS selectors compatible with cactus-theme dark mode switch
		if (styleVariants.length >= 2) {
			const baseTheme = styleVariants[0]?.theme
			const altTheme = styleVariants.find((v) => v.theme.type !== baseTheme?.type)?.theme
			if (theme === baseTheme || theme === altTheme) return `[data-theme='${theme.type}']`
		}
		// return default selector
		return `[data-theme="${theme.name}"]`
	},
	useThemedScrollbars: false,
	styleOverrides: {
		frames: {
			frameBoxShadowCssValue: 'none'
		},
		uiLineHeight: 'inherit',
		codeFontSize: '0.875rem',
		codeLineHeight: '1.7142857rem',
		borderRadius: '4px',
		codePaddingInline: '1rem',
		codeFontFamily:
			'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;'
	}
}
