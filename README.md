# ![Typescript Logo Small](https://cdn.icon-icons.com/icons2/2415/PNG/32/typescript_original_logo_icon_146317.png) Builder
![npm](https://img.shields.io/npm/dw/@stewartmcgown/ts-builder)
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

// console.log(cthulu)

[class Cthulu] {
    dread: true,
    stats: {
        cultists: 1000,
        kills: 1000000
    }
}
```

## Nested Objects

You can either build nested objects using a builder, or by passing in an object.

```typescript
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

## Auto Class Hydration

`ts-builder` can detect if you are using a class meta framework, like `@nestjs/graphql`, and will hydrate entities it meets with the builder automatically.

```typescript
@ObjectType()
export class A {
    @Field()
    b: B
}

@ObjectType()
export class B {
    @Field()
    c: string

    @Field()
    d: D
}

@ObjectType()
export class D {
    @Field()
    e: string
}

const a = build(A) // No additional config required
    .b(b => b
        .c('Hello World')
        .d(d => d
            .e('Hello World')
        )
    )
    .$build();

a.b.constructor === B // ✅ 
a.b.d.constructor === D // ✅ 
```

If you are using a

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

