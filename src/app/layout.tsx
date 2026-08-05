import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import Navbar from './component/navbar/Navbar';
import NextAuthProvider from './NextAuthProvider';
import { ToastContainer } from 'react-toastify';

export const metadata = {
  title: "Aplikasi e-RB",
  description: "Aplikasi monitoring MBR PT Konimex",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  icons: {
    icon: "/konimex.ico"
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ height: "100%" }}>
        <NextAuthProvider>
          <Navbar></Navbar>
          <div className="container-fluid h-100">
            {children}
            <ToastContainer theme='colored' />
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
