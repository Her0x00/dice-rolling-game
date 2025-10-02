import { db } from '@/lib/db'
import React from 'react'

export default async function page() {
  console.log(db)
  return (<div>page</div>
  )
}
