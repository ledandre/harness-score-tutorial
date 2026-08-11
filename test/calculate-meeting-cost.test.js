import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateMeetingCost } from "../src/calculate-meeting-cost.js";

describe("calculateMeetingCost", () => {
  it("calculates valid meeting cost", () => {
    const result = calculateMeetingCost(6, 45, 120);

    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.totalCost, 540);
    }
  });

  it("keeps fractional totals without rounding before currency formatting", () => {
    const result = calculateMeetingCost(2, 7, 100);

    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.totalCost, 70 / 3);
    }
  });

  describe("invalid intervals", () => {
    it("rejects fewer than one participant", () => {
      const result = calculateMeetingCost(0, 45, 120);

      assert.equal(result.ok, false);
    });

    it("rejects non-positive duration", () => {
      const result = calculateMeetingCost(6, 0, 120);

      assert.equal(result.ok, false);
    });

    it("rejects negative cost per hour", () => {
      const result = calculateMeetingCost(6, 45, -1);

      assert.equal(result.ok, false);
    });
  });

  describe("non-finite inputs", () => {
    it("rejects NaN", () => {
      const result = calculateMeetingCost(Number.NaN, 45, 120);

      assert.equal(result.ok, false);
    });

    it("rejects Infinity", () => {
      const result = calculateMeetingCost(6, Number.POSITIVE_INFINITY, 120);

      assert.equal(result.ok, false);
    });

    it("rejects -Infinity", () => {
      const result = calculateMeetingCost(6, 45, Number.NEGATIVE_INFINITY);

      assert.equal(result.ok, false);
    });
  });
});
