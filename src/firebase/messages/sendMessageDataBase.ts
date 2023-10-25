import { getCurrentDate } from '@shared/utils/currentDate'
import { ref, child, push, update } from 'firebase/database'
import { dbRealTime } from '../realTimeDataBase'

export const sendMessageDataBase = (
  textMessage: string,
  type: string,
  dialogId: string,
  email: string,
  userName: string
) => {
  const message = {
    type,
    content: textMessage,
    date: getCurrentDate(),
    email,
    userName,
  }

  // Get a key for a new Post.
  const newMessageKey = push(
    child(ref(dbRealTime), 'messages/' + dialogId + '/')
  ).key

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates: any = {}
  updates['messages/' + dialogId + '/' + 'allMessages/' + newMessageKey] =
    message
  updates['messages/' + dialogId + '/' + 'lastMessage'] = message

  return update(ref(dbRealTime), updates)
}
