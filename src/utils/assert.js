import Blueprint from "..";
import Point from "./geometry";

export default function assert(condition, masg) {
  if (!condition) {
    throw new Error(`[blueprint] ${masg}`);
  }
}

export function makeAssertionMessage(key, value, expected) {
  var buf = key + " should be " + expected + ' but "' + key + '"';
  buf += " is " + value + ".";
  return buf;
}

export const assertTypes = {
  functionAssert(key, value) {
    assert(
      Object.prototype.toString.call(value) === "[object Function]",
      makeAssertionMessage(key, value, "function")
    );
  },
  numberAssert(key, value) {
    assert(
      Object.prototype.toString.call(value) === "[object Number]" || !isNaN(+value),
      makeAssertionMessage(key, value, "number")
    );
  },
  arrayAssert(key, value) {
    assert(
      Object.prototype.toString.call(value) === "[object Array]",
      makeAssertionMessage(key, value, "array")
    );
  },
  pointAssert(key, value) {
    assert(value instanceof Point, makeAssertionMessage(key, value, "Point"));
  },
  blueprintAssert(key, value) {
    assert(value instanceof Blueprint, makeAssertionMessage(key, value, "Blueprint"));
  }
};
