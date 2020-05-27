import { Navbar, Alignment, AnchorButton, Menu, Popover } from "@blueprintjs/core"
import Head from "next/head"
import { FunctionComponent } from "react"
import { Box } from "reflexbox/styled-components"
import Link from "next/link"
import { useRouter } from 'next/router'
import { User } from "../lib/user"

interface Props {
  user: User | null
}

const Layout: FunctionComponent<Props> = ({ user, children }) => {
  const router = useRouter()

  const userMenu = <Menu>
    <Menu.Item icon="log-out" text="Logout" href="/api/logout" />
  </Menu>

  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>
            {user ?
              <Popover content={userMenu}>
                <AnchorButton minimal={true} icon="user" text={user.nickname} />
              </Popover>
            : <AnchorButton minimal={true} icon="log-in" text="Login" href="/api/login" />}
          </Navbar.Heading>

          {user &&
            <>
              <Navbar.Divider />

              <Link href="/recipes">
                <AnchorButton minimal={true} icon="document" text="Recipes" disabled={router.pathname === '/recipes'} />
              </Link>
              <Link href="/recipes/new">
                <AnchorButton minimal={true} icon="plus" text="Add" disabled={router.pathname === '/recipes/new'} />
              </Link>
            </>}
        </Navbar.Group>
      </Navbar>

      <Box maxWidth={1024} height={1} p={4}>
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