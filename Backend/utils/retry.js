const maxAttempts = 3;
const retryDelayMs = 1000;

export async function retryUnavailable(
  operation,
  wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (Number(error.status) !== 503 || attempt >= maxAttempts) {
        throw error;
      }

      await wait(retryDelayMs * attempt);
    }
  }
}
