/**
 * @fileoverview Unit tests for the StateManagerTimestamped class.
 */

import { StateManagerTimestamped } from '../src/state-manager-timestamped';

describe('StateManagerTimestamped', () => {
  let stateManager: StateManagerTimestamped<number>;

  beforeEach(() => {
    stateManager = new StateManagerTimestamped<number>();
  });

  test('should add a new state', () => {
    stateManager.addState(1);
    const currentState = stateManager.getCurrentState();

    expect(currentState).not.toBeNull();
    expect(currentState?.data).toBe(1);
    expect(currentState?.version).toBe(1);
    expect(currentState?.timestamp).toBeGreaterThan(0);
  });

  test('should navigate back and forward in state history', () => {
    stateManager.addState(1);
    stateManager.addState(2);
    stateManager.addState(3);

    expect(stateManager.getCurrentState()?.data).toBe(3);

    stateManager.goBack();
    expect(stateManager.getCurrentState()?.data).toBe(2);

    stateManager.goBack();
    expect(stateManager.getCurrentState()?.data).toBe(1);

    stateManager.goForward();
    expect(stateManager.getCurrentState()?.data).toBe(2);
  });

  test('should handle edge cases for navigation', () => {
    expect(stateManager.goBack()).toBeNull();
    expect(stateManager.goForward()).toBeNull();

    stateManager.addState(1);
    expect(stateManager.goBack()).toBeNull();

    stateManager.addState(2);
    stateManager.goBack();
    stateManager.goForward();
    expect(stateManager.goForward()).toBeNull();
  });

  test('should truncate future states when adding a new state', () => {
    stateManager.addState(1);
    stateManager.addState(2);
    stateManager.goBack();
    stateManager.addState(3);

    const history = stateManager.getHistory();
    expect(history.length).toBe(2);
    expect(history[1].data).toBe(3);
  });

  test('should return full state history', () => {
    stateManager.addState(1);
    stateManager.addState(2);
    stateManager.addState(3);

    const history = stateManager.getHistory();
    expect(history.length).toBe(3);
    expect(history[0].data).toBe(1);
    expect(history[1].data).toBe(2);
    expect(history[2].data).toBe(3);
  });
});
