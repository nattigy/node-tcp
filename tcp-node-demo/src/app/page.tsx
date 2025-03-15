import Logs from "./components/Logs";
import Transactions from "./components/Transactions";

const Home: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <Transactions />
      <Logs />
    </div>
  );
};

export default Home;
