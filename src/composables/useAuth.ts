import { reactive } from "vue";
import { useRouter } from "vue-router";
import * as sdk from "matrix-js-sdk";

export function useAuth() {
  const router = useRouter();

  const formRef = reactive({
    baseUrl: "",
    login: "",
    password: "",
  });

  async function fetchLogin() {
    try {
      let matrixClient = sdk.createClient({ baseUrl: formRef.baseUrl });
      const result = await matrixClient.loginRequest({
        type: "m.login.password",
        user: formRef.login,
        password: formRef.password,
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function onSubmit() {
    const login = await fetchLogin();
    if (login && login.access_token) {
      localStorage.setItem("matrix_access_token", login.access_token);
      localStorage.setItem("matrix_base_url", formRef.baseUrl);
      localStorage.setItem("matrix_user", formRef.login);
      router.push({ name: "List" });
    }
  }

  return {
    formRef,
    fetchLogin,
    onSubmit,
  };
}
