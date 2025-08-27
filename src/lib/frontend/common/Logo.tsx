import Image from 'next/image'
import React from 'react'

const Logo = () => {
    return (
        <div className="logo2">
            {/* my<span className="highlight">easy</span>page */}
            <Image src="/logo.png" alt="myeasypage" width={150} height={30} className='logo-image'  />
        </div>
    )
}

export default Logo
