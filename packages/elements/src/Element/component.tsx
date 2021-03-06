import React, { forwardRef, useMemo } from 'react'
import { renderContent } from '@vitus-labs/core'
import { PKG_NAME } from '~/constants'
import { Wrapper, Content } from '~/helpers'
import {
  transformVerticalProp,
  isInlineElement,
  getShouldBeEmpty,
} from './utils'

import type { Props } from './types'

const defaultDirection = 'inline'
const defaultAlignX = 'left'
const defaultAlignY = 'center'

const Component = forwardRef<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  Props
>(
  (
    {
      innerRef,
      tag,
      label,
      content,
      children,
      beforeContent,
      afterContent,

      block,
      equalCols,
      gap,

      vertical,
      direction,
      alignX = defaultAlignX,
      alignY = defaultAlignY,

      css,
      contentCss,
      beforeContentCss,
      afterContentCss,

      contentDirection = defaultDirection,
      contentAlignX = defaultAlignX,
      contentAlignY = defaultAlignY,

      beforeContentDirection = defaultDirection,
      beforeContentAlignX = defaultAlignX,
      beforeContentAlignY = defaultAlignY,

      afterContentDirection = defaultDirection,
      afterContentAlignX = defaultAlignX,
      afterContentAlignY = defaultAlignY,

      ...props
    },
    ref
  ) => {
    // --------------------------------------------------------
    // check if should render only single element
    // --------------------------------------------------------
    const shouldBeEmpty =
      !!props.dangerouslySetInnerHTML ||
      (__WEB__ && tag && getShouldBeEmpty(tag))

    // --------------------------------------------------------
    // common wrapper props
    // --------------------------------------------------------
    const WRAPPER_PROPS = {
      ref: ref || innerRef,
      extendCss: css,
      tag,
      block,
      contentDirection,
      alignX: contentAlignX,
      alignY: contentAlignY,
      as: undefined, // reset styled-components `as` prop
    }

    // --------------------------------------------------------
    // return simple/empty element like input
    // --------------------------------------------------------
    if (shouldBeEmpty) return <Wrapper {...WRAPPER_PROPS} {...props} />

    // --------------------------------------------------------
    // if not single element, calculate values
    // --------------------------------------------------------
    const isSimple = !beforeContent && !afterContent
    const CHILDREN = children || content || label

    const isInline = __WEB__ ? isInlineElement(tag) : false
    const SUB_TAG = __WEB__ && isInline ? 'span' : undefined

    // --------------------------------------------------------
    // direction & alignX & alignY calculations
    // --------------------------------------------------------
    const calculateDirection = () => {
      let wrapperDirection: typeof direction
      let wrapperAlignX: typeof alignX = alignX
      let wrapperAlignY: typeof alignY = alignY

      if (isSimple) {
        if (contentDirection) wrapperDirection = contentDirection
        if (contentAlignX) wrapperAlignX = contentAlignX
        if (contentAlignY) wrapperAlignY = contentAlignY
      } else if (direction) {
        wrapperDirection = direction
      } else if (vertical !== undefined && vertical !== null) {
        wrapperDirection = transformVerticalProp(vertical)
      } else {
        wrapperDirection = defaultDirection
      }

      return { wrapperDirection, wrapperAlignX, wrapperAlignY }
    }

    const { wrapperDirection, wrapperAlignX, wrapperAlignY } =
      calculateDirection()

    const beforeContentRender = useMemo(
      () => renderContent(beforeContent),
      [beforeContent]
    )

    const afterContentRender = useMemo(
      () => renderContent(afterContent),
      [afterContent]
    )

    return (
      <Wrapper
        {...props}
        {...WRAPPER_PROPS}
        isInline={isInline}
        direction={wrapperDirection}
        alignX={wrapperAlignX}
        alignY={wrapperAlignY}
      >
        {beforeContent && (
          <Content
            tag={SUB_TAG}
            contentType="before"
            parentDirection={wrapperDirection}
            extendCss={beforeContentCss}
            direction={beforeContentDirection}
            alignX={beforeContentAlignX}
            alignY={beforeContentAlignY}
            equalCols={equalCols}
            gap={gap}
          >
            {beforeContentRender}
          </Content>
        )}

        {isSimple ? (
          renderContent(CHILDREN)
        ) : (
          <Content
            tag={SUB_TAG}
            contentType="content"
            parentDirection={wrapperDirection}
            extendCss={contentCss}
            direction={contentDirection}
            alignX={contentAlignX}
            alignY={contentAlignY}
            equalCols={equalCols}
          >
            {renderContent(CHILDREN)}
          </Content>
        )}

        {afterContent && (
          <Content
            tag={SUB_TAG}
            contentType="after"
            parentDirection={wrapperDirection}
            extendCss={afterContentCss}
            direction={afterContentDirection}
            alignX={afterContentAlignX}
            alignY={afterContentAlignY}
            equalCols={equalCols}
            gap={gap}
          >
            {renderContent(afterContentRender)}
          </Content>
        )}
      </Wrapper>
    )
  }
)

const name = `${PKG_NAME}/Element`

Component.displayName = name
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Component.pkgName = PKG_NAME
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Component.VITUS_LABS__COMPONENT = name

export default Component
