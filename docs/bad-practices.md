# What is Bad Practice?

Organizing code in a well-structured and readable manner reduces development time. This bad practice document defines certain coding rules that every contributor should follow.

**Any new suggestion of bad practice can be put into here**.

Here’s a completed version of your documentation with more clarity and structure:  


## React Import Related Path

In a React project, code should not use relative paths for imports. Instead, it is recommended to register TypeScript path aliases to ensure cleaner and more maintainable imports.

### Incorrect (Relative Path Import)
```tsx
import Button from "../../components/Button";
import Header from "../../../layout/Header";
```

### Correct (Using TypeScript Alias)
```tsx
import Button from "@/components/Button";
import Header from "@/layout/Header";
```

### Setting Up TypeScript Aliases

To configure path aliases in a React project using TypeScript, follow these steps:

1. Open the `tsconfig.json` file and add the following configuration under `compilerOptions`:
   
   ```json
   {
     "compilerOptions": {
       "baseUrl": "src",
       "paths": {
         "@components/*": ["components/*"],
         "@layout/*": ["layout/*"]
       }
     }
   }
   ```

2. Update your `vite.config.ts` (for Vite) or `webpack.config.js` (for Webpack) to recognize the aliases:

   - **For Vite (`vite.config.ts`)**:
     ```ts
     import { defineConfig } from 'vite';
     import react from '@vitejs/plugin-react';
     import path from 'path';

     export default defineConfig({
       plugins: [react()],
       resolve: {
         alias: {
           '@': path.resolve(__dirname, 'src'),
         },
       },
     });
     ```

   - **For Webpack (`webpack.config.js`)**:
     ```js
     const path = require('path');

     module.exports = {
       resolve: {
         alias: {
           '@': path.resolve(__dirname, 'src'),
         },
       },
     };
     ```

3. Restart the development server for changes to take effect.

### Project Structure Example
```
|- react-folder
  |-- src
    |-- components
      |-- Button.tsx
    |-- layout
      |-- Header.tsx
    |-- pages
      |-- Home.tsx
```

Now, instead of using relative imports like `../../components/Button`, you can simply use `@components/Button`, improving code readability and maintainability.
