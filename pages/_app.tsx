import '../styles/global.css'
import { AppProps } from 'next/app'
import { ThemeProvider, createGlobalStyle } from 'styled-components'

const theme = {
  backgroundColor: 'white'
}

type Theme = typeof theme

const GlobalStyle = createGlobalStyle<Theme>`
  body {
    background-color: ${(props) => props.backgroundColor}
  }
`

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle backgroundColor={theme.backgroundColor} />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App