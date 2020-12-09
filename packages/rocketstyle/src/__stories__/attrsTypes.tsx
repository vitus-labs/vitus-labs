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

type ThemeType = Parameters<typeof styles>[0]['theme']

const defaultDimensions = {
  states: 'state',
  sizes: 'size',
  variants: 'variant',
  multiple: { propName: 'multiple', multi: true },
} as const

const Test = rocketstyle<typeof theme, ThemeType>()({
  useBooleans: false,
  dimensions: defaultDimensions,
})({
  component: Element,
  name: 'Hello',
})

  .attrs(({ contentAlignX }) => ({
    contentAlignX,
    beforeContentAlignX: 'left',
  }))
  .attrs<{ something: boolean }>(({ beforeContentAlignX }) => ({
    afterContentAlignX: beforeContentAlignX,
    contentAlignX: beforeContentAlignX,
  }))
  .attrs(({ vertical, ...props }) => ({
    content: 'a',
    beforeContentAlignX: 'left',
    something: true,
    children: 'a',
    test: true,
  }))
  .attrs({
    beforeContentAlignX: 'right',
    contentAlignX: 'right',
  })
  // .attrs((p) => ({
  //   beforeContentAlignX: 'right',
  //   afterContent: p.afterContent,
  // }))
  .styles(
    (css) => css`
      text-align: center;
    `
  )
  .attrs({
    beforeContent: false,
    beforeContentAlignX: 'left',
    afterContentAlignX: 'left',
  })
  // .variants((t, css) => ({
  //   primary: {
  //     fontSize: t.fontSize.a,
  //     size: t.fontSize.a,
  //     some: 'a',
  //     width: t.fontSize.a,
  //     extendCss: css`
  //       text-align: center;
  //     `,
  //   },
  // }))
  // .variants((t, css) => ({
  //   secondary: {
  //     fontSize: t.fontSize.a,
  //     size: t.fontSize.a,
  //     some: 'a',
  //     width: t.fontSize.a,
  //     extendCss: css`
  //       text-align: center;
  //     `,
  //   },
  // }))
  .sizes({
    xl: {
      fontSize: 10,
    },
    sm: {
      fontSize: 10,
    },
  })
  // .sizes((t) => ({
  //   xl: {
  //     fontSize: t.fontSize.a,
  //   },
  //   sm: {
  //     fontSize: t.fontSize.a,
  //   },
  // }))
  // .sizes((t) => ({
  //   xxxl: {
  //     fontSize: t.fontSize.a,
  //   },
  // }))
  // .variants((t) => ({
  //   primary: {
  //     fontSize: t.fontSize.a,
  //     size: t.fontSize.a,
  //     some: 'a',
  //   },
  // }))
  .multiple((t) => ({
    multiKey: null,
  }))
  .theme({
    fontFamily: '',
    fontSize: 4,
  })

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

export default Component
