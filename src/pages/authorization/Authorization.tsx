import { useState } from 'react'
import { useAppDispatch } from '@shared/hooks'

import { Button, FormTitle, Input } from '@/shared/ui'
import { Link } from 'react-router-dom'
import { showNotification } from '@shared/utils'

import { signInUserFirebase } from '@/firebase'
import { setUser } from '@/shared/store/profile'
import { getUser } from '@/firebase/users'

import { BUTTON_TYPE, BUTTON_CLASS_NAME } from '@shared/constants'
import { INPUT_CLASS_NAME } from '@shared/constants'

import classes from './style.module.css'

export const Authorization: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const dispatch = useAppDispatch()

  const handlerEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 64) {
      setEmail(e.target.value)
    } else {
      showNotification('info', 'The maximum length has been reached!')
    }
  }

  const handlerPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 14) {
      setPassword(e.target.value)
    } else {
      showNotification('info', 'The maximum length has been reached!')
    }
  }

  const handlerBtnLogin = async () => {
    try {
      const userData = await signInUserFirebase(email, password)
      const data = await getUser(userData.user.uid)
      if (data) {
        dispatch(
          setUser({
            email: userData.user.email,
            emailVerified: userData.user.emailVerified,
            userId: userData.user.uid,
            userName: data.userName,
            avatar: data.avatar,
            infoAboutMe: data.infoAboutMe,
            number: data.number,
            address: data.address,
          })
        )
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      showNotification('error', error.message)
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className={classes.authorization}>
      <form className={classes.form}>
        <FormTitle title="Authorization" />
        <Input
          onChange={handlerEmail}
          inputClassName={INPUT_CLASS_NAME.FORM}
          placeholder="Email"
          type="email"
          value={email}
        />
        <Input
          placeholder="Password"
          onChange={handlerPassword}
          type="password"
          value={password}
          inputClassName={INPUT_CLASS_NAME.FORM}
        />
        <Button
          buttonType={BUTTON_TYPE.BUTTON}
          content={'Log in'}
          onClick={handlerBtnLogin}
          buttonClassName={BUTTON_CLASS_NAME.FORM}
        />

        <div className={classes.text}>
          DON’T HAVE AN ACCOUNT ?<span> </span>
          <Link className={classes.link} to="/registration">
            CREATE ONE{' '}
          </Link>
        </div>
      </form>
    </div>
  )
}
