import OrderBook from "../components/OrderBook";
import TradeList from "../components/TradeList";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-2 md:px-12">
      <h1 className="text-4xl font-bold text-center text-zinc-50 my-10">
        Real-Time Order Book Visualizer
      </h1>
      <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-stretch">
        <div className="w-full md:w-7/12">
          <OrderBook />
        </div>
        <div className="w-full md:w-5/12">
          <TradeList />
        </div>
      </div>
    </div>
  );
}
