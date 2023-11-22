class State {
	counter = 0;
	inc(num) {
		this.counter = num;
	}
}

export const myState = new State();
