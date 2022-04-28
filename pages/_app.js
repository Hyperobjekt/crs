import { Helmet, HelmetProvider } from "react-helmet-async";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import "./../styles/globals.css";

function App({ Component, pageProps }) {
  const gTagId = "UA-297340-22";

  return (
  	<HelmetProvider>
  		<Helmet>
  			<title>Critical Race Studies</title>
  			<meta name="viewport" content="initial-scale=1, width=device-width" />
  			<link rel="stylesheet" href="https://use.typekit.net/ilh8syv.css" />
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gTagId}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gTagId}', { page_path: window.location.pathname, });`,
          }}
        />
  		</Helmet>
	  	<Component {...pageProps} />
  	</HelmetProvider>
  )
}

export default App;