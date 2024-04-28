import Editor from "../../components/Editor";
import { MainLayout } from "../../Layouts";
import Head from "next/head";

const App = () => {
  return <Editor />;
};

function EditorPage(props) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
      </Head>
      <MainLayout>
        <App {...props} />
      </MainLayout>
    </>
  );
}

export default EditorPage;
