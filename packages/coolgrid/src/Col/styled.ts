import { config } from '@vitus-labs/core'
import {
  makeItResponsive,
  normalizeUnit,
  extendedCss,
  StylesCb,
} from '@vitus-labs/unistyle'
import { hasValue, isVisible, isNumber } from '~/utils'
import { CssOutput, StyledTypes } from '~/types'

type HasWidth = (size?: number, columns?: number) => boolean

const hasWidth: HasWidth = (size, columns) =>
  hasValue(size) && hasValue(columns)

type WidthStyles = (
  props: Pick<StyledTypes, 'size' | 'columns' | 'gap' | 'RNparentWidth'>,
  defaults: { rootSize?: number }
) => CssOutput

const widthStyles: WidthStyles = (
  { size, columns, gap, RNparentWidth },
  { rootSize }
) => {
  if (!hasWidth(size, columns)) {
    return ''
  }

  // calculate % of width
  const width = __WEB__
    ? (size / columns) * 100
    : (RNparentWidth / columns) * size

  const hasGap = hasValue(gap)

  // eslint-disable-next-line no-nested-ternary
  const value = __WEB__
    ? hasGap
      ? `calc(${width}% - ${gap}px)`
      : `${width}%`
    : hasGap
    ? width - gap
    : width

  return config.css`
      flex-grow: 0;
      flex-shrink: 0;
      max-width: ${normalizeUnit({ param: value, rootSize })};
      flex-basis: ${normalizeUnit({ param: value, rootSize })};
    `
}

type SpacingStyles = (
  type: 'margin' | 'padding',
  value: number,
  rootSize?: number
) => CssOutput
const spacingStyles: SpacingStyles = (type, value, rootSize) => {
  if (!isNumber(value)) {
    return ''
  }

  return config.css`
      ${type}: ${normalizeUnit({ param: value / 2, rootSize })};
    `
}

const styles: StylesCb<StyledTypes> = ({ theme, css, rootSize }) => {
  const { size, columns, gap, padding, extendCss, RNparentWidth } = theme
  const renderStyles = isVisible(size)

  if (renderStyles)
    return css`
      left: initial;
      position: relative;
      ${widthStyles({ size, columns, gap, RNparentWidth }, { rootSize })}
      ${spacingStyles('margin', gap, rootSize)};
      ${spacingStyles('padding', padding, rootSize)};
      ${extendedCss(extendCss)};
    `

  return css`
    left: -9999px;
    position: fixed;
    margin: 0;
    padding: 0;
  `
}

export default config.styled(config.component)`
  ${
    __WEB__ &&
    config.css`
      box-sizing: border-box;
    `
  };

  position: relative;
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
  flex-direction: column;
  justify-content: stretch;

  ${makeItResponsive({
    key: '$coolgrid',
    styles,
    css: config.css,
    normalize: true,
  })};
`
