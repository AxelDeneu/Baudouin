import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Baudouin - The next manga downloader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center flex-1 w-full px-6 text-center">
        {children}
      </main>

      <footer className="flex items-center justify-center w-full h-24 mt-8 border-t">
        <a
          className="flex items-center justify-center"
          href="https://adeneu.pro"
          target="_blank"
        >
          Made by <span className="mx-1 font-bold">Axel DENEU</span> with{' '}<span className="ml-1 text-red-500">♥</span>
        </a>
      </footer>
    </div>
  )
}
