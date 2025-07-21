import React, { FC } from 'react'
import { FormData } from '../../types/form'
import styles from '@/styles/admin.module.css';
interface props {
  form: FormData
}
const MobilePreview: FC<props> = () => {
  return (
    <div className={styles.preview}>
      <h2>Hello</h2>
    </div>
  )
}

export default MobilePreview