import { Navbar, Alignment, Button, AnchorButton } from "@blueprintjs/core"
import Head from "next/head"
import { FunctionComponent } from "react"
import styled from "styled-components"
import { Box } from "reflexbox/styled-components"
import Link from "next/link"
import { useRouter } from 'next/router'

const Container = styled(Box)`
  max-width: 1024px;
  height: 100%;
`

const Layout: FunctionComponent = ({ children }) => {
  const router = useRouter()

  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Focaccia</Navbar.Heading>
          <Navbar.Divider />
          <Link href="/">
            <AnchorButton minimal={true} icon="document" text="Recipes" disabled={router.pathname === '/'} />
          </Link>
          <Link href="/recipes/new">
            <Button minimal={true} icon="plus" text="Add" disabled={router.pathname === '/recipes/new'} />
          </Link>
        </Navbar.Group>
      </Navbar>

      <Container p={4}>
        <Head>
          <title>Focaccia</title>
        </Head>
        {children}
      </Container>
    </>
  )
}

export default Layout