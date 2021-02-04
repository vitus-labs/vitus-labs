import React from 'react'
import Button, { ProviderButton, ButtonConsumer } from './Button'

export default {
  component: Button,
  title: 'Button',
}

export const button = () => (
  <>
    <Button />
    <Button secondary state="secondary" multiple={['centered']} />
  </>
)

export const childrenStyling = () => (
  <>
    <ProviderButton>
      <ButtonConsumer>inner text component</ButtonConsumer>
    </ProviderButton>
  </>
)
