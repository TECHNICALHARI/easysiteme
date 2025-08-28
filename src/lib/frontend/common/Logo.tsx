import Image from 'next/image'
import React from 'react'

const Logo = () => {
    return (
        <div className="logo">
            <Image src="/logo.png" alt="myeasypage" width={100} height={30} />
        </div>
    )
}

export default Logo
