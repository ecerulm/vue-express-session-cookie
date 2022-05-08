import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import NavBar from "../NavBar.vue";

describe("NavBar", () => {
  it("renders properly", () => {
    const wrapper = mount(NavBar, { props: { title: "Navbar"} });
    expect(wrapper.text()).toContain("Navbar");
  });
});
