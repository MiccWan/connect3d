/* eslint-disable no-console */
class Logger {
  constructor(tag, Verbose = false) {
    this.tag = `[${tag}]`;
    this.Verbose = Verbose;
  }

  get info() {
    return this.log;
  }

  log(...args) {
    console.log(this.tag, ...args);
  }

  debug(...args) {
    if (this.Verbose) console.debug(...args);
  }

  error(...args) {
    console.error(this.tag, ...args);
  }
}

function newLogger(tag) {
  return new Logger(tag);
}

export default newLogger;
