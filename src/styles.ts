import { StyleSettings, ExpressiveCodeTheme, ResolvedCoreStyles } from '@expressive-code/core'

export const promptClass = 'ec-prompt'
export const promptContClass = 'ec-prompt-cont'

export const promptStyleSettings = new StyleSettings({
	promptColor: ({ coreStyles }) => coreStyles.codeForeground,
	promptBackground: ({ coreStyles }) => coreStyles.codeBackground,
	promptContColor: ({ coreStyles }) => coreStyles.codeForeground,
	promptContBackground: ({ coreStyles }) => coreStyles.codeBackground,
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
		div.prose pre > code div.ec-line.${promptClass}::before {
    		content: "$ ";
			color: ${styles.promptColor};
			backgroud: ${styles.promptBackground};
  		}
		div.prose pre > code div.ec-line.${promptContClass}::before {
    		content: "> ";
			color: ${styles.promptContColor};
			backgroud: ${styles.promptContBackground};
  		}
	`
	return result
}
