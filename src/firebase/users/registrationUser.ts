import { usersRef } from '../fireStore'
import { doc, setDoc } from 'firebase/firestore'

export const registrationUser = async (
  email: string,
  userName: string,
  userId: string,
  emailVerified: boolean
) => {
  try {
    setDoc(doc(usersRef, userId), {
      email,
      userName,
      userId,
      emailVerified,
      avatar: null,
      infoAboutMe: null,
      number: null,
      address: null,
    })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}
