import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const DynamicViewer = ({ initialValue }) => {
  return <Viewer initialValue={initialValue} />;
};

export default DynamicViewer;
