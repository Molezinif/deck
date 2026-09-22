// jsdom has no canvas implementation and logs an error on every getContext call
HTMLCanvasElement.prototype.getContext = () => null
