import { Box, Container, Link } from "@mui/material"
import { formatHTML } from "../lib/markdown"


export async function getStaticProps({ params }) {
  const content = await formatHTML('README.md')

  return {
    props: {
      content
    }
  }
}

export default function About({ content }) {
  return (
    <Container>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <Box sx={{ display: 'block', textAlign: 'center', p: 8 }}><Link href="/" >Back to Home</Link></Box>
    </Container>
  )
}