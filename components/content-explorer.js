import Head from "next/head";
import Script from "next/script";
import { useContext } from "react";
import { BoxContext } from "./context";


export default function ContentExplorer({ folderId = 140751590655 }) {
  const boxContext = useContext(BoxContext)

  return (
    <div className="container" style={{ height: 600 + 'px' }}>
      <Head>
        <link href="https://cdn01.boxcdn.net/platform/elements/13.0.0/en-US/explorer.css" rel="stylesheet"></link>
      </Head>
      <Script
        src="https://cdn01.boxcdn.net/platform/elements/13.0.0/en-US/explorer.js"
        strategy='afterInteractive'
        onLoad={() => {
          const contentExplorer = new Box.ContentExplorer();
          contentExplorer.show(folderId, boxContext.accessToken, {
            container: ".container"
          });
        }}
      />
    </div>
  )
}