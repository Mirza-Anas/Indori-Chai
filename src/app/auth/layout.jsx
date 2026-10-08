import React from 'react'
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Sign In or Create an Account");

const layout = ({children}) => {
  return (
    <>
      {children}
    </>
  )
}

export default layout;
