"use client"

import { Fragment } from "react"
import dynamic from "next/dynamic"

export default function Home() {
  const Map = dynamic(() => import("../components/Map"), { ssr: false })
  return (
    <Fragment>
      <Map />
    </Fragment>
  )
}
