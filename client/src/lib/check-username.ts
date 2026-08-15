/**
 * Stub for checking username availability.
 *
 * Replace this function with your real backend call.
 * It should return `true` if the username is available,
 * and `false` if it is already taken.
 */
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  // Simulate network latency.
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Demo logic: a few common names are considered taken.
  const taken = ["admin", "user", "test", "root", "guest", "demo"];
  return !taken.includes(username.toLowerCase());
}
