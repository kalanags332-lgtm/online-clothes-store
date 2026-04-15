import { describe, it, expect, vi } from "vitest"
import { listProducts } from "../products"
import { sdk } from "@lib/config"

// Mock the SDK and other dependencies
vi.mock("@lib/config", () => ({
  sdk: {
    client: {
      fetch: vi.fn(() => Promise.resolve({ products: [], count: 0 })),
    },
  },
}))

vi.mock("../regions", () => ({
  getRegion: vi.fn(() => Promise.resolve({ id: "reg_1" })),
  retrieveRegion: vi.fn(() => Promise.resolve({ id: "reg_1" })),
}))

vi.mock("../cookies", () => ({
  getAuthHeaders: vi.fn(() => Promise.resolve({})),
  getCacheOptions: vi.fn(() => Promise.resolve({})),
}))

describe("listProducts data fetcher", () => {
  it("should request the correct fields including variants, inventory, and images", async () => {
    // Call the function
    await listProducts({ countryCode: "us" })

    // Check if fetch was called with the expected query parameters
    expect(sdk.client.fetch).toHaveBeenCalledWith(
      "/store/products",
      expect.objectContaining({
        query: expect.objectContaining({
          fields: expect.stringContaining("*variants.calculated_price"),
          region_id: "reg_1"
        }),
      })
    )

    // Verify specifically the fields string structure we fixed
    const callArgs = (sdk.client.fetch as any).mock.calls[0][1]
    const fields = callArgs.query.fields

    // Check for the expansion patterns we added/fixed
    expect(fields).toContain("*variants.calculated_price")
    expect(fields).toContain("*variants.inventory_quantity")
    expect(fields).toContain("*variants.images")
    
    // Ensure no trailing comma or double commas (a common bug in starters)
    expect(fields).not.toContain(",,")
    expect(fields).not.toMatch(/,$/)
    
    console.log("Verified fields string:", fields)
  })

  it("should pass through additional queryParams", async () => {
    await listProducts({ 
      countryCode: "us", 
      queryParams: { handle: "test-product" } 
    })

    expect(sdk.client.fetch).toHaveBeenCalledWith(
      "/store/products",
      expect.objectContaining({
        query: expect.objectContaining({
          handle: "test-product"
        }),
      })
    )
  })
})
