import { Helmet, HelmetProvider } from "react-helmet-async";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import "./../styles/globals.css";

function App({ Component, pageProps }) {
  return (
  	<HelmetProvider>
  		<Helmet>
  			<title>Critical Race Studies</title>
  			<meta name="viewport" content="initial-scale=1, width=device-width" />
  			<link rel="stylesheet" href="https://use.typekit.net/ilh8syv.css" />
  		</Helmet>
	  	<Component {...pageProps} />
  	</HelmetProvider>
  )
}

export default App;