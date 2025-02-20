import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-10 h-10 text-primary"
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FFCB67] to-[#FFE5B1] text-transparent bg-clip-text">LedgerAI</h1>
        </div>

        <nav className="flex items-center gap-6">
          <a href="#features" className="text-[#FFCB67] hover:text-[#FFE5B1] transition-colors">Features</a>
          <a href="#about" className="text-[#FFCB67] hover:text-[#FFE5B1] transition-colors">About</a>
          <Link href="/app">
            <Button className="bg-primary text-black hover:bg-primary/90">
              Launch App
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#FFCB67] to-[#FFE5B1] text-transparent bg-clip-text">
            Explore Blockchain Data with Natural Language
          </h2>
          <p className="text-xl mb-8 text-[#FFCB67]/90">
            Ask questions about Ethereum transactions, wallets, and smart contracts in plain English.
            Let AI do the heavy lifting.
          </p>
          <Link href="/app">
            <Button size="lg" className="bg-primary text-black hover:bg-primary/90">
              Start Exploring
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-24 grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFCB67] to-[#FFE5B1] text-transparent bg-clip-text">
              Sonic Blockchain Integration
            </h3>
            <ul className="space-y-4 text-[#FFCB67]/80">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>High-performance blockchain data indexing and querying</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Real-time transaction monitoring and analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Advanced smart contract interaction tracking</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFCB67] to-[#FFE5B1] text-transparent bg-clip-text">
              Natural Language Search
            </h3>
            <ul className="space-y-4 text-[#FFCB67]/80">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>"Show me the top 10 Ethereum holders"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>"Find the largest transactions in the last 7 days"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>"Which wallet interacted with Uniswap the most?"</span>
              </li>
            </ul>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="mt-24 max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#FFCB67] to-[#FFE5B1] text-transparent bg-clip-text">About Us</h3>
          <p className="text-lg text-[#FFCB67]/80">
            LedgerAI combines the power of artificial intelligence with Sonic Blockchain's
            cutting-edge infrastructure to make blockchain data accessible to everyone.
            Whether you're a trader, researcher, or just curious about blockchain,
            we provide intuitive natural language interfaces to explore and understand
            blockchain data.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center">
        <p className="mb-2 text-[#FFCB67]">Made with ❤️ by BA Team</p>
        <a
          href="mailto:contact@buildersacademy.ai"
          className="text-primary hover:text-[#FFE5B1] transition-colors"
        >
          contact@buildersacademy.ai
        </a>
      </footer>
    </div>
  );
}