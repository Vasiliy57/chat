
import { useEffect, useState } from 'react'
import { User } from '../user/User'
import classes from './dialogs.module.css'
import { DialogsProps, IUser } from './types'
import { updateListMyDialogs } from '@/firebase/users/updateListMyDialogs'
import { getAllUsersFireStore } from '@/firebase/users'
import { onValue, ref } from 'firebase/database'
import { dbRealTime } from '@/firebase/realTimeDataBase'

export const Dialogs: React.FC<DialogsProps> = ({ isMyDialogs, myUserId, onSelectDialog, currentDialogUser, onSwitchDialogs }) => {
  const [dialogUserList, setDialogUserList] = useState<IUser[]>([])
  const [searchDialogUserList, setSearchDialogUserList] = useState<IUser[]>([])
  const userList = isMyDialogs ? dialogUserList : searchDialogUserList

  useEffect(() => {

    const myDialogsRef = ref(dbRealTime, 'dialogsUsers/' + myUserId + '/dialogs')
    onValue(myDialogsRef, async (snapshot) => {
      const data = await snapshot.val()
      const users = await updateListMyDialogs(Object.keys(data))
      setDialogUserList(users)
    })

  }, [])

  useEffect(() => {
    if (isMyDialogs && dialogUserList.length > 0) {

    } else if (!isMyDialogs) {
      getAllUsersFireStore(myUserId)
        .then((users) => setSearchDialogUserList(users))
    }

  }, [isMyDialogs])

  return (
    <div className={isMyDialogs ? classes.dialogs : ''}>
      <div className={classes.btnGroup}>
        <button onClick={() => onSwitchDialogs(true)} className={classes.btn}>MY CHATS</button>
        <button onClick={() => onSwitchDialogs(false)} className={classes.btn}>SEARCH CHATS</button>
      </div>
      {
        userList.map((user, index) => {
          return <User
            key={index}
            userName={user.userName}
            email={user.email}
            userId={user.userId}
            isSelected={user.email === currentDialogUser?.email}
            onSelectDialog={onSelectDialog} />
        })
      }

    </div>
  )
}

