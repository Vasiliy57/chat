import { useState, useEffect } from 'react'
import classes from './registration.module.css'
import { createNewUserFirebase } from '@/firebase'
import { Link, useNavigate } from 'react-router-dom'
import { Button, FormInput, FormTitle } from '@/shared/ui'
import { IData, IStateProfile, IUser } from '../types'
import { setUser } from '@/shared/store/profile'
import { saveUser } from '@/firebase/fireStore'
import { getUsers } from '@shared/store/users'
import { useAppDispatch } from '@shared/hooks'



export const Registration: React.FC = () => {
  const dispatch = useAppDispatch()

  const [userName, setUserName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [repeatPassword, setRepeatPassword] = useState<string>('')

  const handlerUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }
  const handlerEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const handlerPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const handlerRepeatPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value)
  }
  const handlerBtnReg = () => {
    if (password === repeatPassword) {
      createNewUserFirebase(email, password)
        .then((data: IData): IUser => data.user)
        .then(({ email, emailVerified }: IUser): void => {
          dispatch(setUser({ email, emailVerified, userName }))
        })
        .then(() => saveUser(email, userName))
        .then(() => dispatch(getUsers(email)))
        .catch((err) => {
          console.log(err.message)
        })

      setEmail('')
      setPassword('')
      setRepeatPassword('')
      setUserName('')
    } else {
      alert('Passwords don\'t match !!!')
    }
  }

  return (
    <div className={classes.registration}>
      <form className={classes.form}>
        <FormTitle title='Registration' />
        <FormInput placeholder='User Name' onChange={handlerUserName} value={userName} />
        <FormInput placeholder='Email' onChange={handlerEmail} type='email' value={email} />
        <FormInput placeholder='Password' onChange={handlerPassword} type='password' value={password} />
        <FormInput placeholder='Confirm Password' onChange={handlerRepeatPassword} type='password' value={repeatPassword} />
        <Button name='CREATE USER' onClick={handlerBtnReg} />
        <div className={classes.text}>
          ALREADY HAVE AN ACCOUNT ?<span> </span>
          <Link className={classes.link} to='/authorization'>LOGIN</Link>
        </div>
      </form>
    </div>
  )
}



