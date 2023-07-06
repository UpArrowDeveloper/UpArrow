// google callback

import { useRouter } from "next/router";
import { useEffect } from "react";
import storage from "../../../utils/storage";
import api from "../../../apis";
import axios from "axios";

const App = () => {
  const router = useRouter();

  const code = router.query.code;

  useEffect(() => {
    const login = async () => {
      if (!code) return;

      const res = await api.auth.authenticate(code)();
      storage.set("access_token", res.accessToken);
      axios.defaults.headers["Authorization"] = res.accessToken;
      router.replace("/");
    };

    login();
  }, [code]);

  return <div></div>;
};

export default App;
