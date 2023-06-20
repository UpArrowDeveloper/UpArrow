import Editor from "../../components/Editor";
import { MainLayout } from "../../Layouts";

const App = () => {
  return <Editor />;
};

function EditorPage(props) {
  return (
    <MainLayout>
      <App {...props} />
    </MainLayout>
  );
}

export default EditorPage;
