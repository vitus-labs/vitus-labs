import { pick, get } from '@vitus-labs/core'

export const isNumber = (value) => Number.isFinite(value)
export const hasValue = (value) => isNumber(value) && value > 0
export const isVisible = (value) =>
  (isNumber(value) && value !== 0) || value === undefined
export const hasWidth = (size, columns) =>
  !!(hasValue(size) && hasValue(columns))

// ------------------------------------------
// merging utility
// ------------------------------------------
export const merge = (props = {}, ctx = {}, reservedKeys) => {
  if (!reservedKeys) return { ...ctx, ...props }

  return {
    ...pick(ctx, reservedKeys),
    ...pick(props, reservedKeys),
  }
}
