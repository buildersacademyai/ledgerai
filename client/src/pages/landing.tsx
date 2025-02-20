import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFCB67] to-[#FFE5B1]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-10 h-10"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M20 12V8H6a2 2 0 01-2-2 2 2 0 012-2h12v4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 6v12a2 2 0 002 2h14v-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 12H4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-2xl font-bold">LedgerAI</h1>
        </div>
        
        <nav className="flex items-center gap-6">
          <a href="#about" className="hover:text-primary">About Us</a>
          <Link href="/app">
            <Button className="bg-primary text-white hover:bg-primary/90">
              Launch App
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Explore Blockchain Data with Natural Language
          </h2>
          <p className="text-xl mb-8">
            Ask questions about Ethereum transactions, wallets, and smart contracts in plain English.
            Let AI do the heavy lifting.
          </p>
          <Link href="/app">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              Start Exploring
            </Button>
          </Link>
        </div>

        {/* About Section */}
        <div id="about" className="mt-24 max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">About Us</h3>
          <p className="text-lg">
            LedgerAI combines the power of artificial intelligence with blockchain
            technology to make crypto data accessible to everyone. Whether you're
            a trader, researcher, or just curious about blockchain, we've got you covered.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center">
        <p className="mb-2">Made with ❤️ by BA Team</p>
        <a
          href="mailto:contact@buildersacademy.ai"
          className="text-primary hover:underline"
        >
          contact@buildersacademy.ai
        </a>
      </footer>
    </div>
  );
}
