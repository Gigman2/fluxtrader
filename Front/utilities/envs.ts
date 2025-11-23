const getEnv = () => {
  const ENV = import.meta.env.VITE_ENVIRONMENT;

  const envs = {
    VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
    VITE_BASE_API_URL: import.meta.env.VITE_BASE_API_URL,
  };

  return envs;
};

export default getEnv;
