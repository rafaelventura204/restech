import { calculateBMI } from "../functions";
import { describe, it, expect, test } from "vitest";

describe('BMI test', () => {

    test('test calculate with params 1,0', () => {
        const calculateBMIFunction = () => calculateBMI(1, 0)
        it('should throw error', () => {
            expect(calculateBMIFunction).toThrow()
        })
    });


    test('test calculate with params 4,4', () => {
        const calculateBMIFunction = () => calculateBMI(4, 4)
        it('should not throw error', () => {
            expect(calculateBMIFunction).not.toThrow()
        })
        it('should not throw error', () => {
            expect(calculateBMIFunction()).toBe(0.3)
        })
    });

}) 