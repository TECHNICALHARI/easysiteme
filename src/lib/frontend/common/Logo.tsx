import Image from 'next/image'
import React, { FC } from 'react'

interface Props {
    width?: number;
}
const Logo: FC<Props> = ({ width }) => {
    return (
        <div className={`logo`}>
            {/* <Image src="/logo.png" alt="myeasypage" width={width ? width : 100} height={30} /> */}
        </div>
    )
}

export default Logo
