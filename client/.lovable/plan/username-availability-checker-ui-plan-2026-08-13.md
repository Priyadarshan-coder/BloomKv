# Username Availability Checker UI Plan

## Goal
Build a React UI for checking username availability. As the user types, the UI debounces the input, calls a backend check, and shows whether the username is already taken or available. The backend integration will be provided by you later.

## Steps

1. **Design Directions**
   - Generate 3 distinct visual directions for the username availability checker.
   - Present them as interactive prototypes for you to pick from before any code is written.

2. **React Component Structure**
   - Create a focused `UsernameChecker` component with:
     - Username input field
     - Real-time debounced validation
     - Loading indicator
     - "Username is available" success message
     - "Username is already taken" error message
     - Basic validation for empty/invalid input
   - Keep the component backend-agnostic by accepting a `checkAvailability` async function as a prop or via a clearly documented placeholder hook.

3. **Home Page**
   - Replace the placeholder `src/routes/index.tsx` with the username checker as the main page.
   - Center the component with a clean, focused layout.

4. **Integration Point**
   - Leave a stubbed `checkUsernameAvailability` function/hook in a client-safe file.
   - Document where your backend call should be plugged in.

5. **SEO / Metadata**
   - Add a route-specific `head()` with title, description, and OpenGraph tags for the page.

## Outcome
A polished, standalone React UI for username availability checking, ready for your backend integration.
