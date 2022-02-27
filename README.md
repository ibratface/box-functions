# Box Functions ([DEMO](https://box-functions.vercel.app))

Box Functions is an experimental web IDE and code execution platform for Box custom apps.



## Precautions

Box Functions is currently EXPERIMENTAL so use it at your own risk. Here are some basic precautions to take:

- DO NOT grant your Box app enterprise permissions
- DO NOT grant your Box app access to important production files or folders

## Usage

### Create a Box Custom App

1. Create a [Box Custom App](https://developer.box.com/guides/applications/custom-apps/) from the Box developer console. Choose [JWT](https://developer.box.com/guides/authentication/jwt/) as your authentication method.

2. Use the Configuration tab to set your app permissions and obtain admin approval for your app.
   
3. In the **Add and manage public keys** section, generate a public/private keypair. This will automatically download a json file with your app credentials. You'll need to provide the contents of this file to authenticate your app later.

### Creating your Function

1. Sign in to the Box Functions app with your Box account.

1. Give your new function a name and create it

1. In the function page, paste in the contents of the json file downloaded from your Box app configuration page into the credentials text area.

1. Write your code in the code text area. Your code will be provided a [BoxClient](https://github.com/box/box-node-sdk#app-auth-client) instance from the [Box Node SDK](https://github.com/box/box-node-sdk) and a [Console](https://nodejs.org/api/console.html) instance that you can use for logging. Async/await syntax is supported.

1. Click **Run** to execute your code. Any logging made using the console will displayed in the output section when your exection ends.

## How it Works

Function files are saved to your Box account under a root folder named **Box Functions**. When you request to run it, the server will download it from your account, then compile and execute it in a sandbox environment.

## Motivation

Box Functions is intended to make Box customization easy and accessible. It is a "yes-code" solution supplemental to Box Relay workflows. It is a repository for useful and reusable scripts.

## Feature Wishlist

- **Shared links** - for sharing your code
- **Execution logs** - store logs of previous function runs
- **Versioning** - restore previous versions
- **Box Webhook triggers** - easily trigger your function using a webhook from Box
- **Trigger event queueing** - remove the complexity of dealing with multiple concurrent triggers and handle events from a queue
- **Sandbox security controls** - additional sandboxing security measures
- **Schedule triggers** - trigger your functions on a specific date or a regular basis

## Feedback

Send your mild or strong opinions and beer money to: <a href="mailto:tso@box.com">tso@box.com</a>. Or you know, slack me.