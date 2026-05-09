import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'TaskFlow',
  description: 'Team Task Manager',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Toaster position='top-right' />
        {children}
      </body>
    </html>
  )
}