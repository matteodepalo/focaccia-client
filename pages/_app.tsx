import '../styles/global.css'
import { AppProps } from 'next/app'
import { ThemeProvider, createGlobalStyle } from 'styled-components'

const theme = {
  backgroundColor: '#293742'
}

const GlobalStyle = createGlobalStyle<typeof theme>`
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