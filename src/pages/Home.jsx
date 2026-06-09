import { useSearchParams } from 'react-router-dom';
import GameShowcase from '../components/GameShowcase';
import GenreGame from '../components/GenreGame';
import WhatsPixelPlay from '../components/WhatsPixelPlay';

const Home = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  return (
    <>
      <GameShowcase search={search} />
      <GenreGame />
      <WhatsPixelPlay />
    </>
  );
};

export default Home;