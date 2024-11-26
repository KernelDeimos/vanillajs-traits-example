/**
 * Allows binding a function to an instance, but allows future binding.
 * @param {*} fn - The function to bind.
 * @param {*} facade - When the function is called on this facade, it will be bound to the instance.
 * @param {*} instance - The instance to bind the function to.
 */


/**
 * Every class that uses traits extends this class,
 * or we add it to Object.prototype and watch chaos ensue.
 */
class Base {
    as(symbol) {
        const impl = Object.create(this);

        const descriptors = Object.getOwnPropertyDescriptors(this[symbol]);
        for ( const key of Object.keys(descriptors) ) {
            const descriptor = descriptors[key];

            if ( typeof descriptor.value === 'function' ) {
                descriptor.value = descriptor.value.bind(impl);
            }
            if ( typeof descriptor.get === 'function' ) {
                descriptors.get = descriptor.get.bind(impl);
            }
            if ( typeof descriptor.set === 'function' ) {
                descriptors.set = descriptor.set.bind(impl);
            }
        }

        Object.defineProperties(impl, descriptors);
        return impl;
    }
}

// TExampleTrait implements a sayHello method.
// In a typescript implementation, this would be an interface
// or somehow associated with an interface (1-1 relationship).
// I'll call this hypothetical interface IExampleTrait.
const TExampleTrait = Symbol('TExampleTrait');

/**
 * A class that implements the TExampleTrait trait.
 */
class ClassWithTraits extends Base {
    constructor() {
        super();
    }

    [TExampleTrait] = {
        sayHello () {
            return `Hello from ${this.name}`;
        }
    }

    get name() {
        return 'ClassWithTraits';
    }
}

const o = new ClassWithTraits();

// The type of o2 is now IExampleTrait.
const o2 = o.as(TExampleTrait);

console.log(o2.sayHello()); // Hello from ClassWithTraits
