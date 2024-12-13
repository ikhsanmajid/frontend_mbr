import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import Navbar from './component/navbar/Navbar';
import NextAuthProvider from './NextAuthProvider';
import ImportBootstrap from './BootstrapJS';


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
          </div>
        </NextAuthProvider>
        <ImportBootstrap />
      </body>
    </html>
  );
}
