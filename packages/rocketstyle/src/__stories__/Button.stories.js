import Button, { HoistedButton, ElementExample } from './Button'

// console.log(Button)

storiesOf('ROCKETSTYLE | Element', module).add('Button', () => {
  return (
    <>
      <Button active />
      <HoistedButton>
        <ElementExample>sometext inside</ElementExample>
      </HoistedButton>
    </>
  )
})
