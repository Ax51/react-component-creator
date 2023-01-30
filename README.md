This is a simple CLI utility to helps create React Components.

It could be configured to create a folder, named as the given component name, which has such structure:
<pre>
[path to components folder]
├── Component
│   ├── index.ts
│   ├── Component.tsx
│   ├── Component[.module].css
│   └── Component.spec.ts
</pre>

While you use this util first time, it asks you to config fhe followind properties:
1) default path to the components (such as ./src/Components)
2) your stypesheet files extension (such as .less | .sass | .css etc.)
3) would you like to use module stylesheets
4) would you like to use TypeScript files (.ts) or plain JavaScript (.js)
5) would you like to include test files to your component.

This settings will be saved in component-creator.json file in the root of your project
and used next time you call this util.

After initial setup this util, next time you could use it in 2 ways:
1) Interactive. Just run it (npx @ax51/react-component-creator) and interactively tells new Component name
2) Pass arguments while call util. First argument will be Component name, and the second (optional) is the
custom path (doesn't override settings);
For example:
<pre>
npx @ax51/react-component-creator Header ./view/components
                 ^                  ^              ^
            package name     Component name    custom path
</pre>
