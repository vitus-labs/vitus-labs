import React from 'react'
import { Element } from '@vitus-labs/elements'
import { styles } from '@vitus-labs/unistyle'
import rocketstyle from '~/init'

const theme = {
  fontSize: {
    a: 12,
    b: 12,
  },
}

type Theme = Parameters<typeof styles>[0]['theme']
type ThemeDefinition = Theme & { hover: Theme } & { active: Theme }

const defaultDimensions = {
  gaps: 'state',
  sizes: 'size',
  variants: 'variant',
  // multiple: { propName: 'multiple', multi: true },
} as const

const Test = rocketstyle<typeof theme, ThemeDefinition>()({
  useBooleans: true,
  dimensions: defaultDimensions,
})({
  component: Element,
  name: 'Hello',
})
  .theme((t) => ({
    fontSize: t.fontSize.a,
    something: 'test',
    width: t.fontSize.b,
  }))
  .theme({
    fontSize: '4',
    width: '',
    size: '',
  })
  .theme<{ test: boolean }>((t, css) => ({
    fontFamily: '',
    color: 'black',
    height: t.fontSize.a,
    something: 'a',
    fontSize: t.fontSize.a,
    hover: {
      fontSize: t.fontSize.b,
      fontFamily: 'Arial',
    },
    extendCss: css`
      text-align: center;
    `,
  }))

const Component = (props) => (
  <Test
    contentAlignX="right"
    direction="inline"
    beforeContent
    afterContentAlignX
    beforeContentDirection="inline"
    {...props}
  />
)
