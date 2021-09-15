'use strict';

/**
 * minimalist-acl
 * Copyright(c) 2021 Kledenai Ashver
 * MIT Licensed
 */

class InvalidExpression extends Error {
  constructor() {
    super('Invalid expression.');

    this.name = 'InvalidExpression';
  }
}

const operators: { [props: string]: any } = {
  or: {
    precedence: 1,
    func: (a: string, b: string) => a || b,
  },
  and: {
    precedence: 2,
    func: (a: string, b: string) => a && b,
  },
  not: {
    precedence: 3,
    func: (b: string) => !b,
    n: 1,
  },
};

operators['&&'] = operators.and;
operators['||'] = operators.or;
operators['!'] = operators.not;

const addSpaces = (string: string) => {
  const split = string.split('');
  const characters = split.map((character, i) => {
    if (character === '(' || character === ')') {
      if (split[i - 1] !== ' ') character = ' ' + character;
      if (split[i + 1] !== ' ') character = character + ' ';
    }
    if (character === '!') {
      if (split[i + 1] !== ' ' && split[i + 1] !== '=') {
        character = character + ' ';
      }
    }
    return character;
  });
  return characters.join('');
};

const convertToRPN = (exp: string) => {
  if (typeof exp !== 'string') {
    throw new InvalidExpression();
  }
  exp = exp.replace(/\s+/g, ' ').replace(/\s+$/, '').replace(/^\s+/, '');
  exp = addSpaces(exp);
  const stack = [];
  const rpn = [];
  for (let token of exp.trim().split(' ')) {
    if (operators[token]) {
      while (
        stack[stack.length - 1] &&
        operators[stack[stack.length - 1]] &&
        operators[token].precedence <= operators[stack[stack.length - 1]].precedence
      ) {
        rpn.push(stack.pop());
      }
      stack.push(token);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        rpn.push(stack.pop());
      }
      if (stack[stack.length - 1] === '(') {
        stack.pop();
      } else {
        throw new InvalidExpression();
      }
    } else if (/^[a-zA-Z_-]+$/.test(token)) {
      rpn.push(token);
    } else {
      throw new InvalidExpression();
    }
  }
  return rpn.concat(stack.reverse());
};

const toBool = (token: string, checker: Function) => {
  if (typeof token === 'boolean') {
    return token;
  }
  return checker(token);
};

const check = (expression: string, checker: Function) => {
  const rpn = convertToRPN(expression);
  const stack = [];

  for (let token in rpn) {
    const operator = operators[token];
    if (operator) {
      const numArgs = operator.n || 2;
      let args = [];
      for (let i = 1; i <= numArgs; i++) {
        const arg = toBool(stack.pop(), checker);
        args.push(arg);
      }
      args = args.reverse();
      const result = operator.func(...args);
      stack.push(result);
    } else {
      const result = toBool(token, checker);
      stack.push(result);
    }
  }
  return stack[0];
};

module.exports = { check };
