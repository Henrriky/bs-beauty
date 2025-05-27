const ENV: { ENVIRONMENT: 'dev' | 'prod'; PORT: number } = {
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
  PORT: 3000,
}

export default ENV
