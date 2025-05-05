export const metadata = {
  title: 'Synthesizing Utopias',
  description: 'imaging collective futures since 2476',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
