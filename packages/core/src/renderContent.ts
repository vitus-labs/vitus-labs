import {
  createElement,
  isValidElement,
  cloneElement,
  Children,
  ReactNode,
} from 'react'
import isEmpty from './isEmpty'

type RenderContent = (
  content?: ReactNode,
  attachProps?: Record<string, any>
) => ReactNode

const renderContent: RenderContent = (content, attachProps = {}) => {
  if (!content) return null

  if (Array.isArray(content)) {
    return content
  }

  if (typeof content === 'function') {
    // @ts-ignore
    return createElement(content, attachProps)
  }

  if (isValidElement(content)) {
    if (isEmpty(attachProps)) {
      return content
    }

    return cloneElement(Children.only(content), attachProps)
  }

  if (typeof content === 'object' && !isEmpty(content)) {
    // FIXME: quick fix for rendering invalid elements
    // no idea of what is going on here yet
    // @ts-ignore
    return createElement(content, attachProps)
  }

  return content
}

export default renderContent
