import { ExpressiveCodeAnnotation, AnnotationBaseOptions, AnnotationRenderOptions, Parent, addClass } from '@expressive-code/core'
import { promptClass, promptContClass } from './styles'

export type PromptType = 'prompt' | 'promptCont' | 'promptNone'
export const promptKey: PromptType = 'prompt'
export const promptContKey: PromptType = 'promptCont'

export class PromptAnnotation extends ExpressiveCodeAnnotation {
	type: PromptType;

	constructor({ type, ...baseOptions }: {type: PromptType} & AnnotationBaseOptions) {
		super(baseOptions)
		this.type = type;
	}

	render({ nodesToTransform }: AnnotationRenderOptions): Parent[] {
		return nodesToTransform.map((node) => {
			addClass(node, this.type === promptKey ? promptClass : promptContClass)
			return node
		})
	}
}

export const promptAnnotation = new PromptAnnotation({type: promptKey})
export const promptContAnnotation = new PromptAnnotation({type: promptContKey})
