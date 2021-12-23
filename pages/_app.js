import { Helmet, HelmetProvider } from "react-helmet-async";
import "../styles/globals.css";

function App({ Component, pageProps }) {

  return (
  	<HelmetProvider>
  		<Helmet>
  			<title>Critical Race Studies</title>
  		</Helmet>
	  	<Component {...pageProps} />
  	</HelmetProvider>
  )
}

export default App;