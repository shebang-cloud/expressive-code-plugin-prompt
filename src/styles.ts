import { StyleSettings, ExpressiveCodeTheme, ResolvedCoreStyles } from '@expressive-code/core'

export const promptClass = 'ec-prompt'

export const promptStyleSettings = new StyleSettings({
	promptColor: ({ coreStyles }) => coreStyles.codeForeground,
	promptBackground: ({ coreStyles }) => coreStyles.codeBackground,
})

declare module '@expressive-code/core' {
	export interface StyleOverrides {
		prompt: Partial<typeof promptStyleSettings.defaultSettings>
	}
}

export function getPromptBaseStyles(theme: ExpressiveCodeTheme, coreStyles: ResolvedCoreStyles, styleOverrides: Partial<typeof promptStyleSettings.defaultSettings>) {
	const styles = promptStyleSettings.resolve({
		theme,
		coreStyles,
		styleOverrides,
		themeStyleOverrides: theme.styleOverrides.prompt,
	})
	const result = `
		.${promptClass} {
			color: ${styles.promptColor};
			backgroud: ${styles.promptBackground};
		}
	`
	return result
}
