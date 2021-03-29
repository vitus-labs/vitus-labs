// @ts-nocheck
import { isRocketComponent } from '@vitus-labs/rocketstyle'
import mainStory from '~/createStories/mainStory'
import dimensionStories from '~/createStories/dimensionStories'

export const rocketstories = (component) => {
  if (!isRocketComponent(component)) {
    throw Error('Component is not valid Rocketstyle component')
  }

  return createRocketstories({
    component,
    name: component.displayName || component.name,
    attrs: {},
  })
}

// type CreateRocketStories = <
//   A extends Record<string, unknown>,
//   B extends Record<string, unknown>
// >(
//   options: A,
//   defaultOptions: B
// ) => {
//   attrs: <T extends Record<string, unknown>>(
//     params: T
//   ) => CreateRocketStories<{ attrs: T }, B>
//   main: () => Record<string, unknown>
//   mainStory: () => ReturnType<typeof mainStory>
//   makeStories: () => ReturnType<typeof dimensionStories>
// }

export const createRocketstories = (
  options = {},
  defaultOptions = { attrs: {} }
) => {
  const result = {
    ...defaultOptions,
    name: options?.component
      ? options.component.displayName
      : defaultOptions.name,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
  }

  return {
    attrs: (attrs) => createRocketstories({ attrs }, result),

    // create object for `export default` in stories
    main: () => ({
      component: result.component,
      title: result.name,
    }),

    // generate main story
    mainStory: () => mainStory(result),

    // generate stories of defined dimension
    makeStories: (dimension, uniqIDs = false) =>
      dimensionStories({
        ...result,
        dimension,
        uniqIDs,
      }),
  }
}

export default rocketstories
