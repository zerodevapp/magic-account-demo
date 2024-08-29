import Header from "./components/Header";
import "./App.css";
import Account from "./components/Account";
import AppSection from "./components/AppSection";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-row items-start justify-start w-full gap-4">
          <Account />
          <AppSection />
        </div>
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">{/* Footer content */}</div>
      </footer>
    </div>
  );
}

export default App;
