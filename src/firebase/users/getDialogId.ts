import { showNotification } from '@shared/utils'
import { dbRealTime } from '../realTimeDataBase'
import { ref, child, get } from 'firebase/database'

export const getDialogId = async (
  myUserId: string | null,
  userId: string | null
) => {
  let dialogId: string | null = null

  const dbRef = ref(dbRealTime)

  await get(child(dbRef, `dialogsUsers/${myUserId}/dialogs/${userId}/dialogId`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        dialogId = snapshot.val()
      } else {
        console.log('No data available')
      }
    })
    .catch((error) => {
      showNotification('error', error.message)
    })
  return dialogId
}
