import { Navbar, Alignment, AnchorButton, Menu, Popover, Spinner } from "@blueprintjs/core"
import Head from "next/head"
import { FunctionComponent } from "react"
import styled from "styled-components"
import { Box } from "reflexbox/styled-components"
import Link from "next/link"
import { useRouter } from 'next/router'
import { User } from "../lib/user"

const Container = styled(Box)`
  max-width: 1024px;
  height: 100%;
`

interface Props {
  user: User | null
  loading: boolean
}

const Layout: FunctionComponent<Props> = ({ user, loading = false, children }) => {
  const router = useRouter()

  const userMenu = <Menu>
    <Menu.Item icon="log-out" text="Logout" href="/api/logout" />
  </Menu>

  return (
    <>

      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          {loading ? <Spinner size={Spinner.SIZE_SMALL} /> :
          <>
            <Navbar.Heading>
              {user ?
                <Popover content={userMenu}>
                  <AnchorButton minimal={true} icon="user" text={user.nickname} />
                </Popover>
              : <AnchorButton minimal={true} icon="log-in" text="Login" href="/api/login" />}
            </Navbar.Heading>

            {user ?
              <>
                <Navbar.Divider />

                <Link href="/recipes">
                  <AnchorButton minimal={true} icon="document" text="Recipes" disabled={router.pathname === '/recipes'} />
                </Link>
                <Link href="/recipes/new">
                  <AnchorButton minimal={true} icon="plus" text="Add" disabled={router.pathname === '/recipes/new'} />
                </Link>
              </>
            : null}
          </>}
        </Navbar.Group>
      </Navbar>

      <Container p={4}>
        <Head>
          <title>Focaccia</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        </Head>
        {children}
      </Container>
    </>
  )
}

export default Layout