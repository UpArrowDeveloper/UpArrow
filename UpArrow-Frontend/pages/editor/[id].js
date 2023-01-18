import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import api from '../../apis';
import Editor from '../../components/Editor';

const App = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useQuery(['post', id], api.post.getId(id));
  if (isLoading) {
    return null;
  }
  return <Editor editData={data} />;
};

export default App;
