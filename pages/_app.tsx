import 'styles/global.css'
import { AppProps } from 'next/app'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import ProgressBar from 'components/base/ProgressBar'
import { DefaultTheme } from 'styled-components'
import { Classes } from '@blueprintjs/core'
import * as Sentry from '@sentry/node'

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
})

const theme: DefaultTheme = {
  backgroundColor: '#faeee7',
  headlineColor: '#33272a',
  textColor: '#594a4e',
  buttonTextColor: '#33272a',
  borderColor: '#33272a',
  primaryColor: '#faae2b',
  secondaryColor: '#ffa8ba',
  tertiaryColor: '#fa5246',
  whiteBackground: '#fffffe'
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props => props.theme.textColor)};
    font-family: 'Nunito Sans';
  }

  .${Classes.HEADING} {
    color: ${(props) => props.theme.headlineColor};
  }

  .${Classes.INPUT} {
    background-color: ${(props) => props.theme.whiteBackground};
  }
`

function App({ Component, pageProps, err }: AppProps & { err: any }) {
  return (
    <ThemeProvider theme={theme}>
      <ProgressBar />
      <GlobalStyle />
      <Component {...pageProps} err={err} />
    </ThemeProvider>
  )
}

export default App