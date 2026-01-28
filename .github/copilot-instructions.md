
# *description*: This file outlines the general coding best practices for the project.
applyTo: **/*.*

---

- Follow consistent naming conventions: Use camelCase for variables and functions, PascalCase for classes and components, and UPPER_SNAKE_CASE for constants.

- Write clear and concise comments: Ensure that your code is well-documented to enhance readability and maintainability.

- Keep functions and methods short: Aim for single-responsibility functions that are easy to understand and test.

- Refer ./github/skills for general coding skills and best practices.

- Use version control effectively: Commit changes frequently with meaningful messages, and create branches for new features or bug fixes.

- Always use test driven development (TDD) practices: Write tests before implementing functionality to ensure code reliability and maintainability.

- Handle errors gracefully: Implement proper error handling to prevent crashes and provide useful feedback to users.

- Optimize performance: Regularly profile and optimize your code to ensure it runs efficiently.

- Use MCP servers for development and testing whenever possible to ensure consistency across different environments.

---

# *description*: This file outlines the frontend development best practices for the project.
applyTo: **/frontend/**

--- 

- Component-based architecture: Break down the UI into reusable components to enhance maintainability and scalability.

- Mobile first design: Ensure that all components and layouts are optimized for mobile devices before scaling up to larger screens.

- Consistent spacing: Use a consistent spacing system (e.g., 8px increments) for margins and paddings throughout the application.

- Always use semantic HTML5 elements (e.g., ```<header>, <nav>, <main>, <footer>```) to improve accessibility and SEO.

- Alaways use tailwindcss for styling and tailwindcss best practices. Do not use custom CSS unless absolutely necessary.
  - Use utility-first classes to build designs directly in your markup.
  - Avoid using !important in your styles.
  - Prefer composing classes over writing custom CSS.
  - Leverage Tailwind's responsive design features (e.g., sm:, md:, lg:) to create adaptive layouts.
  - Use Container query plugin for better control over component responsiveness.
  - Use h-dvh instead of h-screen for full height elements to account for mobile browser UI.
  - Use aspect-w-<ratio> and aspect-h-<ratio> to maintain consistent aspect ratios for media elements.
  - Use nextjs components like Image, font and Link for optimized performance and better user experience.
  - Use Tailwind's dark mode features to implement theme switching.
  - Always purge unused styles in production builds to reduce CSS file size.
  - Always use nextjs best practices for performance optimization.

- Responsive typography: Utilize relative units (e.g., em, rem) for font sizes to ensure text scales appropriately across different devices.

- Implement state management: Use appropriate state management libraries (e.g., Redux, Zustand) to handle complex application states effectively.

- Always follow accessibility best practices (e.g., WCAG) to ensure the application is usable by all users, including those with disabilities.

- Code should be clean and well-structured: Follow established design patterns and separate concerns (e.g., using MVC or MVVM architectures) to enhance code readability and maintainability.

- Use react hooks, context, suspense, layouts, and server components where appropriate to build efficient and scalable applications.


---

# *description*: This file outlines the backend development best practices for the project.
applyTo: **/backend/**

---

