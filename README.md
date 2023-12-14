# Movies Search FE Assignment

This repo is meant to serve as an example for our ideal solution to the FE home assignment.

## Do's

1. **Use a router and the URL** - We believe that the best and easiest way to deal with filtering and sorting is by leveraging the URL and search params. A client side router gives you the primitives you need to manipulate the URL in response to use input.
2. **Use the platform** - We believe that you should leverage platform API's as much as possible to offload as much work to the platform you are running in, e.g. `URL`, `URLSearchParams`, `fetch`.
3. **Use next gen tooling** - We believe that FE tooling has evolved a lot in recent years and tools like `Vite` have superseded it's predecessors.
4. **Use Tailwind** - We love Tailwind and believe it is the absolute best way to style web applications.
5. **Use Typescript** - We love Typescript and believe it greatly improves DX.
6. **Use Lodash** - We believe that "line noise" matters and tools like lodash help condense and abstract common operations which result in a much more readable and clear codebase.
7. **Use Prettier** - We believe that code organization matters. Much in the same way as having a tidy desk or bed matters, to our ability to have clear minds and be able to focus on the problem at hand.

## Don'ts

1. **Don't over abstract** - We believe that every abstraction might provide value but always has a cost. Think carefully what abstractions really serve you and make sure that "The juice is worth the squeeze". 
2. **Don't abuse React** - React is a low level tool and is meant for abstractions on top of it. If you are wrangling a bunch of state and effects there is almost always an easier way to do it.
