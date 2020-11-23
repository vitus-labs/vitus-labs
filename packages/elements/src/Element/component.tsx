import React, { forwardRef } from 'react'
import { renderContent } from '@vitus-labs/core'
import { Wrapper, Content } from '~/helpers'
import {
  transformVerticalProp,
  calculateSubTag,
  getShouldBeEmpty,
} from './utils'
import { AlignX, AlignY, Direction } from '~/types'
import type { Props } from './types'

const defaultDirection = 'inline'
const defaultAlignX = 'left'
const defaultAlignY = 'center'

const Component = forwardRef<any, Props>(
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

    let SUB_TAG
    if (__WEB__) {
      if (tag) {
        SUB_TAG = calculateSubTag(tag)
      }
    }

    // --------------------------------------------------------
    // direction & alignX calculations
    // --------------------------------------------------------
    let wrapperDirection: Direction = defaultDirection
    let wrapperAlignX: AlignX = alignX
    let wrapperAlignY: AlignY = alignY

    if (isSimple) {
      if (contentDirection) wrapperDirection = contentDirection
      if (contentAlignX) wrapperAlignX = contentAlignX
      if (contentAlignY) wrapperAlignY = contentAlignY
    } else if (direction) {
      wrapperDirection = direction
    } else if (vertical !== undefined || vertical !== null) {
      wrapperDirection = transformVerticalProp(vertical)
    }

    return (
      <Wrapper
        {...props}
        {...WRAPPER_PROPS}
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
            {renderContent(beforeContent)}
          </Content>
        )}

        {beforeContent || afterContent ? (
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
        ) : (
          renderContent(CHILDREN)
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
            {renderContent(afterContent)}
          </Content>
        )}
      </Wrapper>
    )
  }
)

Component.displayName = 'vitus-labs/elements/Element'

export default Component
