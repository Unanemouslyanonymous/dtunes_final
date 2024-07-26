"use client"
import React from 'react'

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <><div>{children}</div>
    <div className="flex justify-center">
        {/* <MusicPlaybar /> */}
      </div>
    </>
    
  )
}

export default Dashboard