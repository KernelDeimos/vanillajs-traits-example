class Base {
    [key: symbol]: any
    as<T>(symbol: symbol): T {
        const impl = Object.create(this);
        // Object.assign(impl, this[symbol]);
        const descriptors = Object.getOwnPropertyDescriptors(this[symbol]);
        for ( const key of Object.keys(descriptors) ) {
            const descriptor = descriptors[key];
            
            if ( typeof descriptor.get === 'function' ) {
                descriptor.get = descriptor.get.bind(this);
            }
            if ( typeof descriptor.set === 'function' ) {
                descriptor.set = descriptor.set.bind(this);
            }
            if ( typeof descriptor.value === 'function' ) {
                descriptor.value = descriptor.value.bind(this);
            }
        }
        Object.defineProperties(impl, descriptors);
        return impl;
    }
}

const TExampleTrait = Symbol('TExampleTrait');
interface IExampleTrait {
    sayHello (): void
}

class ClassWithTraits extends Base {
    [TExampleTrait] = {
        sayHello (this: ClassWithTraits & IExampleTrait) {
            console.log("Hello from " + this.name)
        }
    }

    get name () {
        return 'ClassWithTraits';
    }
}

const o = new ClassWithTraits();
const o2 = o.as<IExampleTrait>(TExampleTrait);
o2.sayHello();
