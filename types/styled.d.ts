import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    backgroundColor: string,
    headlineColor: string,
    textColor: string
    buttonTextColor: string,
    borderColor: string,
    primaryColor: string,
    secondaryColor: string,
    tertiaryColor: string,
    whiteBackground: string
  }
}