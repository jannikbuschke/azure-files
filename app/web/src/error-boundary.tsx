import { Alert } from "@mantine/core"
import * as React from "react"

function getErrorMessage(error:any){
  switch (typeof error){
    case "undefined": return null;
    case "object":return error===null?null:error.toString()
    case "string":return error
  }
  return null
}

export class ErrorBoundary extends React.Component<{},{hasError:boolean,error:any}> {
  constructor(props) {
    super(props)
    this.state = { hasError: false,error:null }
  }

  static getDerivedStateFromError(error:any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error:error }
  }

  override componentDidCatch(error:any, errorInfo:any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo)
  }

  override render() {

    if (this.state.hasError) {
      const error = getErrorMessage(this.state.error)
      // You can render any custom fallback UI
      return <Alert variant="filled" color="red">Something went wrong. {error}</Alert>
    }

    return this.props.children
  }
}
