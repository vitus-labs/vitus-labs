/* eslint-disable no-underscore-dangle */
import type {
  ThemedCssFunction,
  StyledInterface,
  DefaultTheme,
  ThemeProviderComponent,
} from 'styled-components'

const OPTIONS: Internal = {} as Internal

const init: any = ({
  styled,
  css,
  context,
  component = 'div',
  textComponent = 'span',
}) => {
  OPTIONS.css = css
  OPTIONS.styled = styled
  OPTIONS.styledContext = context
  OPTIONS.component = component
  OPTIONS.textComponent = textComponent
}

interface Internal {
  css: ThemedCssFunction<DefaultTheme>
  styled: StyledInterface
  styledContext: ThemeProviderComponent<any, any>
  component: any
  textComponent: any
}

const internal: Internal = Object.freeze({
  get css() {
    return OPTIONS.css
  },
  get styled() {
    return OPTIONS.styled
  },
  get styledContext() {
    return OPTIONS.styledContext
  },
  get component() {
    return OPTIONS.component
  },
  get textComponent() {
    return OPTIONS.textComponent
  },
})

export { init }
export default internal
