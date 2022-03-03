import MetaMaskAccountProvider from '../components/meta-mask-account-provider'

function MyApp({ Component, pageProps }) {
  return (
    <MetaMaskAccountProvider>
      <Component {...pageProps} />
    </MetaMaskAccountProvider>
  )
}

export default MyApp
