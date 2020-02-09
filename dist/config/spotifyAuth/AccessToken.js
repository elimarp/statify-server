"use strict";Object.defineProperty(exports, "__esModule", {value: true});class AccessToken {

    static set({ type, value, lifetime }) {
        this.type = type;
        this.value = value;
        this.lifetime = lifetime;
    }

    static get() {
        return {
            type: this.type,
            value: this.value,
            lifetime: this.lifetime,
        }
    }

    static getType() { return this.type }
    static getValue() { return this.value }
    static getLifetime() { return this.lifetime }
    static getFullToken() { return `${this.type} ${this.value}` }
}

exports. default = AccessToken;