import {test, expect} from "vitest";
import {snakeCase} from "../src/string";

test("snake case is correct", () => {
    expect(snakeCase("")).toEqual("");
    expect(snakeCase("a")).toEqual("a");
    expect(snakeCase("A")).toEqual("a");
    expect(snakeCase("aB")).toEqual("a_b");
    expect(snakeCase("aBc")).toEqual("a_bc");
    expect(snakeCase("aBcD")).toEqual("a_bc_d");
    expect(snakeCase("aBcD1")).toEqual("a_bc_d1");
    expect(snakeCase("aBcD1E")).toEqual("a_bc_d1_e");
    expect(snakeCase("aBcD1E2")).toEqual("a_bc_d1_e2");
    expect(snakeCase("aBcD1E2F")).toEqual("a_bc_d1_e2_f");
    expect(snakeCase("aBcD1E2F3")).toEqual("a_bc_d1_e2_f3");
    expect(snakeCase("aBcD1E2F3G")).toEqual("a_bc_d1_e2_f3_g");
    expect(snakeCase("aBcD1E2F3G4")).toEqual("a_bc_d1_e2_f3_g4");
    expect(snakeCase("aBcD1E2F3G4H")).toEqual("a_bc_d1_e2_f3_g4_h");
    expect(snakeCase("aBcD1E2F3G4H5")).toEqual("a_bc_d1_e2_f3_g4_h5");
    expect(snakeCase("aBcD1E2F3G4H5I")).toEqual("a_bc_d1_e2_f3_g4_h5_i");
    expect(snakeCase("aBcD1E2F3G4H5I6")).toEqual("a_bc_d1_e2_f3_g4_h5_i6");
    expect(snakeCase("aBcD1E2F3G4H5I6J")).toEqual("a_bc_d1_e2_f3_g4_h5_i6_j");
    expect(snakeCase("aBcD1E2F3G4H5I6J7")).toEqual("a_bc_d1_e2_f3_g4_h5_i6_j7");
    expect(snakeCase("IndexID")).toEqual("index_id");
})