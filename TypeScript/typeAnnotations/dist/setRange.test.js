import { setRange } from "./index";
describe("setRange function", () => {
    test("should correctly extract x and y as numbers", () => {
        const result = setRange([10, 20]); // Now returns { x: 10, y: 20 }
        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(typeof result.x).toBe("number");
        expect(typeof result.y).toBe("number");
    });
});
//# sourceMappingURL=setRange.test.js.map