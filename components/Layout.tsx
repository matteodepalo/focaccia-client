import { Navbar as BPNavbar, Alignment, AnchorButton, Menu, Popover, HTMLSelect } from "@blueprintjs/core"
import Head from "next/head"
import { FunctionComponent, useContext } from "react"
import { Box } from "rebass/styled-components"
import Link from "next/link"
import { useRouter } from 'next/router'
import styled from "styled-components"
import UserContext from "lib/UserProvider"
import { icon } from "lib/icons"
import createLoginUrl from "lib/url-helpers"
import i18n from 'i18n'

const Navbar = styled(BPNavbar)`
  background-color: ${(props) => props.theme.backgroundColor}
`

const Layout: FunctionComponent = ({ children }) => {
  const router = useRouter()
  const user = useContext(UserContext)
  const [t, { language }] = i18n.useTranslation()

  const userMenu = <Menu>
    <Menu.Item icon={icon("log-out")} text={t('logout')} href="/api/logout" />
  </Menu>

  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>
            {user ?
              <Popover content={userMenu}>
                <AnchorButton minimal={true} icon={icon("user")} text={user.nickname} />
              </Popover>
            : <AnchorButton minimal={true} icon={icon("log-in")} text={t('login')} href={createLoginUrl()} />}
          </Navbar.Heading>

          <Navbar.Divider />

          <HTMLSelect minimal={true} options={['en', 'it', 'ja']} value={language} onChange={(event) => {
            i18n.i18n.changeLanguage(event.target.value)
          }}/>

          {user &&
            <>
              <Navbar.Divider />

              <Link href="/recipes">
                <AnchorButton minimal={true} icon={icon("recipe")} text={t('recipes')} disabled={router.pathname === '/recipes'} />
              </Link>
              <Link href="/recipes/new">
                <AnchorButton minimal={true} icon={icon("add")} text={t('add')} disabled={router.pathname === '/recipes/new'} />
              </Link>
            </>}
        </Navbar.Group>
      </Navbar>

      <Box maxWidth={1024} height="100%" p={4}>
        <Head>
          <title>Focaccia</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        </Head>
        {children}
      </Box>
    </>
  )
}

export default Layout