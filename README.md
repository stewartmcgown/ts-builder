# ![Typescript Logo Small](https://cdn.icon-icons.com/icons2/2415/PNG/32/typescript_original_logo_icon_146317.png) Builder

> ### A simple Typescript builder pattern for your project

## Usage

```typescript
import { build } from '@stewartmcgown/ts-builder';

class Cthulu {
    dread: boolean;
    stats: {
        cultists: number;
        kills: number;
    }
}

const cthulu = build(Cthulu)
    .dread(true)
    .stats(b => b
        .cultists(1000)
        .kills(1000000)
    )
    .$build()
```

## Nested Objects

You can either build nested objects using a builder, or by passing in an object.

```typescript

class Cthulu {
    dread: boolean;
    stats: {
        cultists: number;
        kills: number;
    }
}

const cthulu = build(Cthulu)
    .dread(true)
    .stats({
        cultists: 1000,
        kills: 1000000
    })
    .$build()

```

## Interfaces

```typescript

interface Shadow {
    innsmouth: Date;
    water: boolean;
}

const obj = build<Shadow>()
    .innsmouth(new Date())
    .water(() => !!checkWaterIsWet()) // Use functions to set plain values
    .$build();

```


## API


### $build

Builds the object and returns it.


### $set

Sets a property on the object.

```typescript
build(Cthulu)
    .$set('dread', false) // It's his day off
    
    .$build();
```

You may also shallow merge objects using `$set`. Uses `Object.assign`.

```typescript
build(Cthulu)
    .$set({
        stats: {
            cultists: 1000,
            kills: 1000000
        }
    })
```

#### ⚠️ Function Props

If you are using a function prop, you must use `$set` to set it. This is because the builder needs to know that you are setting a function, and not a builder.

```typescript
class Service {
    getSomething: () => Promise<string>;
}

// This will not work the way you want it to
❌ build(Service)
    .getSomething(() => fetch('...')) 

// This will work
✅ build(Service)
    .$set('getSomething', () => fetch('...')) 

// This will also work, but looks a touch ugly
✅ build(Service) 
    .getSomething(() => () => fetch('...'))
```

