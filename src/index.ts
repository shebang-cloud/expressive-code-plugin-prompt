import { AttachedPluginData, ExpressiveCodePlugin, replaceDelimitedValues } from '@expressive-code/core'
import rangeParser from 'parse-numeric-range'
import { selectAll } from 'hast-util-select'
import { promptStyleSettings, getPromptBaseStyles } from './styles'

export interface PluginPromptOptions {
	styleOverrides?: Partial<typeof promptStyleSettings.defaultSettings> | undefined
}

export function pluginPrompt(options: PluginPromptOptions = {}): ExpressiveCodePlugin {
	return {
		name: 'Prompt',
		baseStyles: ({ theme, coreStyles, styleOverrides }) => getPromptBaseStyles(theme, coreStyles, { ...styleOverrides.prompt, ...options.styleOverrides }),
		hooks: {
			preprocessMetadata: ({ codeBlock }) => {
				codeBlock.meta = replaceDelimitedValues(
					codeBlock.meta,
					({ fullMatch, key, value }) => {
						// If we aren't interested in the entry, just return it as-is
						if (key !== 'prompt') return fullMatch

						const lineNumbers = rangeParser(value)
						const data = pluginPromptData.getOrCreateFor(codeBlock)
						data.lines = lineNumbers
						return ''
					},
					{
						valueDelimiters: ['"', "'", '/', '{...}'],
						keyValueSeparator: '=',
					}
				)
			},
			annotateCode: () => {
				return
			},
			postprocessRenderedBlock: ({ codeBlock, renderData }) => {
				const data = pluginPromptData.getOrCreateFor(codeBlock)
				if (data.lines.length == 0) {
					return
				}
				const lines = selectAll('pre > code div.ec-line', renderData.blockAst)
				data.lines.forEach((linenum) => {
					if (linenum >= lines.length) {
						return
					}
					lines[linenum].children.forEach((span) => {
						if (span.type === 'element' && span.properties) {
							span.properties.style = null
						}
					})
				})
			},
		},
	}
}

export const pluginPromptData = new AttachedPluginData<{ lines: number[] }>(() => ({ lines: [] }))
