import AppContext from '../components/context'
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  return (
    <AppContext>
      <Component {...pageProps} />
    </AppContext>
  )
}

export default MyApp
