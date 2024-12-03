/**
 * @fileoverview A state management system with timestamping,
 * versioning, and navigation support. Adheres to Google coding standards.
 */

type State<T> = {
  timestamp: number;
  version: number;
  data: T;
};

export class StateManagerTimestamped<T> {
  private states: State<T>[] = [];
  private currentIndex: number = -1;

  /**
   * Adds a new state to the manager.
   * @param {T} data The data for the new state.
   */
  public addState(data: T): void {
    const timestamp = Date.now();
    const version = this.currentIndex >= 0
      ? this.states[this.currentIndex].version + 1
      : 1;

    const newState: State<T> = { timestamp, version, data };

    // Remove all forward states if adding to the middle of history
    if (this.currentIndex < this.states.length - 1) {
      this.states = this.states.slice(0, this.currentIndex + 1);
    }

    this.states.push(newState);
    this.currentIndex = this.states.length - 1;
  }

  /**
   * Retrieves the current state.
   * @return {State<T> | null} The current state, or null if none exists.
   */
  public getCurrentState(): State<T> | null {
    if (this.currentIndex >= 0) {
      return this.states[this.currentIndex];
    }
    return null;
  }

  /**
   * Navigates to the previous state, if available.
   * @return {State<T> | null} The previous state, or null if unavailable.
   */
  public goBack(): State<T> | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.states[this.currentIndex];
    }
    return null;
  }

  /**
   * Navigates to the next state, if available.
   * @return {State<T> | null} The next state, or null if unavailable.
   */
  public goForward(): State<T> | null {
    if (this.currentIndex < this.states.length - 1) {
      this.currentIndex++;
      return this.states[this.currentIndex];
    }
    return null;
  }

  /**
   * Retrieves the state history.
   * @return {State<T>[]} All stored states.
   */
  public getHistory(): State<T>[] {
    return [...this.states];
  }
}
