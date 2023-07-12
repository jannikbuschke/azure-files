import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
// import "antd/dist/antd.css"
import { App } from "./App"
import * as serviceWorker from "./serviceWorker"
import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import dayjsDuration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import "dayjs/locale/de"
import "dayjs/locale/en"
import { RootProvider } from "./app/root-providers"
import { ErrorBoundary } from "./error-boundary"

dayjs.extend(LocalizedFormat)
dayjs.extend(dayjsDuration)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

ReactDOM.render(
  <ErrorBoundary>
    <React.Suspense fallback="Loading...">
      <RootProvider>
        <App />
      </RootProvider>
    </React.Suspense>
  </ErrorBoundary>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
