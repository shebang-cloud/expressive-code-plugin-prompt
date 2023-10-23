import { AttachedPluginData, ExpressiveCodePlugin, replaceDelimitedValues } from '@expressive-code/core'
import rangeParser from 'parse-numeric-range'
import { promptStyleSettings, getPromptBaseStyles } from './styles'
import { PromptType, promptAnnotation, promptContAnnotation, promptContKey, promptKey } from './annotations'

export interface PluginPromptOptions {
	styleOverrides?: Partial<typeof promptStyleSettings.defaultSettings> | undefined
}

export function pluginPrompt(options: PluginPromptOptions = {}): ExpressiveCodePlugin {
	return {
		name: 'Prompt',
		baseStyles: ({ theme, coreStyles, styleOverrides }) => getPromptBaseStyles(theme, coreStyles, { ...styleOverrides.prompt, ...options.styleOverrides }),
		hooks: {
			preprocessMetadata: ({ codeBlock }) => {
				const data = pluginPromptData.getOrCreateFor(codeBlock)

				codeBlock.meta = replaceMetaParts(codeBlock.meta, (metaPart) => {
					if (metaPart === promptKey || metaPart === promptContKey) {
						data.all = metaPart
						return ''
					}
					return metaPart
				})
				codeBlock.meta = replaceDelimitedValues(
					codeBlock.meta,
					({ fullMatch, key, value }) => {
						if (key !== promptKey && key !== promptContKey) {
							// If we aren't interested in the entry, just return it as-is
							return fullMatch
						}

						if (value === '*') {
							data.all = key
						} else {
							const lines = rangeParser(value)
							if (lines.length > 0) {
								// Add lines to the property and remove these lines from the other property (line override)
								if (key === promptKey) {
									data.lines = lines
									data.contLines = data.contLines.filter((line) => !lines.includes(line))
								} else {
									data.contLines = lines
									data.lines = data.lines.filter((line) => !lines.includes(line))
								}
							}
						}
						return ''
					},
					{
						valueDelimiters: ['"', "'", '{...}'],
						keyValueSeparator: '=',
					}
				)
				
			},
			annotateCode: ({ codeBlock }) => {
				const data = pluginPromptData.getOrCreateFor(codeBlock)

				// Meta prompt
				if (data.all === promptKey) {
					// Annotate all but lines in the other property
					codeBlock.getLines().forEach((line, index) => {
						if (!data.contLines.includes(index)) {
							line.addAnnotation(promptAnnotation)
						}
					})
				} else {
					data.lines.forEach((index) => {
						codeBlock.getLine(index)?.addAnnotation(promptAnnotation)
					})
				}

				// Meta promptCont
				if (data.all === promptContKey) {
					// Annotate all but lines in the other property
					codeBlock.getLines().forEach((line, index) => {
						if (!data.lines.includes(index)) {
							line.addAnnotation(promptContAnnotation)
						}
					})
				} else {
					data.contLines.forEach((index) => {
						codeBlock.getLine(index)?.addAnnotation(promptContAnnotation)
					})
				}
			},
		},
	}
}

function replaceMetaParts(meta: String, replacer: (metaPart: string) => string): string {
	const partsReplaced = []
	const parts = meta.split(' ');
	for (const metaPart of parts) {
		partsReplaced.push(replacer(metaPart))
	}
	return partsReplaced.join(' ')
}

export const pluginPromptData = new AttachedPluginData<{ lines: number[]; contLines: number[]; all?: PromptType }>(() => ({
	lines: [],
	contLines: [],
}))
