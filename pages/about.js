import { Box, Container, Link } from "@mui/material"
import Header from "../components/header"

export default function AbcOutlined() {
  return (
    <Container>
      <Header></Header>
      <h2>Mom always said never login to strange apps.</h2>
      <p>
        { `Box Functions is a proof-of-concept code execution platform for Box custom apps. It's got a cloud Box Node SDK environment ready to go
        so all you have to do is configure your custom app, drop in your app settings and your code.` }
      </p>
      <p>
        { `It's in very early stages so don't trust it with anything important like your Bitcoin password.
        Login with your demo account and limit the permissions of your custom app. Also I have no idea how durable Vercel functions are, so try not to stress it too much.`}
      </p>

      <h2>Why are you doing this?</h2>
      <p>
        { `Well I get a lot of requests from customers about things they wish Relay could do. Obviously there are limits to no-code solutions,
        so I thought, "What about a yes-code solution?" I also notice we deploy quite a bit to Lambda and Azure Functions, so what if we can make that easy?` }
      </p>
      <p>
        { `Obviously it's still a long way to production. There are some major security and performance hurdles that need to be addressed. 
        For now my dream is just to turn this into an internal BC tool if there's enough interest.` }
      </p>

      <h2>What does it do?</h2>
      <p>
        { `For now, not a lot. It will provide your Node.js code with a Box client, run it on the server, then return anything you log to the console.
        But here are some ideas I'm toying with:` }
        <ul>
          <li>Shared Links</li>
          <li>Webhook Triggers</li>
          <li>Webhook Event Queues</li>
          <li>Schedule Triggers</li>
          <li>Sandbox Security Controls</li>
          <li>Execution Logging</li>
        </ul>
      </p>

      <h2>How does it work?</h2>
      <p>
        { `Your function files are saved to your Box account under a root folder named <strong>Box Functions</strong>.
        When you request to run it, the server will download it from your account, compile it and run it in a sandbox environment.` }
      </p>

      <h2>Who can I blame for this?</h2>
      <p>
        Send your mild or strong opinions and beer money to: <strong><a href="mailto:tso@box.com">tso@box.com</a></strong>. Or you know, slack me.
      </p>

      <Link href="/">Back to Home</Link>
    </Container>
  )
}