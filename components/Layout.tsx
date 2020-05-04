import { Navbar, Alignment, AnchorButton } from "@blueprintjs/core"
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
  user: User | null,
  loading: boolean
}

const Layout: FunctionComponent<Props> = ({ user, loading = false, children }) => {
  const router = useRouter()

  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Link href="/">
            <Navbar.Heading>
              <AnchorButton minimal={true} icon="home" text="Focaccia" disabled={router.pathname === '/recipes'} />
            </Navbar.Heading>
          </Link>

          <Navbar.Divider />

          {!loading &&
            (user ? (
              <>
                <Link href="/recipes">
                  <AnchorButton minimal={true} icon="document" text="Recipes" disabled={router.pathname === '/recipes'} />
                </Link>
                <Link href="/recipes/new">
                  <AnchorButton minimal={true} icon="plus" text="Add" disabled={router.pathname === '/recipes/new'} />
                </Link>

                <Navbar.Divider />

                <AnchorButton minimal={true} icon="log-out" text="Logout" href="/api/logout" />
              </>
            ) : (
              <AnchorButton minimal={true} icon="log-in" text="Login" href="/api/login" />
            ))}
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